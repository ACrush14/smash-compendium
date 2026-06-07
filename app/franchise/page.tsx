import Link from "next/link";
import { ChevronRight, Zap } from "lucide-react";
import { db } from "@/lib/db";

export const metadata = {
  title: "Franquias · SmashCompendium",
  description: "Todos os universos representados no Super Smash Bros.",
};

const GRID_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><path d="M60 0L0 0L0 60" fill="none" stroke="rgba(64,180,255,0.13)" stroke-width="0.5"/></svg>`;

export default async function FranchisesPage() {
  // Fetch all franchises with fighter count
  const franchises = await db.franchise.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { fighters: true, stages: true, musicTracks: true },
      },
      fighters: {
        take: 4,
        orderBy: { rosterNumber: "asc" },
        select: { id: true, name: true, imageUrl: true },
      },
    },
  });

  // Get collectible counts per franchise in one query
  const collectibleCounts = await db.$queryRawUnsafe<
    { franchiseId: string; type: string; cnt: bigint }[]
  >(`
    SELECT "franchiseId", "type", COUNT(*) as cnt
    FROM "Collectible"
    WHERE "franchiseId" IS NOT NULL
    GROUP BY "franchiseId", "type"
  `);

  const countMap: Record<string, Record<string, number>> = {};
  for (const row of collectibleCounts) {
    const fid = row.franchiseId;
    if (!countMap[fid]) countMap[fid] = {};
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    countMap[fid]![row.type] = Number(row.cnt);
  }

  return (
    <div className="min-h-screen text-slate-100 antialiased relative overflow-x-hidden" style={{ background: "#0a0a2a" }}>

      {/* Background grid */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "130%",
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(GRID_SVG)}")`,
          backgroundSize: "60px 60px", backgroundRepeat: "repeat",
          transform: "perspective(480px) rotateX(50deg)", transformOrigin: "50% 100%", opacity: 0.35,
        }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 45% at 50% 100%, rgba(20,60,220,0.06) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "35%", background: "linear-gradient(to bottom, #0a0a2a 0%, transparent 100%)" }} />
      </div>

      {/* Nav */}
      <header className="relative z-50 border-b border-cyan-500/10 bg-[#050518]/92 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-4 px-6 py-3">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" strokeWidth={2.5} />
            <span className="font-black italic text-sm tracking-tight text-white">
              SMASH<span className="text-amber-400">COMPENDIUM</span>
            </span>
          </Link>
          <div className="flex items-center gap-1 font-mono text-[10px] text-cyan-900">
            <ChevronRight className="h-3 w-3" />
            <span className="text-cyan-700">Franquias</span>
          </div>
          <div className="ml-auto">
            <Link href="/fighters" className="font-mono text-[9px] text-slate-600 hover:text-slate-400 transition-colors">
              Fighters →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-8">
        <p className="font-mono text-[9px] uppercase tracking-widest text-cyan-500/60 mb-2">
          UNIVERSOS
        </p>
        <h1 className="font-black italic uppercase text-white leading-none mb-2" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
          FRANQUIAS
        </h1>
        <p className="font-mono text-[11px] text-slate-600">
          {franchises.length} universos representados no Super Smash Bros.
        </p>
      </div>

      {/* Franchise grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {franchises.map(franchise => {
            const cc = countMap[franchise.id] ?? {};
            const trophies  = (cc["TROPHY"]  ?? 0);
            const spirits   = (cc["SPIRIT"]  ?? 0);
            const stickers  = (cc["STICKER"] ?? 0);

            return (
              <Link
                key={franchise.id}
                href={`/franchise/${encodeURIComponent(franchise.name)}`}
                className="group border border-white/5 bg-[#05050f] hover:border-cyan-500/20 hover:bg-cyan-500/[0.03] transition-all p-4 flex flex-col gap-3"
              >
                {/* Icon + Name */}
                <div className="flex items-center gap-2.5">
                  {franchise.svgIconUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={franchise.svgIconUrl}
                      alt=""
                      className="w-7 h-7 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="w-7 h-7 border border-white/10 flex items-center justify-center">
                      <span className="font-black italic text-white text-[10px]">
                        {franchise.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <h2 className="font-mono text-[11px] text-slate-300 group-hover:text-cyan-300 transition-colors leading-tight">
                    {franchise.name}
                  </h2>
                </div>

                {/* Fighter thumbnails */}
                {franchise.fighters.length > 0 && (
                  <div className="flex gap-1">
                    {franchise.fighters.map(f => (
                      <div key={f.id} className="w-8 h-10 flex items-end justify-center overflow-hidden opacity-60 group-hover:opacity-90 transition-opacity">
                        {f.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={f.imageUrl}
                            alt={f.name}
                            className="w-full h-full object-contain object-bottom"
                          />
                        ) : (
                          <div className="w-6 h-6 border border-white/10" />
                        )}
                      </div>
                    ))}
                    {franchise._count.fighters > 4 && (
                      <div className="w-8 h-10 flex items-center justify-center">
                        <span className="font-mono text-[9px] text-slate-700">
                          +{franchise._count.fighters - 4}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                  <Stat value={franchise._count.fighters} label="fighters" />
                  {trophies  > 0 && <Stat value={trophies}  label="troféus" />}
                  {spirits   > 0 && <Stat value={spirits}   label="spirits" />}
                  {stickers  > 0 && <Stat value={stickers}  label="stickers" />}
                  {franchise._count.stages > 0 && <Stat value={franchise._count.stages} label="palcos" />}
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5 px-6 py-6 text-center">
        <p className="font-mono text-[9px] text-slate-800">
          SmashCompendium · All rights belong to their respective owners
        </p>
      </footer>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <span className="font-mono text-[9px] text-slate-700">
      <span className="text-slate-500">{value}</span> {label}
    </span>
  );
}
