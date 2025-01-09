import Link from "next/link";

interface GameDetails {
  title: string;
  link: string;
  discount: string;
  imageSrc: string;
  price: string;
  originalPrice: string;
}

export default function GamesGridCard({ data }: { data: GameDetails }) {
  return (
    <Link
      className="flex flex-col border rounded-md transition-all duration-200 delay-0 hover:scale-105 hover:shadow-xl cursor-pointer"
      key={data.title}
      href={`/game/${encodeURIComponent(data.link)}`}
    >
      <div className="flex flex-col items-end relative w-full h-[180px]">
        <p className="w-fit m-2 z-10 py-2 px-4 bg-red-500 text-white rounded-md shadow-2xl">
          {data.discount}
        </p>
        <img
          src={data.imageSrc}
          className="absolute top-0 left-0 w-full rounded-tl-md rounded-tr-md"
        />
      </div>
      <div className="flex flex-col gap-2 py-2 px-4">
        <h1>{data.title}</h1>
        <div className="flex flex-row gap-2">
          <h1 className="font-bold text-lg">{data.price}</h1>
          <h1 className="text-lg line-through">{data.originalPrice}</h1>
        </div>
      </div>
    </Link>
  );
}
