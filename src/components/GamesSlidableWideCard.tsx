import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

export default function GamesSlidableWideCard({
  data,
}: {
  data: [{ link: string; imageSrc: string; title: string; price: string }];
}) {
  if (data) {
    return (
      <Swiper
        slidesPerView={1}
        spaceBetween={25}
        className="w-full shadow-lg rounded-md"
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
    );
  }
}
