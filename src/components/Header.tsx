"use client";

import useRegion from "@/stores/useRegion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEarthAsia } from "react-icons/fa6";
import Select from "react-select";

export default function Header() {
  const { region, setRegion } = useRegion();
  const [search, setSearch] = useState("");
  const router = useRouter();

  const currencyOptions = [
    { value: "br", label: "Brazil" },
    { value: "ca", label: "Canada" },
    { value: "mx", label: "Mexico" },
    { value: "us", label: "United States" },
  ];

  const selectedRegion = currencyOptions.find(
    (option) => option.value === region
  );

  return (
    <nav className="flex flex-row justify-between shadow p-4 rounded-bl-md rounded-br-md items-center bg-red-500">
      <div className="flex flex-col gap-2">
        <Link className="font-bold text-white xl:text-2xl" href="/">
          SwitchDeals
        </Link>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <form
          className="relative"
          onSubmit={(e) => {
            e.preventDefault();
            if (search) {
              router.push(`/search/${search}`);
            }
          }}
        >
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
            className="w-full py-2 px-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <Select
          options={currencyOptions}
          className="z-50 min-w-[200px]"
          value={selectedRegion}
          onChange={(selectedOption) => setRegion(selectedOption?.value)}
          placeholder="Select a region"
          aria-label="Select your region"
        />
        <FaEarthAsia size={24} color="#fafafa" />
      </div>
    </nav>
  );
}
