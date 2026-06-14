import { db } from "@/lib/db";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SpiritViewer, { type SpiritItem } from "@/components/ui/SpiritViewer";
import TrophyViewer, { type TrophyItem } from "@/components/ui/TrophyViewer";
import StickerViewer, { type StickerItem } from "@/components/ui/StickerViewer";

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

const TROPHY_ERAS = [
  { id: "SSBM",      label: "Melee",        year: "2001" },
  { id: "SSBB",      label: "Brawl",        year: "2008" },
  { id: "SSB4",      label: "Smash 4",      year: "2014" },
];

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
  searchParams: { game?: string; type?: string; trophy?: string };
}

export default async function CollectiblesPage({ searchParams }: Props) {
  const typeFilter = searchParams.type?.toUpperCase();
  const isTypeView  = typeFilter === "TROPHY" || typeFilter === "SPIRIT" || typeFilter === "STICKER";
  const activeGame  = searchParams.game || (
    typeFilter === "TROPHY" ? "SSBM" : 
    typeFilter === "STICKER" ? "SSBB" : 
    ERAS[0]!.id
  );

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
      descriptionEn:        item.descriptionEn                   ?? null,
    }));

    const itemIdParam = searchParams.trophy;
    const initialIndex  = itemIdParam
      ? Math.max(0, spiritItems.findIndex(s => s.id === itemIdParam))
      : 0;

    return (
      <main className="min-h-screen bg-vault-bg text-vault-text flex flex-col font-body pb-28">
        <CollectiblesHeader activeType="SPIRIT" activeGame={activeGame} itemCount={spiritItems.length} />

        <div className="flex-1 max-w-4xl mx-auto px-4 md:px-6 py-8 w-full">
          <SpiritViewer spirits={spiritItems} initialIndex={initialIndex} />
        </div>
      </main>
    );
  }

  /* ─────────────────────────────────────────────────────────── */
  /* Trophy View — one at a time, like SpiritViewer             */
  /* ─────────────────────────────────────────────────────────── */
  if (typeFilter === "TROPHY") {
    const SSB4_VERSIONS = ["SSB4", "SSB4_3DS", "SSB4_WIIU"];
    const trophyVersions = SSB4_VERSIONS.includes(activeGame)
      ? SSB4_VERSIONS
      : [activeGame];

    const rawTrophies = await db.collectible.findMany({
      where:   { type: "TROPHY", smashGameVersion: { in: trophyVersions } },
      orderBy: [{ posicaoTrofeuMelee: "asc" }, { posicaoTrofeuBrawl: "asc" }, { posicaoTrofeuSsb4: "asc" }, { name: "asc" }],
      include: {
        franchise: { select: { svgIconUrl: true, name: true } },
        relationsFrom: {
          include: { to: { select: { id: true, name: true, smashGameVersion: true, assetRenderUrl: true, type: true } } },
        },
        relationsTo: {
          include: { from: { select: { id: true, name: true, smashGameVersion: true, assetRenderUrl: true, type: true } } },
        },
      },
    });

    // Load chronicle links via raw SQL (Prisma client not yet regenerated for new relation)
    type ChrLink = { collectibleId: string; id: string; titleNtsc: string; boxArtUrl: string | null; wikiUrl: string | null };
    let chronicleLinksRaw: ChrLink[] = [];
    if (rawTrophies.length > 0) {
      const ids = rawTrophies.map(t => t.id);
      chronicleLinksRaw = await (db as any).$queryRawUnsafe(
        `SELECT ccl."collectibleId", ce.id, ce."titleNtsc", ce."boxArtUrl", ce."wikiUrl"
         FROM "CollectibleChronicleLink" ccl
         JOIN "ChronicleEntry" ce ON ccl."chronicleEntryId" = ce.id
         WHERE ccl."collectibleId" = ANY($1::text[])
         ORDER BY ce."titleNtsc"`,
        ids
      ) as ChrLink[];
    }
    const linksByTrophy = new Map<string, ChrLink[]>();
    for (const lnk of chronicleLinksRaw) {
      if (!linksByTrophy.has(lnk.collectibleId)) linksByTrophy.set(lnk.collectibleId, []);
      linksByTrophy.get(lnk.collectibleId)!.push(lnk);
    }

    // Resolve initial index from ?trophy=<id> param
    const trophyIdParam = searchParams.trophy;
    const initialIndex  = trophyIdParam
      ? Math.max(0, rawTrophies.findIndex(t => t.id === trophyIdParam))
      : 0;

    const trophyItems: TrophyItem[] = rawTrophies.map(t => ({
      id:               t.id,
      name:             t.name,
      nameJp:           t.nameJp          ?? null,
      orderIndex:       t.posicaoTrofeuMelee ?? t.posicaoTrofeuBrawl ?? t.posicaoTrofeuSsb4 ?? t.orderIndex ?? null,
      assetRenderUrl:   t.assetRenderUrl  ?? null,
      assetRender2Url:  t.assetRender2Url ?? null,
      descriptionEn:    t.descriptionEn   ?? null,
      sourceGame:       t.sourceGame      ?? null,
      svgIconUrl:       t.franchise?.svgIconUrl ?? null,
      franchiseName:    t.franchise?.name       ?? null,
      smashGameVersion: t.smashGameVersion,
      relatedItems: [
        ...t.relationsFrom.map(r => ({
          id: r.to.id, name: r.to.name, smashGameVersion: r.to.smashGameVersion,
          assetRenderUrl: r.to.assetRenderUrl, type: r.to.type,
        })),
        ...t.relationsTo.map(r => ({
          id: r.from.id, name: r.from.name, smashGameVersion: r.from.smashGameVersion,
          assetRenderUrl: r.from.assetRenderUrl, type: r.from.type,
        })),
      ],
      chronicleLinks: (linksByTrophy.get(t.id) ?? []).map(lnk => ({
        id:        lnk.id,
        titleNtsc: lnk.titleNtsc,
        boxArtUrl: lnk.boxArtUrl,
        wikiUrl:   lnk.wikiUrl,
      })),
    }));

    return (
      <main className="min-h-screen bg-vault-bg text-vault-text flex flex-col font-body pb-28">
        {/* Header */}
        <CollectiblesHeader activeType="TROPHY" activeGame={activeGame} itemCount={trophyItems.length} />
        {/* Viewer */}
        <div className="flex-1 max-w-5xl mx-auto px-4 md:px-6 py-8 w-full">
          <TrophyViewer trophies={trophyItems} initialIndex={initialIndex} />
        </div>
      </main>
    );
  }

  /* ─────────────────────────────────────────────────────────── */
  /* Sticker View — one at a time, like SpiritViewer            */
  /* ─────────────────────────────────────────────────────────── */
  if (typeFilter === "STICKER") {
    const rawStickers = await db.collectible.findMany({
      where:   { type: "STICKER", smashGameVersion: activeGame },
      orderBy: [{ orderIndex: "asc" }, { name: "asc" }],
      include: {
        franchise: { select: { svgIconUrl: true, name: true } },
      },
    });

    // Load chronicle links via raw SQL
    type ChrLink = { collectibleId: string; id: string; titleNtsc: string; boxArtUrl: string | null; wikiUrl: string | null };
    let chronicleLinksRaw: ChrLink[] = [];
    if (rawStickers.length > 0) {
      const ids = rawStickers.map(s => s.id);
      chronicleLinksRaw = await (db as any).$queryRawUnsafe(
        `SELECT ccl."collectibleId", ce.id, ce."titleNtsc", ce."boxArtUrl", ce."wikiUrl"
         FROM "CollectibleChronicleLink" ccl
         JOIN "ChronicleEntry" ce ON ccl."chronicleEntryId" = ce.id
         WHERE ccl."collectibleId" = ANY($1::text[])
         ORDER BY ce."titleNtsc"`,
        ids
      ) as ChrLink[];
    }
    const linksBySticker = new Map<string, ChrLink[]>();
    for (const lnk of chronicleLinksRaw) {
      if (!linksBySticker.has(lnk.collectibleId)) linksBySticker.set(lnk.collectibleId, []);
      linksBySticker.get(lnk.collectibleId)!.push(lnk);
    }

    // Resolve initial index from ?trophy=<id> param (reusing the param name for consistency if needed, or ?sticker=)
    const itemIdParam = searchParams.trophy;
    const initialIndex  = itemIdParam
      ? Math.max(0, rawStickers.findIndex(s => s.id === itemIdParam))
      : 0;

    const stickerItems: StickerItem[] = rawStickers.map(s => ({
      id:               s.id,
      name:             s.name,
      nameJp:           s.nameJp          ?? null,
      orderIndex:       s.orderIndex      ?? null,
      assetRenderUrl:   s.assetRenderUrl  ?? null,
      sourceGame:       s.sourceGame      ?? null,
      svgIconUrl:       s.franchise?.svgIconUrl ?? null,
      franchiseName:    s.franchise?.name       ?? null,
      chronicleLinks: (linksBySticker.get(s.id) ?? []).map(lnk => ({
        id:        lnk.id,
        titleNtsc: lnk.titleNtsc,
        boxArtUrl: lnk.boxArtUrl,
        wikiUrl:   lnk.wikiUrl,
      })),
    }));

    return (
      <main className="min-h-screen bg-vault-bg text-vault-text flex flex-col font-body pb-28">
        <CollectiblesHeader activeType="STICKER" activeGame={activeGame} itemCount={stickerItems.length} />
        <div className="flex-1 max-w-4xl mx-auto px-4 md:px-6 py-8 w-full">
          <StickerViewer stickers={stickerItems} initialIndex={initialIndex} />
        </div>
      </main>
    );
  }

  /* ─────────────────────────────────────────────────────────── */
  /* General Grid (non-trophy/non-spirit/non-sticker)           */
  /* ─────────────────────────────────────────────────────────── */
  const where = typeFilter === "TROPHY"
    ? { type: "TROPHY" as const, smashGameVersion: activeGame }
    : isTypeView
      ? { type: typeFilter as "STICKER" }
      : { type: { not: "SPRITE" as const } };

  const trophyOrderBy =
    activeGame === "SSBM"
      ? [{ posicaoTrofeuMelee: "asc" as const }, { name: "asc" as const }]
    : activeGame === "SSBB"
      ? [{ posicaoTrofeuBrawl: "asc" as const }, { name: "asc" as const }]
    : ["SSB4", "SSB4_3DS", "SSB4_WIIU"].includes(activeGame)
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
      <CollectiblesHeader activeType="GRID" activeGame={activeGame} itemCount={collectibles.length} />

      {/* Grid */}
      <div className="flex-1 max-w-[1600px] mx-auto px-4 md:px-6 py-8 w-full">
        {collectibles.length === 0 ? (
          <div className="text-center text-vault-muted py-32 flex flex-col items-center justify-center">
            <div className="text-4xl mb-4 opacity-20">🗄️</div>
            <p className="font-display text-xl text-slate-400">Nenhum item encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
            {collectibles.map(item => {
              const targetUrl = item.type === "SPIRIT"
                ? `/collectibles?type=SPIRIT&trophy=${item.id}`
                : item.type === "STICKER" || item.type === "TROPHY"
                ? `/collectibles?type=${item.type}&game=${item.smashGameVersion}&trophy=${item.id}`
                : `/collectibles`; // Fallback for MEDIA/SPRITE

              return (
              <Link href={targetUrl} key={item.id} className="group relative flex flex-col items-center">
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
              </Link>
            )})}
          </div>
        )}
      </div>
    </main>
  );
}

