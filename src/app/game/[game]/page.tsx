import GameDetails from "@/components/GameDetails";
import Header from "@/components/Header";

export async function generateMetadata({ params }, parent) {
  const game = (await params).game;
}

export default function Page({ params }) {
  return (
    <main className="flex flex-col gap-4 xl:max-w-[70vw] mx-auto">
      <Header />
      <GameDetails params={params} />
    </main>
  );
}
