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
import Footer from "@/components/Footer";

export default function Home() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [sort, setSort] = useState("");

  const link = useMemo(() => {
    let baseUrl = `https://www.dekudeals.com/hottest?filter[store]=eshop`;

    if (page !== 1) {
      baseUrl += `&page=${page}`;
    }

    if (type) {
      baseUrl += `&${type}`;
    }

    if (sort) {
      baseUrl += `&sort=${sort}`;
    }

    return baseUrl;
  }, [page, type, sort]);

  const {
    data: gamesData,
    isLoading: isGamesLoading,
    isError: isGamesError,
  } = useQuery({
    queryKey: ["gamesData", link],
    queryFn: async () => {
      console.log(link);
      const response = await fetch(
        `api/games?page=${page}&type=${type}&sort=${sort}`
      );
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
    <main className="flex flex-col xl:gap-4 xl:max-w-[70vw] mx-auto min-h-screen">
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
          <div className="flex flex-col justify-center items-center my-8">
            <FourSquare size="large" color="#B03B48" />
          </div>
        )}
        {isGamesError && (
          <div className="flex flex-col justify-center items-center">
            <h1 className="font-bold text-3xl">Error, please try again.</h1>
          </div>
        )}
        {gamesData && (
          <>
            <div className="flex flex-row gap-2 my-4 xl:my-0 lg:gap-0 items-end px-4 xl:p-0">
              <FaBagShopping size={36} />
              <h1 className="text-2xl font-bold">Sales/Discounts</h1>
            </div>
            <div className="flex flex-row gap-2 my-4 px-4 xl:p-0">
              <button
                className={
                  type === ""
                    ? "px-4 py-2 border rounded-md shadow bg-[#B03B48] text-white cursor-pointer"
                    : "px-4 py-2 border rounded-md shadow cursor-pointer"
                }
                onClick={() => setType("")}
              >
                Game
              </button>
              <button
                className={
                  type === "filter[type]=bundle"
                    ? "px-4 py-2 border rounded-md shadow bg-[#B03B48] text-white cursor-pointer"
                    : "px-4 py-2 border rounded-md shadow cursor-pointer"
                }
                onClick={() => setType("filter[type]=bundle")}
              >
                Bundle
              </button>
              <select
                className="border px-2 rounded-md shadow"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="hottest">Hottest deals</option>
                <option value="most_wanted">Most wanted</option>
                <option value="most_owned">Most owned</option>
              </select>
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
      {gamesData && <Footer />}
    </main>
  );
}
