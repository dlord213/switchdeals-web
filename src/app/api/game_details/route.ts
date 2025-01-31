/* eslint-disable @typescript-eslint/no-explicit-any */
import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";
import { createScraperClient } from "@/lib/client";

const client = createScraperClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");
  const region = searchParams.get("region");
  const store = searchParams.get("store");

  if (!url || !url.startsWith("/")) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const getGameData = async () => {
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

    const { data, config } = await client.get(
      `https://www.dekudeals.com${url}?${store}`
    );
    if (!data) throw new Error("Failed to fetch game data");

    console.log(config);

    const $ = cheerio.load(data);

    const imageSources: string[] = [];
    const recommendations: {
      title: string;
      imageUrl: string | undefined;
      originalPrice: string | null;
      discountedPrice: string | null;
      price: string;
      href: string | undefined;
    }[] = [];
    const gameDetails: any = {};

    /* LEFT SIDE ====================================================================== */
    gameDetails.image = $(".responsive-img").attr("src");
    $(".details .list-group-item").each((index, element) => {
      const key = $(element).find("strong").text().replace(":", "").trim();
      let value: any;

      // Handle nested lists
      if ($(element).find("ul").length > 0) {
        value = {};
        $(element)
          .find("ul li")
          .each((i, li) => {
            const subKey = $(li).find("strong").text().replace(":", "").trim();
            value[subKey] = $(li).text().replace(`${subKey}:`, "").trim();
          });
      } else if ($(element).find("a").length > 0) {
        // Handle links (extract the text or URL)
        value = $(element)
          .find("a")
          .map((i, el) => {
            return {
              genreName: $(el).text().trim(),
              genreLink: $(el).attr("href"),
            };
          })
          .get();
      } else {
        // Handle plain text values
        value = $(element)
          .text()
          .replace($(element).find("strong").text(), "")
          .trim();

        // Split concatenated values for release date if present
        if (key === "Release date") {
          value = value.split(",").map((date: string) => date.trim());
        }

        // Handle "How Long To Beat"
        if (key === "How Long To Beat") {
          const times = $(element)
            .text()
            .match(/Main Story:(.*?)Main \+ Extra:(.*?)Completionist:(.*)/);
          if (times) {
            value = {
              "Main Story": times[1].trim(),
              "Main + Extra": times[2].trim(),
              Completionist: times[3].trim(),
            };
          }
        }
      }

      gameDetails[key] = value;
    });
    /* LEFT SIDE ====================================================================== */

    /* RIGHT SIDE ====================================================================== */
    $("#screenshotPreviews img").each((index, element) => {
      const imgSrc: any = $(element).attr("data-src");
      imageSources.push(imgSrc);
    });

    $(".row.item-grid2 .cell").each((index, element) => {
      const title = $(element).find(".name").text().trim();
      const imageUrl = $(element).find("img").attr("src");
      const href = $(element)
        .find("a.main-link")
        .attr("href")
        ?.replace("?", "&");

      let price = $(element).find(".price").text().trim();
      let originalPrice = null;
      let discountedPrice = null;

      if ($(element).find(".card-badge").length > 0) {
        originalPrice = $(element).find(".text-muted").text().trim();
        discountedPrice = $(element).find("strong").text().trim();
        price = discountedPrice;
      }

      recommendations.push({
        title,
        imageUrl,
        originalPrice,
        discountedPrice,
        price,
        href: href,
      });
    });

    const table = $(".col-lg-6 > table").eq(0);
    gameDetails["eshopLink"] = table.find("a").attr("href");
    gameDetails["discountedPrice"] = table
      .find(".btn.btn-block.btn-primary")
      .text()
      .trim()
      .split("\n")[0];
    gameDetails["description"] = $(".description").text().trim();
    gameDetails["images"] = imageSources;
    gameDetails["recommendations"] = recommendations;
    gameDetails["title"] = $(".clearfix.mb-2 > h2").text().trim();
    /* RIGHT SIDE ====================================================================== */

    return gameDetails;
  };

  try {
    const details = await getGameData();
    return NextResponse.json({ gameDetails: details }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch data", details: errorMessage },
      { status: 500 }
    );
  }
}
