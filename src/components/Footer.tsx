export default function Footer() {
  return (
    <footer className="flex flex-row bg-[#B03B48] p-4 rounded-tl-md rounded-tr-md lg:justify-between h-full dark:bg-zinc-900 dark:border-0">
      <div className="flex flex-row gap-2 items-center">
        <img
          src="assets/logo/icon.png"
          className="w-full lg:max-w-[72px] max-w-[48px]"
        />
        <h1 className="font-bold lg:text-3xl text-white text-xl">
          SwitchDeals
        </h1>
      </div>
      <div className="lg:flex flex-col items-end justify-center hidden">
        <p className="text-white">
          made by{" "}
          <a href="https://github.com/dlord213" target="_blank">
            mirimomekiku
          </a>
        </p>
        <p className="text-white flex flex-row gap-2">
          Encountered a bug?
          <a
            href="https://github.com/dlord213/switchdeals-web/issues"
            target="_blank"
            className="underline"
          >
            Report it here
          </a>
        </p>
      </div>
    </footer>
  );
}
