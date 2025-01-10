import { NextRequest, NextResponse } from "next/server";
import puppeteer, { Browser } from "puppeteer";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");
  const game = url?.split("/").pop();

  if (!url || !url.startsWith("/")) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const getGameMetacriticReviews = async (browser: Browser) => {
    const page = await browser.newPage();
    try {
      await page.goto(
        `https://www.metacritic.com/game/${game}/critic-reviews/`,
        { waitUntil: "domcontentloaded" }
      );
      await page.setViewport({ width: 1080, height: 1024 });
      await page.waitForSelector('[data-testid="product-reviews"]', {
        timeout: 60000,
      });

      return await page.$$eval(
        '[data-testid="product-review"]',
        (reviewElements) =>
          reviewElements.map((review) => ({
            score:
              review
                .querySelector(".c-siteReviewHeader_reviewScore span")
                ?.textContent?.trim() || null,
            reviewer:
              review
                .querySelector(".c-siteReviewHeader_publicationName")
                ?.textContent?.trim() || null,
            date:
              review
                .querySelector(".c-siteReviewHeader_reviewDate")
                ?.textContent?.trim() || null,
            quote:
              review
                .querySelector(".c-siteReview_quote span")
                ?.textContent?.trim() || null,
            platform:
              review
                .querySelector(".c-siteReview_platform")
                ?.textContent?.trim() || null,
            fullReviewLink:
              (
                review.querySelector(
                  ".c-siteReview_externalLink"
                ) as HTMLAnchorElement
              )?.href || null,
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
    const reviews = await getGameMetacriticReviews(browser);
    await browser.close();
    return NextResponse.json(
      { gameMetacriticReviews: reviews },
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