function CollectiblesHeader({
  activeType,
  activeGame,
  itemCount,
}: {
  activeType: "GRID" | "TROPHY" | "SPIRIT" | "STICKER";
  activeGame: string;
  itemCount: number;
}) {
  return (
    <div className="sticky top-0 z-40 bg-vault-bg/95 backdrop-blur-md border-b border-vault-border shadow-xl">
      <div className={activeType === "GRID" ? "max-w-[1600px] mx-auto px-4 md:px-6 py-4" : "max-w-5xl mx-auto px-4 md:px-6 py-4"}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-100 uppercase tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-vault-accent/20 flex items-center justify-center text-vault-accent">★</div>
            Coleções
          </h1>
          <div className="flex items-center gap-3">
            {activeType !== "GRID" && (
              <span className="text-xs font-mono text-vault-muted bg-vault-surface px-2 py-1 rounded border border-vault-border/50">
                {itemCount} {TYPE_LABELS[activeType]?.toUpperCase() || "ITENS"}
              </span>
            )}
            {activeType === "GRID" && (
              <span className="text-xs font-mono text-vault-muted bg-vault-surface px-2 py-1 rounded border border-vault-border/50">
                {itemCount} ITENS
              </span>
            )}
          </div>
        </div>
        
        {/* Primary Tabs (Integrated) */}
        <div className="flex gap-1 flex-wrap border-b border-vault-border/30 pb-0">
          <Link
            href="/collectibles"
            className={`px-4 py-2 text-xs font-mono font-medium rounded-t-lg transition-colors border-b-2 ${
              activeType === "GRID"
                ? "bg-vault-surface border-vault-accent text-slate-100"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-vault-surface/50"
            }`}
          >
            VISÃO GERAL
          </Link>
          
          <Link
            href="/collectibles?type=TROPHY&game=SSBM"
            className={`px-4 py-2 text-xs font-mono font-medium rounded-t-lg transition-colors border-b-2 ${
              activeType === "TROPHY" && activeGame === "SSBM"
                ? "bg-vault-surface border-vault-accent text-slate-100"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-vault-surface/50"
            }`}
          >
            TROFÉUS MELEE
          </Link>
          
          <Link
            href="/collectibles?type=TROPHY&game=SSBB"
            className={`px-4 py-2 text-xs font-mono font-medium rounded-t-lg transition-colors border-b-2 ${
              activeType === "TROPHY" && activeGame === "SSBB"
                ? "bg-vault-surface border-vault-accent text-slate-100"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-vault-surface/50"
            }`}
          >
            TROFÉUS BRAWL
          </Link>
          
          <Link
            href="/collectibles?type=TROPHY&game=SSB4"
            className={`px-4 py-2 text-xs font-mono font-medium rounded-t-lg transition-colors border-b-2 ${
              activeType === "TROPHY" && ["SSB4", "SSB4_3DS", "SSB4_WIIU"].includes(activeGame)
                ? "bg-vault-surface border-vault-accent text-slate-100"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-vault-surface/50"
            }`}
          >
            TROFÉUS SMASH 4
          </Link>
          
          <Link
            href="/collectibles?type=STICKER&game=SSBB"
            className={`px-4 py-2 text-xs font-mono font-medium rounded-t-lg transition-colors border-b-2 ${
              activeType === "STICKER"
                ? "bg-vault-surface border-vault-accent text-slate-100"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-vault-surface/50"
            }`}
          >
            STICKERS
          </Link>
          
          <Link
            href="/collectibles?type=SPIRIT"
            className={`px-4 py-2 text-xs font-mono font-medium rounded-t-lg transition-colors border-b-2 ${
              activeType === "SPIRIT"
                ? "bg-vault-surface border-vault-accent text-slate-100"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-vault-surface/50"
            }`}
          >
            SPIRITS
          </Link>
        </div>
      </div>
    </div>
  );
}
