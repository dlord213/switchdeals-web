/* eslint-disable @typescript-eslint/no-unused-vars */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import axios from "axios";
import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { data } = await axios.get("https://www.dekudeals.com/hottest");
    console.log(data);

    const $ = cheerio.load(data);

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
  } catch (error) {
    console.error("Error fetching latest phones data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch data", details: errorMessage },
      { status: 500 }
    );
  }
}
