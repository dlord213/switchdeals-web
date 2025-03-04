import { createScraperClient } from "@/lib/client";
import * as cheerio from "cheerio";

import { NextRequest, NextResponse } from "next/server";

const client = createScraperClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || "1";
  const type = searchParams.get("type") || "";
  const sort = searchParams.get("sort") || "";
  const region = searchParams.get("region") || "";

  try {
    await client.post("https://www.dekudeals.com/locale", `country=${region}`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Origin: "https://www.dekudeals.com",
        Referer: "https://www.dekudeals.com/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
      },
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    const url = new URL("https://www.dekudeals.com/hottest");
    url.searchParams.set("filter[store]", "eshop");
    url.searchParams.set("page", page);
    if (type) {
      url.searchParams.set("filter[type]", type);
    }
    url.searchParams.set("sort", sort);
    if (region !== "us") {
      url.searchParams.set("filter[store]", "eshop" + region);
    }

    const { data } = await client.get(url.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
      },
    });

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
      region: string | undefined;
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
      const link = $element
        .find(".main-link")
        .attr("href")
        ?.replace("?", "&")
        .replace(/(eshop)(?=\w)/, "$1_");

      games.push({
        productTitle,
        imgSrc,
        discount,
        price,
        originalPrice,
        link,
        region: region,
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
