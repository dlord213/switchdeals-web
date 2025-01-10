"use client";
import GamesGridCard from "@/components/GamesGridCard";
import GamesGridPageButtons from "@/components/GamesGridPageButtons";
import Header from "@/components/Header";
import useRegion from "@/stores/useRegion";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

export default function Page({ params }) {
  const query = use(params);
  const { region } = useRegion();

  const { data, isFetching, error } = useQuery({
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
      <div className="flex flex-col">
        <h1 className="font-bold lg:text-3xl">
          Searched for '{decodeURIComponent(query.search)}'
        </h1>
      </div>

      {data ? (
        <>
          <div className="grid grid-cols-4 gap-4">
            {data.games.map((game: any) => (
              <GamesGridCard data={game} key={game.link} />
            ))}
          </div>
        </>
      ) : null}
    </main>
  );
}
