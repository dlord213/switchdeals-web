"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Header from "@/components/Header";
import Link from "next/link";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaArrowLeft, FaArrowRight, FaBagShopping } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

export default function Home() {
  const [link, setLink] = useState(
    "https://ntdeals.net/us-store/discounts?sort=deal-rating"
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
  });

  return (
    <main className="flex flex-col gap-4 xl:max-w-[70vw] mx-auto">
      <Header />
      {featuredGamesData ? (
        <Swiper
          slidesPerView={1}
          spaceBetween={25}
          className="w-full shadow-lg rounded-md"
          modules={[Pagination]}
          pagination={{ clickable: true }}
        >
          {featuredGamesData.games.slice(0, 10).map((game, index) => (
            <SwiperSlide key={index} className="rounded-md">
              <Link
                className="relative flex flex-col justify-end p-8 h-[360px]"
                href={{ pathname: "/game", query: { game: game.link } }}
              >
                <img
                  src={game.imageSrc}
                  alt={game.title}
                  className="absolute top-0 left-0 w-full max-h-[360px] object-cover brightness-75 rounded-md"
                />
                <h2 className="z-10 font-black text-3xl text-white carousel-text-shadow">
                  {game.title}
                </h2>
                <p className="z-10 text-3xl text-white carousel-text-shadow">
                  {game.price}
                </p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : null}
      <div className="flex flex-row gap-4 items-end">
        <FaBagShopping size={36} />
        <h1 className="text-2xl font-bold">Sales/Discounts</h1>
      </div>
      {gamesData ? (
        <>
          <div className="grid grid-cols-4 gap-4">
            {gamesData.games.map((game, index) => (
              <Link
                className="flex flex-col border rounded-md transition-all duration-200 delay-0 hover:scale-105 hover:shadow-xl cursor-pointer"
                key={game.title}
                href={{ pathname: "/game", query: { game: game.link } }}
              >
                <div className="flex flex-col items-end relative w-full h-[180px]">
                  <p className="w-fit m-2 z-10 py-2 px-4 bg-red-500 text-white rounded-md shadow-2xl">
                    {game.discount}
                  </p>
                  <img
                    src={game.imageSrc}
                    className="absolute top-0 left-0 w-full rounded-tl-md rounded-tr-md"
                  />
                </div>
                <div className="flex flex-col gap-2 py-2 px-4">
                  <h1>{game.title}</h1>
                  <div className="flex flex-row gap-2">
                    <h1 className="font-bold text-lg">{game.price}</h1>
                    <h1 className="text-lg line-through">
                      {game.originalPrice}
                    </h1>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-end flex-row gap-2 mb-4">
            <button
              className="py-2 px-6 rounded-md shadow border"
              onClick={() => {
                if (page > 1) {
                  setPage((prevPage) => prevPage - 1);
                  setLink(
                    `https://ntdeals.net/us-store/discounts${
                      page - 1 === 1 ? "" : `/${page - 1}`
                    }?sort=deal-rating`
                  );
                }
              }}
            >
              <FaArrowLeft size={16} />
            </button>

            <button
              className="py-2 px-6 rounded-md shadow border"
              onClick={() => {
                setPage((prevPage) => prevPage + 1);
                setLink(
                  `https://ntdeals.net/us-store/discounts/${
                    page + 1
                  }?sort=deal-rating`
                );
              }}
            >
              <FaArrowRight size={16} />
            </button>
          </div>
        </>
      ) : null}
    </main>
  );
}
