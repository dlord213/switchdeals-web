export default function Footer() {
  return (
    <footer className="flex flex-row bg-[#B03B48] p-4 rounded-tl-md rounded-tr-md justify-between h-full">
      <div className="flex flex-row gap-2 items-center">
        <img src="assets/logo/icon.png" className="w-full max-w-[72px]" />
        <h1 className="font-bold lg:text-3xl text-white">SwitchDeals</h1>
      </div>
      <div className="flex flex-col items-end justify-center">
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
