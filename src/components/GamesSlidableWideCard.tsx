import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import GameGridDetails from "@/types/GameGridDetails";

export default function GamesSlidableWideCard({
  data,
}: {
  data: GameGridDetails[];
}) {
  if (data) {
    return (
      <Swiper
        slidesPerView={1}
        spaceBetween={25}
        className="hidden xl:w-full shadow-lg xl:rounded-md"
        modules={[Pagination]}
        pagination={{ clickable: true }}
      >
        {data.slice(0, 10).map((game, index) => (
          <SwiperSlide key={index} className="rounded-md">
            <Link
              className="relative flex flex-col justify-end p-8 h-[360px]"
              href={`/game/${encodeURIComponent(game.link)}`}
            >
              <img
                src={game.imgSrc}
                alt={game.productTitle}
                className="absolute top-0 left-0 w-full max-h-[360px] object-cover brightness-75 xl:rounded-md"
              />
              <h2 className="z-10 font-black text-3xl text-white carousel-text-shadow">
                {game.productTitle}
              </h2>
              <p className="z-10 text-3xl text-white carousel-text-shadow">
                {game.price}
              </p>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }
}
