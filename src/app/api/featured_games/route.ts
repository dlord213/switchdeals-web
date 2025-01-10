import axios from "axios";
import * as cheerio from "cheerio";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data } = await axios.get("https://www.dekudeals.com/recent-drops");

    if (!data) return NextResponse.json({ games: [] }, { status: 500 });

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
