/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Header from "@/components/Header";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaBagShopping } from "react-icons/fa6";
import GamesGridCard from "@/components/GamesGridCard";
import GamesGridPageButtons from "@/components/GamesGridPageButtons";
import GamesSlidableWideCard from "@/components/GamesSlidableWideCard";
import useRegion from "@/stores/useRegion";

export default function Home() {
  const { region } = useRegion();

  const [link, setLink] = useState(
    `https://ntdeals.net/${region}-store/discounts?sort=deal-rating`
  );
  const [page, setPage] = useState(1);

  const { data: gamesData } = useQuery({
    queryKey: [link, page, "eshop-sales"],
    queryFn: async () => {
      try {
        if (link) {
          const response = await fetch(`api/games?url=${link}`);
          const data = await response.json();

          console.log(data);

          return data;
        }
      } catch (err) {
        console.error(err);
        return err;
      }
    },
  });

  const { data: featuredGamesData } = useQuery({
    queryKey: ["eshop-featured"],
    queryFn: async () => {
      try {
        if (link) {
          const response = await fetch(
            "api/games?url=https://ntdeals.net/us-store/discounts?sort=best-new-deals"
          );
          const data = await response.json();

          console.log(data);

          return data;
        }
      } catch (err) {
        console.error(err);
        return err;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
    retry: 3,
  });

  const previousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
      setLink(
        `https://ntdeals.net/us-store/discounts${
          page - 1 === 1 ? "" : `/${page - 1}`
        }?sort=deal-rating`
      );
    }
  };
  const nextPage = () => {
    setPage((prevPage) => prevPage + 1);
    setLink(
      `https://ntdeals.net/us-store/discounts/${page + 1}?sort=deal-rating`
    );
  };

  useEffect(() => {
    setLink(
      `https://ntdeals.net/${region}-store/discounts${
        page === 1 ? "" : `/${page}`
      }?sort=deal-rating`
    );
  }, [region, page]);

  return (
    <main className="flex flex-col gap-4 xl:max-w-[70vw] mx-auto">
      <Header />
      {featuredGamesData ? (
        <GamesSlidableWideCard data={featuredGamesData.games} />
      ) : null}
      <div className="flex flex-row gap-4 items-end">
        <FaBagShopping size={36} />
        <h1 className="text-2xl font-bold">Sales/Discounts</h1>
      </div>
      {gamesData ? (
        <>
          <div className="grid grid-cols-4 gap-4">
            {gamesData.games.map((game: any) => (
              <GamesGridCard data={game} key={game.link} />
            ))}
          </div>
          <GamesGridPageButtons
            nextBtnFunction={nextPage}
            prevBtnFunction={previousPage}
          />
        </>
      ) : null}
    </main>
  );
}
