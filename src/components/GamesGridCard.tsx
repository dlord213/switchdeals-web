import Link from "next/link";

interface GameDetails {
  productTitle: string;
  imgSrc: string | undefined;
  discount: string;
  price: string;
  originalPrice: string;
  link: string | undefined;
}

export default function GamesGridCard({ data }: { data: GameDetails }) {
  if (!data?.productTitle || !data?.link || !data?.imgSrc || !data?.price) {
    return null;
  }

  return (
    <Link
      href={`/game/${encodeURIComponent(data.link)}`}
      className="flex flex-col border rounded-md transition-transform duration-200 hover:scale-105 hover:shadow-xl"
      key={data.productTitle}
    >
      <div className="relative w-full h-[180px]">
        {data.discount && (
          <p className="absolute top-2 left-2 z-10 text-sm bg-red-500 text-white rounded-md px-2 py-1 shadow-lg">
            {data.discount}
          </p>
        )}
        <img
          src={data.imgSrc}
          alt={data.productTitle}
          className="w-full h-full object-cover rounded-t-md"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <h1 className="text-lg font-bold text-gray-800">{data.productTitle}</h1>
        <div className="flex flex-row items-center gap-2">
          <p className="text-lg font-bold text-black">{data.price}</p>
          {data.originalPrice && (
            <p className="text-sm text-gray-500 line-through">
              {data.originalPrice}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
