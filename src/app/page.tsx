/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Header from "@/components/Header";
import GamesGridCard from "@/components/GamesGridCard";
import GamesGridPageButtons from "@/components/GamesGridPageButtons";
import GamesSlidableWideCard from "@/components/GamesSlidableWideCard";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaBagShopping } from "react-icons/fa6";
import { FourSquare } from "react-loading-indicators";

export default function Home() {
  const [page, setPage] = useState(1);

  const link = useMemo(
    () =>
      `https://www.dekudeals.com/hottest?filter[store]=eshop${
        page === 1 ? "" : `&page=${page}`
      }`,
    [page]
  );

  const {
    data: gamesData,
    isLoading: isGamesLoading,
    isError: isGamesError,
  } = useQuery({
    queryKey: ["gamesData", link],
    queryFn: async () => {
      const response = await fetch(`api/games?page=${page}`);
      if (!response.ok) throw new Error("Failed to fetch games data");
      return response.json();
    },
    staleTime: 10 * 60 * 1000,
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const { data: featuredGamesData } = useQuery({
    queryKey: ["featuredGames"],
    queryFn: async () => {
      const response = await fetch("api/featured_games/");
      if (!response.ok) throw new Error("Failed to fetch featured games");
      return response.json();
    },
    staleTime: 10 * 60 * 1000,
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const previousPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <main className="flex flex-col xl:gap-4 xl:max-w-[70vw] mx-auto">
      <Header />

      <section>
        <div className="hidden xl:block">
          {featuredGamesData && (
            <GamesSlidableWideCard data={featuredGamesData.games} />
          )}
        </div>
      </section>

      <section>
        {isGamesLoading && (
          <div className="flex flex-col justify-center items-center">
            <FourSquare size="large" color="#ef4444" />
          </div>
        )}
        {isGamesError && (
          <div className="flex flex-col justify-center items-center">
            <h1 className="font-bold text-3xl">Error, please try again.</h1>
          </div>
        )}
        {gamesData && (
          <>
            <div className="flex flex-row gap-4 my-4 items-end px-4 xl:p-0">
              <FaBagShopping size={36} />
              <h1 className="text-2xl font-bold">Sales/Discounts</h1>
            </div>
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-4 px-4 xl:p-0">
              {gamesData.games.map((game: any) => (
                <GamesGridCard data={game} key={game.link} />
              ))}
            </div>
            <GamesGridPageButtons
              prevBtnFunction={previousPage}
              nextBtnFunction={nextPage}
            />
          </>
        )}
      </section>
    </main>
  );
}
