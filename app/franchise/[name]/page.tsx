import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Zap, Users, Trophy, Music2, Map } from "lucide-react";
import { db } from "@/lib/db";
import FranchiseCollectibles, { type FranchiseCollectible } from "./FranchiseCollectibles";

interface PageProps {
  params: Promise<{ name: string }>;
}

const ERA_LABEL: Record<string, string> = {
  SSB64: "64", SSBM: "Melee", SSBB: "Brawl", SSB4: "4", SSBU: "Ultimate",
};

const GRID_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><path d="M60 0L0 0L0 60" fill="none" stroke="rgba(64,180,255,0.13)" stroke-width="0.5"/></svg>`;

export async function generateMetadata({ params }: PageProps) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  return {
    title: `${decodedName} · Universo · SmashCompendium`,
    description: `Tudo do universo ${decodedName} no Super Smash Bros. — fighters, troféus, spirits, palcos e músicas.`,
  };
}

export default async function FranchisePage({ params }: PageProps) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  // ── Fetch franchise data ─────────────────────────────────────────────────────
  const franchise = await db.franchise.findFirst({
    where: { name: { equals: decodedName, mode: "insensitive" } },
    include: {
      fighters: {
        orderBy: { rosterNumber: "asc" },
        select: {
          id: true,
          name: true,
          rosterNumber: true,
          imageUrl: true,
          curationStatus: true,
        },
      },
      stages: {
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          smashDebutVersion: true,
          description: true,
        },
      },
      musicTracks: {
        orderBy: { title: "asc" },
        select: {
          id: true,
          title: true,
          arranger: true,
          isRemix: true,
        },
      },
    },
  });

  if (!franchise) notFound();

  // Collectibles: assigned to this franchise (direct) OR from its fighters (pre-migration fallback)
  const collectibles = await db.collectible.findMany({
    where: {
      OR: [
        { franchiseId: franchise.id },
        {
          franchiseId: null,
          fighter: { franchiseId: franchise.id },
        },
      ],
    },
    include: {
      fighter: { select: { name: true, rosterNumber: true } },
    },
    orderBy: [
      { type: "asc" },
      { smashGameVersion: "asc" },
      { name: "asc" },
    ],
  });

  const trophyCount  = collectibles.filter(c => c.type === "TROPHY").length;
  const spiritCount  = collectibles.filter(c => c.type === "SPIRIT").length;
  const stickerCount = collectibles.filter(c => c.type === "STICKER").length;

  // Serialise for client component (only fields needed, strips Prisma internals)
  const collectiblesForClient: FranchiseCollectible[] = collectibles.map(c => ({
    id:               c.id,
    type:             c.type,
    smashGameVersion: c.smashGameVersion,
    name:             c.name,
    nameJp:           c.nameJp,
    descriptionEn:    c.descriptionEn,
    descriptionPt:    c.descriptionPt,
    descriptionJp:    c.descriptionJp,
    descriptionJpEn:  c.descriptionJpEn,
    assetRenderUrl:   c.assetRenderUrl,
    fighter:          c.fighter
      ? { name: c.fighter.name, rosterNumber: c.fighter.rosterNumber }
      : null,
  }));

  return (
    <div className="min-h-screen text-slate-100 antialiased relative overflow-x-hidden" style={{ background: "#0a0a2a" }}>

      {/* ── Grid de perspectiva ─────────────────────────────────────────── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "130%",
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(GRID_SVG)}")`,
          backgroundSize: "60px 60px", backgroundRepeat: "repeat",
          transform: "perspective(480px) rotateX(50deg)", transformOrigin: "50% 100%", opacity: 0.45,
        }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 45% at 50% 100%, rgba(20,60,220,0.07) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "35%", background: "linear-gradient(to bottom, #0a0a2a 0%, transparent 100%)" }} />

        {/* Franchise icon watermark */}
        {franchise.svgIconUrl && (
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={franchise.svgIconUrl}
              alt=""
              className="w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] object-contain brightness-0 invert"
            />
          </div>
        )}
      </div>

      {/* ── Global nav ──────────────────────────────────────────────────── */}
      <header className="relative z-50 border-b border-cyan-500/10 bg-[#050518]/92 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-2 px-4 py-3 sm:gap-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" strokeWidth={2.5} />
            <span className="hidden font-black italic text-sm tracking-tight text-white sm:inline">
              SMASH<span className="text-amber-400">COMPENDIUM</span>
            </span>
          </Link>
          <div className="flex min-w-0 items-center gap-1 font-mono text-[10px] text-cyan-900">
            <ChevronRight className="h-3 w-3 shrink-0" />
            <Link href="/franchise" className="hidden shrink-0 hover:text-cyan-500 transition-colors sm:inline">Franquias</Link>
            <ChevronRight className="hidden h-3 w-3 shrink-0 sm:block" />
            <span className="truncate text-cyan-700">{franchise.name}</span>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Link
              href="/fighters"
              className="font-mono text-[9px] text-slate-600 hover:text-slate-400 transition-colors"
            >
              <span className="sm:hidden">Fighters →</span>
              <span className="hidden sm:inline">Todos os Fighters →</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Franchise hero ──────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-14 pb-10">
        <div className="flex items-start gap-6">
          {/* Icon */}
          {franchise.svgIconUrl && (
            <div className="shrink-0 w-16 h-16 flex items-center justify-center opacity-80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={franchise.svgIconUrl}
                alt={`${franchise.name} logo`}
                className="w-14 h-14 object-contain"
              />
            </div>
          )}

          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-cyan-500/60 mb-2">
              UNIVERSO · FRANQUIA
            </p>
            <h1
              className="font-black italic uppercase tracking-tight text-white leading-none mb-4"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
            >
              {franchise.name}
            </h1>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-3">
              {franchise.fighters.length > 0 && (
                <StatBadge icon={<Users size={10} />} value={franchise.fighters.length} label="fighters" />
              )}
              {trophyCount > 0 && (
                <StatBadge icon={<Trophy size={10} />} value={trophyCount} label="troféus" />
              )}
              {spiritCount > 0 && (
                <StatBadge icon={<Trophy size={10} className="opacity-50" />} value={spiritCount} label="spirits" />
              )}
              {stickerCount > 0 && (
                <StatBadge icon={<Trophy size={10} className="opacity-30" />} value={stickerCount} label="stickers" />
              )}
              {franchise.stages.length > 0 && (
                <StatBadge icon={<Map size={10} />} value={franchise.stages.length} label="palcos" />
              )}
              {franchise.musicTracks.length > 0 && (
                <StatBadge icon={<Music2 size={10} />} value={franchise.musicTracks.length} label="músicas" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-20 space-y-14">

        {/* ── Fighters ─────────────────────────────────────────────────── */}
        {franchise.fighters.length > 0 && (
          <section>
            <SectionTitle title="Fighters" count={franchise.fighters.length} />
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
              {franchise.fighters.map(fighter => (
                <Link
                  key={fighter.id}
                  href={`/fighters/${encodeURIComponent(fighter.name)}`}
                  className="group flex flex-col items-center gap-1.5 p-2 border border-white/5 bg-[#05050f] hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-all"
                  title={fighter.name}
                >
                  <div className="w-10 h-12 flex items-end justify-center overflow-hidden">
                    {fighter.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={fighter.imageUrl}
                        alt={fighter.name}
                        className="w-full h-full object-contain object-bottom group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-8 h-8 border border-white/10 rounded-sm" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-[7px] text-slate-600">
                      #{String(fighter.rosterNumber).padStart(2, "0")}
                    </p>
                    <p className="font-mono text-[8px] text-slate-400 group-hover:text-cyan-300 transition-colors leading-tight truncate w-full max-w-[56px]">
                      {fighter.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Collectibles (client component) ──────────────────────────── */}
        <FranchiseCollectibles collectibles={collectiblesForClient} />

        {/* ── Stages ───────────────────────────────────────────────────── */}
        {franchise.stages.length > 0 && (
          <section>
            <SectionTitle title="Palcos" count={franchise.stages.length} />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {franchise.stages.map(stage => (
                <div
                  key={stage.id}
                  className="border border-white/5 bg-[#05050f] p-3"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-[12px] text-slate-300 font-medium leading-tight">
                      {stage.name}
                    </p>
                    {stage.smashDebutVersion && (
                      <span className="shrink-0 text-[8px] font-mono px-1.5 py-px border border-white/10 text-slate-600">
                        {ERA_LABEL[stage.smashDebutVersion] ?? stage.smashDebutVersion}
                      </span>
                    )}
                  </div>
                  {stage.description && (
                    <p className="text-[10px] text-slate-600 leading-relaxed line-clamp-2">
                      {stage.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Music ────────────────────────────────────────────────────── */}
        {franchise.musicTracks.length > 0 && (
          <section>
            <SectionTitle title="Músicas de Palco" count={franchise.musicTracks.length} />
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-2 space-y-2">
              {franchise.musicTracks.map(track => (
                <div
                  key={track.id}
                  className="break-inside-avoid border border-white/5 bg-[#05050f] px-3 py-2 flex items-center gap-2"
                >
                  <Music2 size={10} className="shrink-0 text-slate-700" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-400 leading-tight truncate">
                      {track.title}
                    </p>
                    {track.arranger && (
                      <p className="text-[9px] text-slate-700 leading-tight truncate">
                        {track.arranger}{track.isRemix ? " · Remix" : ""}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Empty state ───────────────────────────────────────────────── */}
        {franchise.fighters.length === 0 &&
          collectibles.length === 0 &&
          franchise.stages.length === 0 &&
          franchise.musicTracks.length === 0 && (
          <div className="text-center py-20">
            <p className="font-mono text-[12px] text-slate-700">
              Nenhum conteúdo atribuído a esta franquia ainda.
            </p>
            <p className="font-mono text-[10px] text-slate-800 mt-2">
              Use o <Link href="/admin/create" className="underline hover:text-slate-600">Construtor</Link> para adicionar conteúdo.
            </p>
          </div>
        )}
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-6 text-center">
        <p className="font-mono text-[9px] text-slate-800">
          SmashCompendium · {franchise.name} Universe · All rights belong to their respective owners
        </p>
      </footer>
    </div>
  );
}

// ── Helper components ──────────────────────────────────────────────────────────

function StatBadge({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 border border-white/10 bg-white/[0.02]">
      <span className="text-slate-500">{icon}</span>
      <span className="font-mono text-[11px] text-slate-300 font-bold">{value}</span>
      <span className="font-mono text-[9px] text-slate-600 uppercase tracking-wider">{label}</span>
    </div>
  );
}

function SectionTitle({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <h2 className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
        {title}
      </h2>
      {count !== undefined && (
        <span className="font-mono text-[9px] px-1.5 py-px border border-white/10 text-slate-700">
          {count}
        </span>
      )}
      <span className="h-px flex-1 bg-white/5" />
    </div>
  );
}
