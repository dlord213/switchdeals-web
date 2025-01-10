export default async function getGameDetails(query: string) {
  if (!query) throw new Error("Query parameter is missing.");

  const parsedJson = JSON.parse(query);
  const decodedUrl = decodeURIComponent(parsedJson.game);

  const response = await fetch(`/api/game_details?url=${decodedUrl}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch game data: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  console.log(data);
  return data;
}
