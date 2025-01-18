import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex flex-col xl:gap-4 xl:max-w-[70vw] mx-auto min-h-screen">
      <Header />
      <section className="flex flex-col lg:flex-row my-8 md:my-0 gap-8 justify-center lg:justify-normal items-center min-h-[79vh] lg:px-24 px-4">
        <div className="flex flex-col basis-[40%] gap-4">
          <h1 className="font-bold 2xl:text-4xl text-2xl">
            SwitchDeals, in your device.
          </h1>
          <p>
            For easy & quick access, download our application in your Android
            device!
          </p>
          <Link
            href="https://github.com/dlord213/switchdeals-android/releases/download/SwitchDeals/switchdeals.apk"
            target="_blank"
            className="px-4 py-2 border rounded-md shadow bg-[#B03B48] text-white cursor-pointer w-fit"
          >
            Download
          </Link>
        </div>
        <div className="flex flex-col lg:flex-row lg:gap-4 gap-8 basis-[60%]">
          <img src="assets/images/deals.jpg" className=" lg:max-h-[55vh]" />
          <img src="assets/images/search.jpg" className=" lg:max-h-[55vh]" />
          <img src="assets/images/wishlists.jpg" className=" lg:max-h-[55vh]" />
        </div>
      </section>
      <Footer />
    </main>
  );
}
