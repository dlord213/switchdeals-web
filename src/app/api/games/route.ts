import { client, cookieJar } from "@/lib/client";
import * as cheerio from "cheerio";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || "1";
  const type = searchParams.get("type") || "";
  const sort = searchParams.get("sort") || "";
  const region = searchParams.get("region") || "";

  console.log(region);

  try {
    await client.post("https://www.dekudeals.com/locale", `country=${region}`, {
      jar: cookieJar,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Origin: "https://www.dekudeals.com",
        Referer:
          "https://www.dekudeals.com/hottest?filter[store]=eshop&page=${page}&${type}&sort=${sort}",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
      },
      maxRedirects: 5,
    });

    const { data } = await client.get(
      `https://www.dekudeals.com/hottest?filter[store]=eshop${region}&page=${page}&${type}&sort=${sort}`,
      {
        jar: cookieJar,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
        },
      }
    );

    if (!data) {
      return NextResponse.json({ games: [] }, { status: 500 });
    }
    const $ = cheerio.load(data);

    const games: {
      productTitle: string;
      imgSrc: string | undefined;
      discount: string;
      price: string;
      originalPrice: string;
      link: string | undefined;
    }[] = [];

    $(".browse-cards.desktop > .row > .col").each((index, element) => {
      const $element = $(element);

      const productTitle = $element.find(".main-link h6").text().trim();
      const imgSrc = $element.find(".img-frame img").attr("src");
      const price = $element
        .find(".d-flex.align-items-center.text-tight strong")
        .text()
        .trim();
      const originalPrice = $element
        .find(".d-flex.align-items-center.text-tight s")
        .text()
        .trim();
      const discount = $element.find(".badge-danger").text().trim();
      const link = $element.find(".main-link").attr("href");

      games.push({
        productTitle,
        imgSrc,
        discount,
        price,
        originalPrice,
        link,
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
