import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url || !url.startsWith("/")) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const getGameVideoReviews = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
      await page.goto(`https://ntdeals.net${url}`, {
        waitUntil: "networkidle2",
      });

      const videos = await page.evaluate(() => {
        const items = document.querySelectorAll(
          "#carousel-videos .game-page-carousel-item"
        );

        return Array.from(items).map((item) => {
          const anchorElement = item as HTMLAnchorElement;
          const href = anchorElement?.href || null;

          const imgElement = item.querySelector(
            "img"
          ) as HTMLImageElement | null;
          const imgSrc = imgElement
            ? imgElement.getAttribute("src") ||
              imgElement.getAttribute("data-src")
            : null;
          const imgAlt = imgElement?.alt || null;

          return { href, imgSrc, imgAlt };
        });
      });

      return videos;
    } catch (err) {
      throw new Error("Failed to scrape data from the URL.");
    } finally {
      await browser.close();
    }
  };

  try {
    const videos = await getGameVideoReviews();
    return NextResponse.json(
      { gameVideoReviewsDetails: videos },
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
