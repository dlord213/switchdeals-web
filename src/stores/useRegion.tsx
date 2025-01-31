import { CountryCurrency } from "@/types/Countries";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface useRegionInterface {
  region: string;
  setRegion: (region: CountryCurrency["value"]) => void;
}

const useRegion = create<useRegionInterface>()(
  immer((set) => ({
    region: "us",
    setRegion: (region) => {
      set({ region: region });
    },
  }))
);

export default useRegion;
