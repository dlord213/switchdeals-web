import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { FaEarthAsia, FaInternetExplorer, FaWebAwesome } from "react-icons/fa6";
import Select from "react-select";

const currencyOptions = [
  {
    value: "https://ntdeals.net/au-store/discounts?sort=deal-rating",
    label: "Australia",
  },
  {
    value: "https://ntdeals.net/mx-store/discounts?sort=deal-rating",
    label: "Mexico",
  },
  {
    value: "https://ntdeals.net/za-store/discounts?sort=deal-rating",
    label: "South Africa",
  },
  {
    value: "https://ntdeals.net/pt-store/discounts?sort=deal-rating",
    label: "Portugal",
  },
  {
    value: "https://ntdeals.net/us-store/discounts?sort=deal-rating",
    label: "United States",
  },
];

export default function Header() {
  return (
    <nav className="flex flex-row justify-between shadow p-4 rounded-bl-md rounded-br-md items-center">
      <div className="flex flex-col gap-2">
        <Link className="font-bold text-red-500 xl:text-2xl" href="/">
          SwitchDeals
        </Link>
      </div>
      {/* <div className="flex flex-row gap-4 items-center">
        <Select
          options={currencyOptions}
          className="z-50"
          defaultValue={currencyOptions[4]}
        />
        <FaEarthAsia size={24} />
      </div> */}
    </nav>
  );
}
