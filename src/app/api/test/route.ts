/* eslint-disable @typescript-eslint/no-unused-vars */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import axios from "axios";
import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { data } = await axios.get("https://www.gsmarena.com/");

    const $ = cheerio.load(data);

    // Extract latest phones
    const latestPhones: {
      model: string;
      image: string | undefined;
      link: string | undefined;
    }[] = [];
    $(
      '.module-latest:has(h4.section-heading:contains("Latest devices")) .module-phones-link'
    ).each((_, el) => {
      const model = $(el).text().trim();
      const image = $(el).find("img").attr("src");
      const link = $(el).attr("href")?.replace(".php", "");
      latestPhones.push({ model, image, link });
    });

    // Extract phones in stores now
    const phonesInStore: {
      model: string;
      image: string | undefined;
      link: string | undefined;
    }[] = [];
    $(
      '.module-latest:has(h4.section-heading:contains("In stores now")) .module-phones-link'
    ).each((_, el) => {
      const model = $(el).text().trim();
      const image = $(el).find("img").attr("src");
      const link = $(el).attr("href")?.replace(".php", "");
      phonesInStore.push({ model, image, link });
    });

    const result = {
      latestPhones,
      phonesInStore,
    };

    return NextResponse.json(result, { status: 200 });
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
