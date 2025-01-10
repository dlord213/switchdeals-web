export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import axios from "axios";
import * as cheerio from "cheerio";

import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing URL" }, { status: 400 });
  }

  try {
    console.log("Fetching URL:", url);
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
    console.log("Response status:", response.status);
    const html = response.data;
    console.log("HTML length:", html.length);
    if (!html) return NextResponse.json({ games: [] }, { status: 500 });

    const $ = cheerio.load(html);
    const games: {
      title: string;
      discount: string;
      price: string;
      originalPrice: string;
      imageSrc?: string;
      link: string | null;
      type: string;
    }[] = [];

    $(".game-collection-item-link").each((index, element) => {
      const $element = $(element);

      const title = $element
        .find(".game-collection-item-details-title")
        .text()
        .trim();

      const discount = $element
        .find(".game-collection-item-discount")
        .text()
        .trim();

      const price = $element
        .find(".game-collection-item-price-discount")
        .text()
        .trim();

      const originalPrice = $element
        .find(".game-collection-item-price")
        .text()
        .trim();

      const imageSrc = $element
        .find("img.game-collection-item-image")
        .attr("data-src")
        ?.replace("w_192", "w_1024");

      const link = $element.attr("href") || null;
      const type = $element.find(".game-collection-item-type").text().trim();

      games.push({
        title,
        discount,
        price,
        originalPrice,
        imageSrc,
        link,
        type,
      });
    });

    return NextResponse.json({ games }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch data", details: errorMessage },
      { status: 500 }
    );
  }
}
