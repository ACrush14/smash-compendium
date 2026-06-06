import { db } from "@/lib/db";
import FighterGrid from "./FighterGrid";

export const metadata = {
  title: "Roster | Super Smash Bros Museum",
  description: "Explore todos os lutadores que compõem o panteão de Super Smash Bros.",
};

export default async function FightersPage() {
  // Fetch all fighters with their franchise and game appearances
  const fighters = await db.fighter.findMany({
    include: {
      franchise: true,
      works: {
        include: { game: true }
      }
    },
    // We order them by roster number. Note: "01", "02", "02e"
    orderBy: { rosterNumber: "asc" }
  });

  const serializedFighters = fighters.map(f => {
    const debutWork = f.works.find(w => w.isDebut);
    return {
      id: f.id,
      name: f.name,
      slug: encodeURIComponent(f.name),
      rosterNumber: f.rosterNumber,
      imageUrl: f.imageUrl,
      franchise: f.franchise.name,
      // Usamos o ID do jogo como chave de debut, ou o título
      debutGame: debutWork ? debutWork.game.titleEn : "Unknown",
      debutVersion: debutWork ? debutWork.gameId : "Unknown", // "SSB64", "SSBM", etc.
    };
  });

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 lg:p-16 selection:bg-white/20 pt-24 md:pt-32">
      <div className="max-w-[1400px] mx-auto space-y-12 md:space-y-16">
        <header className="space-y-4 md:space-y-6">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">
            Fighters
          </h1>
          <p className="text-zinc-400 text-lg md:text-2xl font-light max-w-3xl leading-relaxed">
            O panteão definitivo de Super Smash Bros. Explore todos os {fighters.length} lutadores por franquia ou jogo de estreia.
          </p>
        </header>
        
        <FighterGrid fighters={serializedFighters} />
      </div>
    </div>
  );
}
