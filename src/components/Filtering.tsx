import { genres } from "@/types/Genres";
import { Dispatch, SetStateAction } from "react";
import { FaTimes } from "react-icons/fa";

export default function Filtering({
  isVisible,
  sort,
  type,
  genre,
  setSort,
  setType,
  setGenre,
}: {
  isVisible: boolean;
  sort: string;
  type: string;
  genre: string;
  setSort: Dispatch<SetStateAction<string>>;
  setType: Dispatch<SetStateAction<string>>;
  setGenre: Dispatch<SetStateAction<string>>;
}) {
  if (isVisible)
    return (
      <div className="flex flex-col gap-4 px-4 xl:p-0">
        <select
          className="bg-gray-100 text-gray-900 border border-gray-300 py-4 px-6 rounded-md dark:bg-zinc-900 dark:text-[#fafafa] dark:border-zinc-800 outline-none"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="hottest">Hottest deals</option>
          <option value="most_wanted">Most wanted</option>
          <option value="most_owned">Most owned</option>
          <option value="bang_per_buck">Value for money</option>
        </select>
        <div className="flex flex-col gap-2 p-4 bg-gray-100 dark:bg-zinc-900 rounded-lg">
          <p>Type</p>
          <button
            className={
              type === ""
                ? "px-4 py-2 border rounded-md shadow bg-[#B03B48] text-white cursor-pointer dark:bg-zinc-800 dark:border-zinc-700"
                : "px-4 py-2 border rounded-md shadow cursor-pointer dark:border-0 dark:bg-zinc-800"
            }
            onClick={() => setType("")}
          >
            Game
          </button>
          <button
            className={
              type === "filter[type]=bundle"
                ? "px-4 py-2 border rounded-md shadow bg-[#B03B48] text-white cursor-pointer dark:bg-zinc-800 dark:border-zinc-700"
                : "px-4 py-2 border rounded-md shadow cursor-pointer dark:border-0 dark:bg-zinc-800"
            }
            onClick={() => setType("filter[type]=bundle")}
          >
            Bundle
          </button>
        </div>
        <div className="flex flex-col gap-2 p-4 bg-gray-100 dark:bg-zinc-900 rounded-lg">
          <div className="flex flex-row items-center justify-between">
            <p>Genres</p>
            {genre && (
              <FaTimes
                onClick={() => setGenre("")}
                className="cursor-pointer"
              />
            )}
          </div>
          {genres.map((_genre) => (
            <button
              key={_genre}
              className={
                genre === _genre
                  ? "px-4 py-2 border rounded-md shadow bg-[#B03B48] text-white cursor-pointer dark:bg-zinc-800 dark:border-zinc-700"
                  : "px-4 py-2 border rounded-md shadow cursor-pointer dark:border-0 dark:bg-zinc-800"
              }
              onClick={() => setGenre(_genre)}
            >
              {_genre}
            </button>
          ))}
        </div>
      </div>
    );
}
