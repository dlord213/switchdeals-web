import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

interface GamesGridPageButtons {
  prevBtnFunction: () => void;
  nextBtnFunction: () => void;
}

export default function GamesGridPageButtons({
  prevBtnFunction,
  nextBtnFunction,
}: GamesGridPageButtons) {
  return (
    <div className="flex items-center justify-end flex-row gap-2 mb-4">
      <button
        className="py-2 px-6 rounded-md shadow border"
        onClick={prevBtnFunction}
      >
        <FaArrowLeft size={16} />
      </button>

      <button
        className="py-2 px-6 rounded-md shadow border"
        onClick={nextBtnFunction}
      >
        <FaArrowRight size={16} />
      </button>
    </div>
  );
}
