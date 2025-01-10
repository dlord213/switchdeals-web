import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

interface GamesGridPageButtons {
  prevBtnFunction: () => void;
  nextBtnFunction: () => void;
  isPrevDisabled?: boolean;
  isNextDisabled?: boolean;
}

export default function GamesGridPageButtons({
  prevBtnFunction,
  nextBtnFunction,
  isPrevDisabled = false,
  isNextDisabled = false,
}: GamesGridPageButtons) {
  return (
    <div className="flex items-center justify-end lg:gap-4 gap-2 my-4 lg:mx-0 mx-4">
      <button
        className={`py-2 px-6 flex items-center justify-center rounded-md shadow border transition-colors duration-200 ${
          isPrevDisabled
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-100 active:bg-gray-200"
        }`}
        onClick={isPrevDisabled ? undefined : prevBtnFunction}
        disabled={isPrevDisabled}
        aria-label="Previous Page"
      >
        <FaArrowLeft size={16} />
      </button>
      <button
        className={`py-2 px-6 flex items-center justify-center rounded-md shadow border transition-colors duration-200 ${
          isNextDisabled
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-100 active:bg-gray-200"
        }`}
        onClick={isNextDisabled ? undefined : nextBtnFunction}
        disabled={isNextDisabled}
        aria-label="Next Page"
      >
        <FaArrowRight size={16} />
      </button>
    </div>
  );
}
