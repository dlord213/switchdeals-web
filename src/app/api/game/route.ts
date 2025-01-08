import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer, { Browser } from "puppeteer";
import NodeCache from "node-cache";
import { NextRequest, NextResponse } from "next/server";
import { Game } from "@/types/Game";

const cache = new NodeCache({ stdTTL: 600 });

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");
  const game = url?.split("/").pop();

  if (!url || !url.startsWith("/")) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const getGameData = async () => {
    const cachedData = cache.get(url);
    if (cachedData) return cachedData;

    const response = await axios.get(`https://ntdeals.net${url}`);
    const html = response.data;
    if (!html) throw new Error("Failed to fetch game data");

    const $ = cheerio.load(html);
    const games: Game[] = [];
    const details: Record<string, string> = {};
    const images: string[] = [];

    const title = $(".game-title-info-name")?.text()?.trim() || "Unknown title";
    const description = $('[itemprop="description"]')?.text()?.trim() || "";

    $(".game-info p").each((_, element) => {
      const label = $(element).find("strong").text().replace(":", "").trim();
      const detail = $(element).find(".game-info-detail").text().trim();
      if (label && detail) details[label] = detail;
    });

    $("#carousel-screenshot-single .game-page-carousel-item").each(
      (_, element) => {
        const imageUrl =
          $(element).find("img").attr("data-src") ||
          $(element).find("img").attr("src");
        if (imageUrl) images.push(imageUrl);
      }
    );

    games.push({
      title,
      description,
      details,
      images,
      discount: $(".game-cover-save-regular")?.text()?.trim() || "",
      discountEndDate:
        $(".game-cover-bottom-small")?.text()?.replace("Ends: ", "").trim() ||
        "",
      price: $(".game-buy-button-price-discount")?.text()?.trim() || "",
      originalPrice: $(".game-buy-button-price")?.text()?.trim() || "",
      coverImage: $("img.game-cover-image")
        ?.attr("data-src")
        ?.replace("w_150", "w_1024"),
      eShopLink: $(".game-buy-button-href")?.attr("href"),
    });

    cache.set(url, games);
    return games;
  };

  const getGameMetacriticReviews = async (browser: Browser) => {
    const page = await browser.newPage();
    try {
      await page.goto(
        `https://www.metacritic.com/game/${game}/critic-reviews/`,
        { waitUntil: "domcontentloaded" }
      );
      await page.setViewport({ width: 1080, height: 1024 });
      await page.waitForSelector('[data-testid="product-reviews"]');
      return await page.$$eval(
        '[data-testid="product-review"]',
        (reviewElements) =>
          reviewElements.map((review) => ({
            score: review
              .querySelector(".c-siteReviewHeader_reviewScore span")
              ?.textContent.trim(),
            reviewer: review
              .querySelector(".c-siteReviewHeader_publicationName")
              ?.textContent.trim(),
            date: review
              .querySelector(".c-siteReviewHeader_reviewDate")
              ?.textContent.trim(),
            quote: review
              .querySelector(".c-siteReview_quote span")
              ?.textContent.trim(),
            platform: review
              .querySelector(".c-siteReview_platform")
              ?.textContent.trim(),
            fullReviewLink: review.querySelector(".c-siteReview_externalLink")
              ?.href,
          }))
      );
    } finally {
      await page.close();
    }
  };

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const [games, reviews] = await Promise.all([
      getGameData(),
      getGameMetacriticReviews(browser),
    ]);
    await browser.close();
    return NextResponse.json(
      { gameDetails: games, gameMetacriticReviews: reviews },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch data", details: errorMessage },
      { status: 500 }
    );
  }
}
