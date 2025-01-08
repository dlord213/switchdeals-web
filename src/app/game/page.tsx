"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Header from "@/components/Header";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { FaListAlt, FaShoppingBag } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaAddressBook, FaAddressCard, FaCalendar } from "react-icons/fa6";
import { Navigation, Pagination } from "swiper/modules";
import { FourSquare } from "react-loading-indicators";

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams.get("game");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["game", query],
    queryFn: async () => {
      if (!query) throw new Error("Query parameter is missing.");

      const response = await fetch(
        `/api/game?url=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch game data: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    },
    enabled: Boolean(query), // Prevent execution when query is undefined
    refetchOnWindowFocus: false, // Adjust based on UX needs
    staleTime: 15 * 60 * 1000, // Cache the data for 5 minutes
    retry: 3, // Retry the query up to 3 times on failure
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  return (
    <main className="flex flex-col gap-4 xl:max-w-[70vw] mx-auto">
      <Header />
      {data ? (
        <>
          <section className="min-h-screen flex flex-row gap-4 mb-4">
            <div className="sticky top-0 left-0 flex flex-col gap-2 lg:basis-[30%] 2xl:basis-[30%] ">
              <div className="flex flex-col gap-2 p-4 border shadow-md rounded-md">
                <img
                  src={data.gameDetails[0].coverImage}
                  className="w-full rounded-md object-contain"
                />
                <h1 className="font-black text-3xl">
                  {data.gameDetails[0].title}
                </h1>
                <a
                  href={data.gameDetails[0].eShopLink}
                  target="_blank"
                  className="flex flex-row gap-2 items-center bg-amber-500 rounded-md p-4 text-white shadow duration-200 delay-0 transition-all hover:shadow-xl cursor-pointer hover:scale-105"
                >
                  <FaShoppingBag size={28} />
                  <div className="flex flex-col">
                    <p className="font-bold">Nintendo eShop</p>
                    <p className="font-medium">
                      {data.gameDetails[0].price}
                      {"  "}
                      <span className="line-through">
                        {data.gameDetails[0].originalPrice}
                      </span>
                    </p>
                  </div>
                </a>
              </div>
              <div className="flex flex-row flex-wrap gap-2">
                <p className="w-full flex flex-row gap-4 items-center p-3 border shadow rounded-md">
                  <FaCalendar />
                  {data.gameDetails[0].details["Release date"]}
                </p>
                {data.gameDetails[0].details["Developer"] ? (
                  <p className="w-full flex flex-row gap-4 items-center p-3 border shadow rounded-md">
                    <FaAddressCard />
                    {data.gameDetails[0].details["Developer"]}
                  </p>
                ) : null}
                {data.gameDetails[0].details["Publisher"] ? (
                  <p className="w-full flex flex-row gap-4 items-center p-3 border shadow rounded-md">
                    <FaAddressBook />
                    {data.gameDetails[0].details["Publisher"]}
                  </p>
                ) : null}
                <p className="w-full flex flex-row gap-4 items-center p-3 border shadow rounded-md">
                  <FaListAlt />
                  {data.gameDetails[0].details["Genre"]}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:basis-[70%] 2xl:basis-[80%]">
              <Swiper
                slidesPerView={1}
                spaceBetween={25}
                className="max-w-[50vw] shadow-lg rounded-md"
                modules={[Navigation, Pagination]}
                pagination={{ clickable: true }}
                navigation={{ enabled: true }}
              >
                {data.gameDetails[0].images.map((image, index) => (
                  <SwiperSlide key={index} className="rounded-md">
                    <img
                      src={image}
                      className="w-full object-cover"
                      key={image}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="flex flex-col gap-2">
                <h1 className="font-black lg:text-3xl">Description</h1>
                <div className="border-b mb-2" />
                <p>{data.gameDetails[0].description}</p>
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="font-black lg:text-3xl">Reviews</h1>
                <div className="border-b" />
              </div>
              {data.gameMetacriticReviews.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-6">
                    {data.gameMetacriticReviews.map((review: any) => (
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
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-row gap-6 items-center justify-center">
                  <FourSquare size="medium" color="#ef4444" />
                  <p className="font-black text-2xl">Loading reviews...</p>
                </div>
              )}
            </div>
          </section>
        </>
      ) : (
        <div className="min-h-screen flex flex-row gap-8 items-center justify-center">
          <FourSquare size="large" color="#ef4444" />
        </div>
      )}
    </main>
  );
}
