import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const region = searchParams.get("region");

  if (!query || !region) {
    return NextResponse.json(
      { error: "Missing query or region parameter" },
      { status: 400 }
    );
  }

  try {
    const url = `https://ntdeals.net/${region}-store/search?search_query=${query}`;
    const response = await axios.get(url);
    const html = response.data;

    if (!html) {
      return NextResponse.json({ games: [] }, { status: 500 });
    }

    const $ = cheerio.load(html);
    const games = $(".game-collection-item-link")
      .map((_, element) => {
        const $element = $(element);

        return {
          title: $element
            .find(".game-collection-item-details-title")
            .text()
            .trim(),
          discount: $element
            .find(".game-collection-item-discount")
            .text()
            .trim(),
          price: $element
            .find(".game-collection-item-price-discount")
            .text()
            .trim(),
          originalPrice: $element
            .find(".game-collection-item-price")
            .text()
            .trim(),
          imageSrc: $element
            .find("img.game-collection-item-image")
            .attr("data-src")
            ?.replace("w_192", "w_1024"),
          link: $element.attr("href"),
        };
      })
      .get();

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
