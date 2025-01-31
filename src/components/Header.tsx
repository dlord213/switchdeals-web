"use client";

import useRegion from "@/stores/useRegion";
import countries from "@/types/Countries";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { FaAndroid, FaEarthAsia } from "react-icons/fa6";

export default function Header() {
  const { region, setRegion } = useRegion();
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearchSubmit = useCallback(
    (e: { preventDefault: () => void }) => {
      e.preventDefault();
      if (search.trim()) {
        router.push(`/search/${search}`);
        setSearch("");
      }
    },
    [search, router]
  );

  const handleRegionChange = (val: string) => {
    setRegion(val);
  };

  return (
    <nav className="flex flex-col md:flex-row justify-between shadow p-4 xl:rounded-bl-md xl:rounded-br-md gap-2 md:gap-0 md:items-center bg-[#B03B48] dark:bg-zinc-900 dark:border-0">
      <div className="flex flex-row gap-2 items-center">
        <img src="/assets/logo/icon.png" className="w-full max-w-[48px]" />
        <Link className="font-bold text-white md:text-2xl text-xl" href="/">
          SwitchDeals
        </Link>
      </div>
      <div className="flex flex-row gap-4 md:items-center w-full md:w-fit">
        <Link
          href="/android"
          className="px-6 py-0 flex flex-col justify-center items-center bg-slate-100 rounded-md dark:bg-zinc-800 transition-all delay-0 duration-200 dark:hover:bg-zinc-700"
        >
          <FaAndroid size={36} className="text-slate-900 dark:text-zinc-500" />
        </Link>
        <form
          className="relative w-full"
          onSubmit={handleSearchSubmit}
          role="search"
          aria-label="Search for games"
        >
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            className="w-full py-2 px-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-red-300 dark:bg-zinc-900 dark:border-zinc-800 dark:focus:ring-zinc-700 dark:text-[#fafafa]"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search for a game"
          />
        </form>
        <div className="relative flex flex-row gap-4 items-center">
          <select
            value={region}
            onChange={(e) => {
              handleRegionChange(e.target.value);
              router.refresh();
            }}
            className="bg-gray-100 text-gray-900 border border-gray-300 px-3 py-1 rounded-md dark:bg-zinc-900 dark:text-[#fafafa] dark:border-zinc-800 outline-none"
          >
            {Object.entries(countries).map(([countryName, data]) => (
              <option key={data.value} value={data.value}>
                {countryName} ({data.currency})
              </option>
            ))}
          </select>
          <FaEarthAsia size={24} color="#fafafa" aria-hidden="true" />
        </div>
      </div>
    </nav>
  );
}
