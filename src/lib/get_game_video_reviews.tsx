export default async function getGameVideoReviews(query: string) {
  try {
    if (!query) throw new Error("Query parameter is missing.");

    const parsedJson = JSON.parse(query);
    const decodedUrl = decodeURIComponent(parsedJson.game);

    const response = await fetch(`/api/game_video_reviews?url=${decodedUrl}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch game data: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (err) {
    return err;
  }
}
