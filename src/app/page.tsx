/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Header from "@/components/Header";
import GamesGridCard from "@/components/GamesGridCard";
import GamesGridPageButtons from "@/components/GamesGridPageButtons";
import GamesSlidableWideCard from "@/components/GamesSlidableWideCard";

import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaBagShopping, FaDownload, FaFilter } from "react-icons/fa6";
import { FourSquare } from "react-loading-indicators";
import Footer from "@/components/Footer";
import useRegion from "@/stores/useRegion";
import Link from "next/link";
import Filtering from "@/components/Filtering";
import { MdClose, MdError } from "react-icons/md";

export default function Home() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [sort, setSort] = useState("");
  const [genre, setGenre] = useState("");
  const [isFiltersVisible, setFilterVisibility] = useState(true);
  const { region } = useRegion();
  const alertRef = useRef<any>(null);

  const link = useMemo(() => {
    let baseUrl = `https://www.dekudeals.com/hottest?filter[store]=eshop`;

    if (region != "us") {
      baseUrl += `_${region}`;
    }

    if (page !== 1) {
      baseUrl += `&page=${page}`;
    }

    if (type) {
      baseUrl += `&${type}`;
    }

    if (sort) {
      baseUrl += `&sort=${sort}`;
    }

    if (genre) {
      baseUrl += `&genre=${genre}`;
    }

    return baseUrl;
  }, [page, type, sort, region, genre]);

  const {
    data: gamesData,
    isLoading: isGamesLoading,
    isError: isGamesError,
  } = useQuery({
    queryKey: ["gamesData", link],
    queryFn: async () => {
      const response = await fetch(
        `api/games?region=${region}&page=${page}&type=${type}&sort=${sort}&genre=${genre}`
      );
      if (!response.ok) throw new Error("Failed to fetch games data");
      return response.json();
    },
    staleTime: 10 * 60 * 1000,
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const { data: featuredGamesData } = useQuery({
    queryKey: ["featuredGames", region],
    queryFn: async () => {
      const response = await fetch(`api/featured_games?region=${region}`);
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

  useEffect(() => {
    if (window.innerWidth < 500) {
      setFilterVisibility(false);
    }
  }, []);

  return (
    <main className="flex flex-col xl:gap-4 xl:max-w-[70vw] mx-auto min-h-screen ">
      <Header />
      <section className="lg:flex flex-col hidden gap-4">
        <h1 className="text-4xl font-black">Featured</h1>
        {featuredGamesData && (
          <GamesSlidableWideCard data={featuredGamesData.games} />
        )}
      </section>
      <section className="relative">
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
            <div className="flex gap-4 md:hidden p-4 m-4 rounded-md bg-zinc-900 ">
              <h1>
                If you&apos;re an Android user, you can use our Android app
                instead of browsing in the website!
              </h1>
              <Link
                href="https://github.com/dlord213/switchdeals-android/releases/download/1.02/switchdeals.apk"
                target="_blank"
                className="py-2 px-6 flex items-center justify-center rounded-md shadow border transition-colors duration-200 bg-white hover:bg-gray-100 active:bg-gray-200 dark:bg-zinc-800 dark:border-zinc-800 dark:hover:bg-zinc-900"
                aria-label="Previous Page"
              >
                <FaDownload size={16} />
              </Link>
            </div>
            <div className="flex lg:hidden flex-row gap-4 my-4 xl:my-0 items-center justify-between px-4 xl:p-0">
              <div className="flex items-center gap-4">
                <FaBagShopping size={36} className="dark:text-zinc-200" />
                <h1 className="text-2xl font-bold dark:text-zinc-200">
                  Sales/Discounts
                </h1>
              </div>
              <button
                className={
                  isFiltersVisible
                    ? "px-4 py-2 border rounded-md shadow bg-[#B03B48] text-white cursor-pointer dark:bg-zinc-800 dark:border-zinc-700"
                    : "px-4 py-2 border rounded-md shadow cursor-pointer dark:border-0 dark:bg-zinc-800"
                }
              >
                <FaFilter
                  onClick={() => setFilterVisibility((prev) => !prev)}
                  size={16}
                />
              </button>
            </div>
            <div className="flex relative lg:flex-row flex-col gap-6">
              <Filtering
                genre={genre}
                sort={sort}
                type={type}
                isVisible={isFiltersVisible}
                setGenre={setGenre}
                setSort={setSort}
                setType={setType}
              />
              <div className="flex flex-col gap-4">
                <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-4 px-4 xl:p-0">
                  {gamesData.games.map((game: any) => (
                    <GamesGridCard data={game} key={game.link} />
                  ))}
                </div>
                {gamesData.games.length > 28 && (
                  <GamesGridPageButtons
                    prevBtnFunction={previousPage}
                    nextBtnFunction={nextPage}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </section>
      {gamesData && <Footer />}
      <div
        ref={alertRef}
        className="fixed bottom-12 right-8 p-4 bg-white hover:bg-gray-100 active:bg-gray-200 dark:bg-zinc-800 dark:border-zinc-800 dark:hover:bg-zinc-900 flex gap-4 items-center rounded-3xl max-w-sm z-50"
      >
        <MdError size={36} className="shrink-0" />
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p>April 20, 2025</p>
            <MdClose
              size={24}
              className="shrink-0 cursor-pointer"
              onClick={() => {
                alertRef.current.style.display = "none";
              }}
            />
          </div>
          <h1 className="font-bold">
            The deals not appearing has been addressed, the cause is in our
            APIs.
          </h1>
        </div>
      </div>
    </main>
  );
}
