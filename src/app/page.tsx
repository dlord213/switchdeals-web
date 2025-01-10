/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Header from "@/components/Header";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaBagShopping } from "react-icons/fa6";
import GamesGridCard from "@/components/GamesGridCard";
import GamesGridPageButtons from "@/components/GamesGridPageButtons";
import GamesSlidableWideCard from "@/components/GamesSlidableWideCard";
import useRegion from "@/stores/useRegion";
import { FourSquare } from "react-loading-indicators";

export default function Home() {
  const { region } = useRegion();
  const [page, setPage] = useState(1);

  const link = useMemo(
    () =>
      `https://ntdeals.net/${region}-store/discounts${
        page === 1 ? "" : `/${page}`
      }?sort=deal-rating`,
    [region, page]
  );

  const {
    data: gamesData,
    isLoading: isGamesLoading,
    isError: isGamesError,
  } = useQuery({
    queryKey: ["gamesData", link],
    queryFn: async () => {
      const response = await fetch(`api/games?url=${link}`);
      if (!response.ok) throw new Error("Failed to fetch games data");
      return response.json();
    },
    staleTime: 10 * 60 * 1000,
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const {
    data: featuredGamesData,
    isLoading: isFeaturedLoading,
    isError: isFeaturedError,
  } = useQuery({
    queryKey: ["featuredGames"],
    queryFn: async () => {
      const response = await fetch(
        "api/games?url=https://ntdeals.net/us-store/discounts?sort=best-new-deals"
      );
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
    <main className="flex flex-col gap-4 xl:max-w-[70vw] mx-auto">
      <Header />

      <section>
        {isFeaturedLoading && (
          <div className="flex flex-col justify-center items-center">
            <FourSquare size="large" color="#ef4444" />
          </div>
        )}
        {isFeaturedError && (
          <div className="flex flex-col justify-center items-center">
            <h1 className="font-bold text-3xl">Error, please try again.</h1>
          </div>
        )}
        {featuredGamesData && (
          <GamesSlidableWideCard data={featuredGamesData.games} />
        )}
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
            <div className="flex flex-row gap-4 my-4 items-end">
              <FaBagShopping size={36} />
              <h1 className="text-2xl font-bold">Sales/Discounts</h1>
            </div>

            <div className="grid grid-cols-4 gap-4">
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
