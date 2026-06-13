import { db } from "@/lib/db";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SpiritViewer, { type SpiritItem } from "@/components/ui/SpiritViewer";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Coleções",
  description: "Spirit Board: Galeria de Troféus, Adesivos e Spirits.",
};

const ERAS = [
  { id: "SSBM", label: "Melee",   year: "2001" },
  { id: "SSBB", label: "Brawl",   year: "2008" },
  { id: "SSB4", label: "Smash 4", year: "2014" },
  { id: "SSBU", label: "Ultimate",year: "2018" },
];

const TROPHY_ERAS = ERAS.filter(e => e.id !== "SSBU");

const TYPE_LABELS: Record<string, string> = {
  TROPHY:  "Troféus",
  SPIRIT:  "Spirits",
  STICKER: "Stickers",
};

const orderBy = [
  { posicaoSpiritSsbu: "asc" as const },
  { orderIndex:        "asc" as const },
  { name:              "asc" as const },
];

interface Props {
  searchParams: { game?: string; type?: string };
}

export default async function CollectiblesPage({ searchParams }: Props) {
  const typeFilter = searchParams.type?.toUpperCase();
  const isTypeView  = typeFilter === "TROPHY" || typeFilter === "SPIRIT" || typeFilter === "STICKER";
  const activeGame  = searchParams.game || (typeFilter === "TROPHY" ? "SSBM" : ERAS[0]!.id);

  /* ─────────────────────────────────────────────────────────── */
  /* Spirit View — one at a time, client-side navigation        */
  /* ─────────────────────────────────────────────────────────── */
  if (typeFilter === "SPIRIT") {
    const [rawSpirits, chronicleEntries] = await Promise.all([
      db.collectible.findMany({
        where:   { type: "SPIRIT" },
        orderBy,
        include: { franchise: { select: { svgIconUrl: true, name: true } } },
      }),
      db.chronicleEntry.findMany({
        where:  { OR: [{ boxArtUrl: { not: null } }, { wikiUrl: { not: null } }] },
        select: { titleNtsc: true, boxArtUrl: true, wikiUrl: true },
      }),
    ]);

    // Chronicle cover art + wiki URL lookup
    const artMap  = new Map<string, string>();
    const wikiMap = new Map<string, string>();
    for (const e of chronicleEntries) {
      const norm = e.titleNtsc.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (e.boxArtUrl && !artMap.has(norm))  artMap.set(norm, e.boxArtUrl);
      if (e.wikiUrl  && !wikiMap.has(norm))  wikiMap.set(norm, e.wikiUrl);
    }
    const findCover = (source: string | null): string | null => {
      if (!source) return null;
      const norm = source.replace(/\s*\(\d{4}\)$/, "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
      return artMap.get(norm) ?? null;
    };
    const findWiki = (source: string | null): string | null => {
      if (!source) return null;
      const norm = source.replace(/\s*\(\d{4}\)$/, "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
      return wikiMap.get(norm) ?? null;
    };

    // Deduplicate by orderIndex
    const seenIdx = new Set<number>();
    const deduped = rawSpirits.filter(item => {
      if (!item.orderIndex) return true;
      if (seenIdx.has(item.orderIndex)) return false;
      seenIdx.add(item.orderIndex);
      return true;
    });

    const spiritItems: SpiritItem[] = deduped.map(item => ({
      id:                   item.id,
      name:                 item.name,
      nameJp:               item.nameJp               ?? null,
      posicaoSpiritSsbu:    item.posicaoSpiritSsbu    ?? null,
      assetRenderUrl:       item.assetRenderUrl        ?? null,
      spiritArtworkSource:  item.spiritArtworkSource   ?? null,
      spiritFirstAppearance:item.spiritFirstAppearance ?? null,
      spiritMusicTitle:     item.spiritMusicTitle      ?? null,
      spiritMusicArtist:    item.spiritMusicArtist     ?? null,
      spiritMusicDuration:  item.spiritMusicDuration   ?? null,
      spiritCuratorComment: item.spiritCuratorComment  ?? null,
      sourceGame:           item.sourceGame            ?? null,
      svgIconUrl:           item.franchise?.svgIconUrl ?? null,
      franchiseName:        item.franchise?.name       ?? null,
      artCoverUrl:          findCover(item.spiritArtworkSource   ?? null),
      firstCoverUrl:        findCover(item.spiritFirstAppearance ?? null),
      artWikiUrl:           findWiki(item.spiritArtworkSource    ?? null),
      firstWikiUrl:         findWiki(item.spiritFirstAppearance  ?? null),
    }));

    return (
      <main className="min-h-screen bg-vault-bg text-vault-text flex flex-col font-body pb-28">
        <div className="sticky top-0 z-40 bg-vault-bg/95 backdrop-blur-md border-b border-vault-border shadow-xl">
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-100 uppercase tracking-tight flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-vault-accent/20 flex items-center justify-center text-vault-accent">★</div>
                Spirits
              </h1>
              <div className="flex items-center gap-3">
                <Link href="/collectibles" className="text-xs font-mono text-vault-muted hover:text-slate-200 transition-colors">
                  ← Coleções
                </Link>
                <span className="text-xs font-mono text-vault-muted bg-vault-surface px-2 py-1 rounded border border-vault-border/50">
                  {spiritItems.length} SPIRITS
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-4xl mx-auto px-4 md:px-6 py-8 w-full">
          <SpiritViewer spirits={spiritItems} />
        </div>
      </main>
    );
  }

  /* ─────────────────────────────────────────────────────────── */
  /* Trophies, Stickers, and era-based grid                     */
  /* ─────────────────────────────────────────────────────────── */
  const where = typeFilter === "TROPHY"
    ? { type: "TROPHY" as const, smashGameVersion: activeGame }
    : isTypeView
      ? { type: typeFilter as "STICKER" }
      : { smashGameVersion: activeGame, type: { not: "SPRITE" as const } };

  const trophyOrderBy = activeGame === "SSBM"
    ? [{ posicaoTrofeuMelee: "asc" as const }, { name: "asc" as const }]
    : activeGame === "SSBB"
      ? [{ posicaoTrofeuBrawl: "asc" as const }, { name: "asc" as const }]
      : activeGame === "SSB4"
        ? [{ posicaoTrofeuSsb4: "asc" as const }, { name: "asc" as const }]
        : orderBy;

  const raw = await db.collectible.findMany({
    where,
    orderBy: typeFilter === "TROPHY" ? trophyOrderBy : orderBy,
    include: {
      franchise: { select: { svgIconUrl: true, name: true } },
    },
  });

  // Deduplicate by orderIndex
  const seenIdx = new Set<number>();
  const collectibles = raw.filter(item => {
    if (!item.orderIndex) return true;
    if (seenIdx.has(item.orderIndex)) return false;
    seenIdx.add(item.orderIndex);
    return true;
  });

  const title = isTypeView ? (TYPE_LABELS[typeFilter!] ?? "Coleções") : "Coleções";

  return (
    <main className="min-h-screen bg-vault-bg text-vault-text flex flex-col font-body">

      {/* Header */}
      <div className="sticky top-0 z-40 bg-vault-bg/95 backdrop-blur-md border-b border-vault-border shadow-xl">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-100 uppercase tracking-tight flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-vault-accent/20 flex items-center justify-center text-vault-accent">★</div>
              {title}
            </h1>
            <div className="flex items-center gap-2">
              {isTypeView && (
                <Link href="/collectibles" className="text-xs font-mono text-vault-muted hover:text-slate-200 transition-colors">
                  ← Todas as coleções
                </Link>
              )}
              <span className="text-xs font-mono text-vault-muted bg-vault-surface px-2 py-1 rounded border border-vault-border/50">
                {collectibles.length} ITENS
              </span>
            </div>
          </div>

          {(typeFilter === "TROPHY" || !isTypeView) && (
            <div className="flex gap-2">
              {(typeFilter === "TROPHY" ? TROPHY_ERAS : ERAS).map(era => {
                const isActive = era.id === activeGame;
                const href = typeFilter === "TROPHY"
                  ? `/collectibles?type=TROPHY&game=${era.id}`
                  : `/collectibles?game=${era.id}`;
                return (
                  <Link
                    key={era.id}
                    href={href}
                    className={`px-5 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 flex items-baseline gap-2 ${
                      isActive
                        ? "bg-vault-surface border-vault-accent text-slate-100"
                        : "bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-vault-surface/50"
                    }`}
                  >
                    <span className="uppercase tracking-wider">{era.label}</span>
                    <span className={`text-[10px] font-mono ${isActive ? "text-vault-accent" : "text-slate-500"}`}>
                      {era.year}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 max-w-[1600px] mx-auto px-4 md:px-6 py-8 w-full">
        {collectibles.length === 0 ? (
          <div className="text-center text-vault-muted py-32 flex flex-col items-center justify-center">
            <div className="text-4xl mb-4 opacity-20">🗄️</div>
            <p className="font-display text-xl text-slate-400">Nenhum item encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
            {collectibles.map(item => (
              <div key={item.id} className="group relative flex flex-col items-center">
                <div className="relative w-full aspect-square bg-slate-800/40 rounded-xl overflow-hidden border border-vault-border/50 group-hover:border-vault-accent group-hover:bg-vault-surface transition-all duration-300 shadow-sm group-hover:shadow-vault-accent/20 group-hover:-translate-y-1">
                  <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '12px 12px' }} />
                  <div className="absolute top-2 right-2 z-10">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded shadow-sm">
                      {item.orderIndex ? `#${String(item.orderIndex).padStart(3, "0")}` : item.type}
                    </span>
                  </div>
                  {"franchise" in item && item.franchise?.svgIconUrl && (
                    <div className="absolute bottom-2 left-2 z-10 w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Image
                        src={item.franchise.svgIconUrl}
                        alt={item.franchise.name ?? ""}
                        fill
                        className="object-contain"
                        sizes="20px"
                      />
                    </div>
                  )}
                  <div className="absolute inset-4 flex items-center justify-center">
                    {item.assetRenderUrl ? (
                      <Image
                        src={item.assetRenderUrl}
                        alt={item.name}
                        fill
                        className="object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 15vw"
                      />
                    ) : (
                      <div className="text-4xl opacity-10">?</div>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-center w-full">
                  <p className="text-xs font-medium text-slate-300 line-clamp-2 leading-tight group-hover:text-white transition-colors">
                    {item.name}
                  </p>
                  {item.sourceGame && (
                    <p className="text-[10px] text-slate-500 truncate mt-0.5" title={item.sourceGame}>
                      {item.sourceGame}
                    </p>
                  )}
                  {!item.sourceGame && item.nameJp && (
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.nameJp}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
