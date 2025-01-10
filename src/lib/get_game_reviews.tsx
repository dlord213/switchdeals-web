export default async function getGameReviews(query: string) {
  try {
    if (!query) throw new Error("Query parameter is missing.");

    const parsedJson = JSON.parse(query);
    const decodedUrl = decodeURIComponent(parsedJson.game);

    console.log(decodedUrl);
    const response = await fetch(`/api/game_reviews?url=${decodedUrl}`);

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
