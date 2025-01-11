import GameDetails from "@/components/GameDetails";
import Header from "@/components/Header";

import { headers } from "next/headers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ game: string }>;
}) {
  const game = (await params).game;
  const decodedUrl = decodeURIComponent(game);

  const host = (await headers()).get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const response = await fetch(`${baseUrl}/api/game_details?url=${decodedUrl}`);
  const gameDetails = await response.json();

  return {
    title: "SwitchDeals - " + gameDetails.gameDetails?.title || "Game Details",
    description: gameDetails.gameDetails?.description || "",
  };
}

export default function Page({
  params,
}: {
  params: Promise<{ value: string }>;
}) {
  return (
    <main className="flex flex-col gap-4 xl:max-w-[70vw] mx-auto">
      <Header />
      <GameDetails params={params} />
    </main>
  );
}
