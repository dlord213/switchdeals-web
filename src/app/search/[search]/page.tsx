/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import GamesGridCard from "@/components/GamesGridCard";
import Header from "@/components/Header";
import useRegion from "@/stores/useRegion";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ search: string }>;
}) {
  const query = use(params);
  const { region } = useRegion();

  const { data } = useQuery({
    queryKey: [query, region],
    queryFn: async () => {
      if (!query || !region) {
        throw new Error("Query or region parameter is missing.");
      }

      const response = await fetch(
        `/api/search?query=${encodeURIComponent(query.search)}&region=${region}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch game data: ${response.status} ${response.statusText}`
        );
      }

      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  return (
    <main className="flex flex-col gap-4 xl:max-w-[70vw] mx-auto">
      <Header />
      <div className="flex flex-col px-4 lg:px-0">
        <h1 className="font-bold lg:text-3xl">
          Searched for &apos;{decodeURIComponent(query.search)}&apos;
        </h1>
      </div>

      {data ? (
        <>
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-4 px-4 xl:p-0">
            {data.games.map((game: any) => (
              <GamesGridCard data={game} key={game.link} />
            ))}
          </div>
        </>
      ) : null}
    </main>
  );
}
