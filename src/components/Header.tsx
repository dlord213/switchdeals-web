"use client";

import useRegion from "@/stores/useRegion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import { FaEarthAsia } from "react-icons/fa6";
import Select, { SingleValue } from "react-select";

export default function Header() {
  const { region, setRegion } = useRegion();
  const [search, setSearch] = useState("");
  const router = useRouter();

  const currencyOptions = useMemo(
    () => [
      { value: "br", label: "Brazil" },
      { value: "ca", label: "Canada" },
      { value: "mx", label: "Mexico" },
      { value: "us", label: "United States" },
    ],
    []
  );

  const selectedRegion = useMemo(
    () => currencyOptions.find((option) => option.value === region) || null,
    [region, currencyOptions]
  );

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

  const handleRegionChange = (
    selectedOption: SingleValue<{ value: string; label: string }>
  ) => {
    if (selectedOption?.value) {
      setRegion(selectedOption.value);
    }
  };

  return (
    <nav className="flex flex-col md:flex-row justify-between shadow p-4 xl:rounded-bl-md xl:rounded-br-md gap-2 md:gap-0 md:items-center bg-[#B03B48]">
      <div className="flex flex-row gap-2 items-center">
        <img src="assets/logo/icon.png" className="w-full max-w-[48px]" />
        <Link className="font-bold text-white md:text-2xl text-xl" href="/">
          SwitchDeals
        </Link>
      </div>
      <div className="flex flex-row gap-4 md:items-center w-full md:w-fit">
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
            className="w-full py-2 px-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-red-300"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search for a game"
          />
        </form>
        <Select
          options={currencyOptions}
          className="z-50 min-w-[200px] hidden"
          value={selectedRegion}
          onChange={handleRegionChange}
          instanceId={0}
          placeholder="Select a region"
          aria-label="Select your region"
          isSearchable
        />
        <FaEarthAsia
          size={24}
          color="#fafafa"
          aria-hidden="true"
          className="hidden"
        />
      </div>
    </nav>
  );
}
