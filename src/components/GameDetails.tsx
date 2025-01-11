/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useQuery } from "@tanstack/react-query";
import { FaShoppingBag } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { FourSquare } from "react-loading-indicators";
import getGameDetails from "@/lib/get_game_details";
import Link from "next/link";
import {
  FaAddressBook,
  FaArrowDown,
  FaCalendar,
  FaChalkboardUser,
} from "react-icons/fa6";

export default function GameDetails({ params }: any) {
  const { value } = params;

  const {
    data: gameDetailsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["game", value],
    queryFn: () => getGameDetails(value),
    enabled: Boolean(value),
    refetchOnWindowFocus: false,
    staleTime: 15 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FourSquare size="large" color="#ef4444" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-xl text-red-500 font-bold">
          {error?.message || "An error occurred while loading data."}
        </p>
      </div>
    );
  }

  const gameDetails = gameDetailsData?.gameDetails || {};
  const {
    title,
    image,
    MSRP,
    eshopLink,
    discountedPrice,
    description,
    images,
    recommendations,
  } = gameDetails;

  return (
    <main className="flex flex-col md:gap-4 xl:max-w-[70vw] mx-auto">
      {gameDetailsData ? (
        <>
          <section className="min-h-screen flex flex-col lg:flex-row gap-4 mb-4 xl:p-0 p-4">
            <aside className="flex flex-col gap-2 lg:basis-[30%] 2xl:basis-[30%] h-fit lg:border lg:shadow-md lg:rounded-md lg:p-4">
              <h1 className="block md:hidden font-black text-3xl">{title}</h1>
              <img
                src={image}
                className="lg:w-full lg:max-w-full w-full rounded-md object-contain"
                key={image}
              />
              <div className="flex flex-col lg:gap-2">
                <h1 className="hidden md:block font-black lg:text-3xl md:text-2xl ">
                  {title}
                </h1>
                <a
                  href={eshopLink}
                  target="_blank"
                  className="flex flex-row gap-2 items-center bg-amber-500 rounded-md p-4 text-white shadow duration-200 delay-0 transition-all hover:shadow-xl cursor-pointer hover:scale-105"
                >
                  <FaShoppingBag size={28} />
                  <div className="flex flex-col">
                    <p className="font-bold">Nintendo eShop</p>
                    <p className="font-medium">
                      {discountedPrice}
                      {"  "}
                      <span className="line-through">{MSRP}</span>
                    </p>
                  </div>
                </a>
              </div>
              <div className="flex flex-col lg:gap-2 my-2">
                <p className="flex flex-row gap-3 items-center">
                  <FaArrowDown />
                  {gameDetails["Download size"] ??
                    "Download size not available"}
                </p>
                <p className="flex flex-row gap-3 items-center">
                  <FaChalkboardUser />
                  {gameDetails["Play modes"] ?? "Play modes not available"}
                </p>
                <p className="flex flex-row gap-3 items-center">
                  <FaAddressBook />
                  {gameDetails["Publisher"]?.[0]?.genreName ??
                    "Publisher information not available"}
                </p>
                <p className="flex flex-row gap-3 items-center">
                  <FaCalendar />
                  {gameDetails["Release date"]?.[0] ?? "Unknown date"}
                  {gameDetails["Release date"]?.[1]
                    ? `, ${gameDetails["Release date"][1]}`
                    : ""}
                </p>
              </div>
            </aside>
            {/*  */}
            <div className="flex flex-col gap-6 lg:basis-[70%] 2xl:basis-[80%] basis-auto">
              <Swiper
                slidesPerView={1}
                spaceBetween={25}
                className="lg:max-w-[50vw] max-w-[92vw] shadow-lg rounded-md"
                modules={[Navigation, Pagination]}
                pagination={{ clickable: true }}
                navigation={{ enabled: true }}
              >
                {images.map((image: string, index: number) => (
                  <SwiperSlide key={image} className="rounded-md">
                    <img
                      src={image}
                      className="w-full object-cover"
                      alt={`Screenshot ${index + 1}`}
                      key={image}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="flex flex-col gap-2">
                <h1 className="font-black lg:text-3xl md:text-2xl text-xl">
                  Description
                </h1>
                <div className="border-b mb-2" />
                <div
                  dangerouslySetInnerHTML={{
                    __html: description.replace(/\n/g, "<br>"),
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="font-black lg:text-3xl md:text-2xl text-xl">
                  Recommendations
                </h1>
                <div className="border-b" />
              </div>
              <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2">
                {recommendations.map((game: any) => (
                  <Link
                    href={`/game/${encodeURIComponent(game.href)}`}
                    className="flex flex-col gap-2"
                    key={game.href}
                  >
                    <img
                      src={game.imageUrl}
                      alt={game.title}
                      className="w-full rounded-md shadow-md"
                    />
                    <div>
                      <h1 className="font-bold">{game.title}</h1>
                      <p className="">{game.discountedPrice}</p>
                    </div>
                  </Link>
                ))}
              </div>
              {/* {!gameReviewsIsLoading &&
              gameReviewsData.gameMetacriticReviews.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-6">
                    {gameReviewsData.gameMetacriticReviews.map(
                      (review: any) => (
                        <a
                          className="flex flex-row gap-4 transition-all delay-0 duration-200 hover:scale-105"
                          key={review.fullReviewLink}
                          href={review.fullReviewLink}
                          target="_blank"
                        >
                          <p className="w-fit h-fit p-4 shadow-md border rounded-md">
                            {review.score}
                          </p>
                          <div className="w-full flex flex-col">
                            <div className="flex flex-row justify-between items-center">
                              <h1 className="font-bold text-xl">
                                {review.reviewer}
                              </h1>
                              <p className="text-sm text-gray-400">
                                {review.platform}
                              </p>
                            </div>
                            <div className="flex flex-row gap-2 text-gray-500">
                              {review.quote}
                            </div>
                          </div>
                        </a>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-row gap-6 items-center justify-center">
                  <FourSquare size="medium" color="#ef4444" />
                  <p className="font-black text-2xl">Loading reviews...</p>
                </div>
              )} */}
            </div>
          </section>
        </>
      ) : (
        <div className="min-h-[80vh] flex flex-row gap-8 items-center justify-center">
          <FourSquare size="large" color="#ef4444" />
        </div>
      )}
    </main>
  );
}
