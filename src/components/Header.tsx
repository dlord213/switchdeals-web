"use client";

import useRegion from "@/stores/useRegion";
import Link from "next/link";
import { FaEarthAsia } from "react-icons/fa6";
import Select from "react-select";

const currencyOptions = [
  { value: "br", label: "Brazil" },
  { value: "ca", label: "Canada" },
  { value: "mx", label: "Mexico" },
  { value: "us", label: "United States" },
];

export default function Header() {
  const { region, setRegion } = useRegion();

  const selectedRegion = currencyOptions.find(
    (option) => option.value === region
  );

  return (
    <nav className="flex flex-row justify-between shadow p-4 rounded-bl-md rounded-br-md items-center">
      <div className="flex flex-col gap-2">
        <Link className="font-bold text-red-500 xl:text-2xl" href="/">
          SwitchDeals
        </Link>
      </div>

      <div className="flex flex-row gap-4 items-center">
        <Select
          options={currencyOptions}
          className="z-50 min-w-[200px]"
          value={selectedRegion}
          onChange={(selectedOption) => setRegion(selectedOption?.value)}
          placeholder="Select a region"
          aria-label="Select your region"
        />
        <FaEarthAsia size={24} />
      </div>
    </nav>
  );
}
