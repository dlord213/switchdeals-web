/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useQuery } from "@tanstack/react-query";
import { FaListAlt, FaShoppingBag } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaAddressBook, FaAddressCard, FaCalendar } from "react-icons/fa6";
import { Navigation, Pagination } from "swiper/modules";
import { FourSquare } from "react-loading-indicators";
import Link from "next/link";
import getGameDetails from "@/lib/get_game_details";
import getGameReviews from "@/lib/get_game_reviews";
import getGameVideoReviews from "@/lib/get_game_video_reviews";

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

  const { data: gameReviewsData, isLoading: gameReviewsIsLoading } = useQuery({
    queryKey: ["reviews", value],
    queryFn: () => {
      const gameDetails = gameDetailsData?.gameDetails?.[0];
      return gameDetails?.type !== "Bundle"
        ? getGameReviews(value)
        : { gameMetacriticReviews: [] };
    },
    enabled: Boolean(value && gameDetailsData),
    refetchOnWindowFocus: false,
    staleTime: 15 * 60 * 1000,
  });

  const { data: gameVideoReviewsData, isLoading: gameVideoReviewsIsLoading } =
    useQuery({
      queryKey: ["videos", value],
      queryFn: () => getGameVideoReviews(value),
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

  const gameDetails = gameDetailsData?.gameDetails?.[0] || {};
  const {
    title,
    coverImage,
    eShopLink,
    price,
    originalPrice,
    details,
    images,
    description,
    type,
  } = gameDetails;

  return (
    <main className="flex flex-col gap-4 xl:max-w-[70vw] mx-auto">
      {gameDetailsData ? (
        <>
          <section className="min-h-screen flex flex-row gap-4 mb-4">
            <aside className="sticky top-0 left-0 flex flex-col gap-2 lg:basis-[30%] 2xl:basis-[30%] ">
              <div className="flex flex-col gap-2 p-4 border shadow-md rounded-md">
                <img
                  src={coverImage}
                  className="w-full rounded-md object-contain"
                  key={coverImage}
                />
                <h1 className="font-black text-3xl">{title}</h1>
                <a
                  href={eShopLink}
                  target="_blank"
                  className="flex flex-row gap-2 items-center bg-amber-500 rounded-md p-4 text-white shadow duration-200 delay-0 transition-all hover:shadow-xl cursor-pointer hover:scale-105"
                >
                  <FaShoppingBag size={28} />
                  <div className="flex flex-col">
                    <p className="font-bold">Nintendo eShop</p>
                    <p className="font-medium">
                      {price}
                      {"  "}
                      <span className="line-through">{originalPrice}</span>
                    </p>
                  </div>
                </a>
              </div>
              <div className="flex flex-row flex-wrap gap-2">
                <p className="w-full flex flex-row gap-4 items-center p-3 border shadow rounded-md">
                  <FaCalendar />
                  {details["Release date"]}
                </p>
                {details["Developer"] ? (
                  <p className="w-full flex flex-row gap-4 items-center p-3 border shadow rounded-md">
                    <FaAddressCard />
                    {details["Developer"]}
                  </p>
                ) : null}
                {details["Publisher"] ? (
                  <p className="w-full flex flex-row gap-4 items-center p-3 border shadow rounded-md">
                    <FaAddressBook />
                    {details["Publisher"]}
                  </p>
                ) : null}
                <p className="w-full flex flex-row gap-4 items-center p-3 border shadow rounded-md">
                  <FaListAlt />
                  {details["Genre"]}
                </p>
              </div>
            </aside>
            {/*  */}
            <div className="flex flex-col gap-6 lg:basis-[70%] 2xl:basis-[80%]">
              <Swiper
                slidesPerView={1}
                spaceBetween={25}
                className="max-w-[50vw] shadow-lg rounded-md"
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
                <h1 className="font-black lg:text-3xl">Description</h1>
                <div className="border-b mb-2" />
                <p>{description}</p>
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="font-black lg:text-3xl">Video Reviews</h1>
                <div className="border-b" />
              </div>
              {!gameVideoReviewsIsLoading ? (
                <Swiper
                  slidesPerView={
                    gameVideoReviewsData?.gameVideoReviewsDetails?.length
                      ? gameVideoReviewsData.gameVideoReviewsDetails.length / 4
                      : 1
                  }
                  spaceBetween={0}
                  className="max-w-[50vw] shadow-lg rounded-md border"
                  modules={[Navigation, Pagination]}
                  pagination={{ clickable: true }}
                  navigation={{ enabled: true }}
                >
                  {gameVideoReviewsData.gameVideoReviewsDetails.map(
                    (review: any, index: number) => (
                      <SwiperSlide
                        key={review.href}
                        className="rounded-md p-4 group relative"
                      >
                        <Link href={review.href} target="_blank">
                          <img
                            src={review.imgSrc}
                            className="w-full object-cover rounded-lg"
                            alt={`Screenshot ${index + 1}`}
                          />
                          <p className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-center">
                            {review.imgAlt}
                          </p>
                        </Link>
                      </SwiperSlide>
                    )
                  )}
                </Swiper>
              ) : (
                <div className="flex flex-row gap-6 items-center justify-center">
                  <FourSquare size="medium" color="#ef4444" />
                  <p className="font-black text-2xl">
                    Loading video reviews...
                  </p>
                </div>
              )}
              {type != "Bundle" ? (
                <>
                  <div className="flex flex-col gap-2">
                    <h1 className="font-black lg:text-3xl">Reviews</h1>
                    <div className="border-b" />
                  </div>
                  {!gameReviewsIsLoading &&
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
                  )}
                </>
              ) : null}
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
