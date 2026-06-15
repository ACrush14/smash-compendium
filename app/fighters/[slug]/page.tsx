import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Zap } from "lucide-react";
import { db } from "@/lib/db";
import { GAME_META, GAME_ORDER, type GameVersion } from "@/lib/smash-meta";
import { type MediaAsset } from "@/components/ui/MediaVaultViewer";
import { type MusicTrack } from "@/components/ui/MusicPlayer";
import FighterPageLayout from "@/components/ui/FighterPageLayout";
import AssociatedCards from "@/components/ui/AssociatedCards";
import {
  type FighterDataZoneData,
  type SerializedBio,
  type SerializedCollectible,
  type SerializedMove,
  type WorkGame,
} from "@/components/ui/FighterDataZone";

// ─── Jogos de origem por franquia ─────────────────────────────────────────────

// Origens removidas e migradas para o banco (FighterChronicleLink).

// ─── Metadados de console (deriva exibição a partir de ChronicleEntry.consoleName) ──
type ConsoleMeta = { console: string; consoleFull: string; consoleFullEn: string; icon?: string; color: string };
const CONSOLE_META: Record<string, ConsoleMeta> = {
  "Arcade":                              { console: "ARC",  consoleFull: "Arcade",            consoleFullEn: "Arcade",                               color: "#b02020" },
  "GAME & WATCH":                        { console: "G&W",  consoleFull: "Game & Watch",      consoleFullEn: "Game & Watch",                         color: "#333333" },
  "Nintendo Entertainment System":       { console: "NES",  consoleFull: "Family Computer",   consoleFullEn: "Nintendo Entertainment System", icon: "nes.svg",  color: "#e60012" },
  "Famicom":                             { console: "FC",   consoleFull: "Family Computer",   consoleFullEn: "Family Computer",     icon: "famicom.svg", color: "#e60012" },
  "Super Nintendo Entertainment System": { console: "SNES", consoleFull: "Super Famicom",     consoleFullEn: "Super Nintendo Entertainment System", icon: "snes.svg", color: "#6d3b8e" },
  "Super Famicom":                       { console: "SFC",  consoleFull: "Super Famicom",     consoleFullEn: "Super Famicom",       icon: "super-famicom.svg", color: "#6d3b8e" },
  "Nintendo 64":                         { console: "N64",  consoleFull: "Nintendo 64",       consoleFullEn: "Nintendo 64",         icon: "n64.svg",  color: "#1a3a7e" },
  "Nintendo GameCube":                   { console: "GCN",  consoleFull: "Nintendo GameCube", consoleFullEn: "Nintendo GameCube",   icon: "gcn.svg",  color: "#5a4b9e" },
  "Wii":                                 { console: "Wii",  consoleFull: "Wii",               consoleFullEn: "Wii",                 icon: "wii.svg",  color: "#1a8ac2" },
  "Wii U":                               { console: "WiiU", consoleFull: "Wii U",             consoleFullEn: "Wii U",               icon: "wiiu.svg", color: "#1a78b2" },
  "Nintendo 3DS":                        { console: "3DS",  consoleFull: "Nintendo 3DS",      consoleFullEn: "Nintendo 3DS",        icon: "3ds.svg",  color: "#c2185b" },
  "Nintendo Switch":                     { console: "NSW",  consoleFull: "Nintendo Switch",   consoleFullEn: "Nintendo Switch",     icon: "switch.svg", color: "#e60012" },
  "Game Boy":                            { console: "GB",   consoleFull: "Game Boy",          consoleFullEn: "Game Boy",            icon: "gb.svg",   color: "#557755" },
  "GAME BOY":                            { console: "GB",   consoleFull: "Game Boy",          consoleFullEn: "Game Boy",            icon: "gb.svg",   color: "#557755" },
  "Game Boy Color":                      { console: "GBC",  consoleFull: "Game Boy Color",    consoleFullEn: "Game Boy Color",      icon: "gbc.svg",  color: "#1a8ac2" },
  "Game Boy Advance":                    { console: "GBA",  consoleFull: "Game Boy Advance",  consoleFullEn: "Game Boy Advance",    icon: "gba.svg",  color: "#5a3a9e" },
  "Nintendo DS":                         { console: "DS",   consoleFull: "Nintendo DS",       consoleFullEn: "Nintendo DS",         icon: "ds.svg",   color: "#888888" },
  "Virtual Boy":                         { console: "VB",   consoleFull: "Virtual Boy",       consoleFullEn: "Virtual Boy",         icon: "virtualboy.svg", color: "#b02020" },
};
function consoleMeta(name: string): ConsoleMeta {
  return CONSOLE_META[name] ?? { console: name, consoleFull: name, consoleFullEn: name, color: "#555" };
}
// Parseia datas do Chronicle ("1985/10", "1996", "1989/07/27") → { year, month }
function parseChrDate(s: string | null | undefined): { year?: number; month?: number } {
  if (!s) return {};
  const m = s.match(/(\d{4})(?:[/.-](\d{1,2}))?/);
  if (!m) return {};
  return { year: Number(m[1]), month: m[2] ? Number(m[2]) : undefined };
}

// ─── SVG grid de perspectiva ─────────────────────────────────────────────────

const GRID_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><path d="M60 0L0 0L0 60" fill="none" stroke="rgba(64,180,255,0.13)" stroke-width="0.5"/></svg>`;

// ─── PlatformBadge ───────────────────────────────────────────────────────────

function PlatformBadge({ gameVer }: { gameVer: string }) {
  const meta = GAME_META[gameVer];
  if (!meta) return null;
  return (
    <div className={`relative inline-flex flex-col items-center px-2.5 py-1 border ${meta.platBg} ${meta.platBorder} ${meta.platText} overflow-hidden`}>
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
      <span className="absolute left-0 inset-y-0 w-px bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
      <span className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] leading-tight">{meta.platform}</span>
      <span className="font-mono text-[7px] opacity-50 leading-tight">{meta.year}</span>
    </div>
  );
}

// OriginGames é agora um Client Component em components/ui/OriginGamesPanel.tsx

// ─── Page ─────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function FighterPage({ params }: PageProps) {
  const { slug } = await params;
  const name = decodeURIComponent(slug);

  const [fighter, allCollectibles] = await Promise.all([
    db.fighter.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
      include: {
        franchise: true,
        bios:  { orderBy: { smashGameVersion: "asc" } },
        chronicleLinks: { include: { chronicleEntry: true } },
        moves: { orderBy: [{ smashGameVersion: "asc" }, { order: "asc" }] },
        tips: true,
        suggestions: {
          where: { approved: true },
          orderBy: { createdAt: "desc" }
        }
      },
    }),
    db.collectible.findMany({
      where: { fighter: { name: { equals: name, mode: "insensitive" } } },
      orderBy: [{ smashGameVersion: "asc" }, { name: "asc" }],
    }),
  ]);

  if (!fighter) notFound();

  // ── Derivações ──────────────────────────────────────────────────────────────

  const biosOrdered = [...fighter.bios].sort(
    (a, b) => GAME_ORDER.indexOf(a.smashGameVersion as GameVersion) - GAME_ORDER.indexOf(b.smashGameVersion as GameVersion),
  );

  const trophiesByGame = new Map<string, typeof allCollectibles>();
  for (const c of allCollectibles) {
    if (c.type === "TROPHY") {
      const list = trophiesByGame.get(c.smashGameVersion) ?? [];
      list.push(c);
      trophiesByGame.set(c.smashGameVersion, list);
    }
  }

  const stickersByGame = new Map<string, typeof allCollectibles>();
  for (const c of allCollectibles) {
    if (c.type === "STICKER") {
      const list = stickersByGame.get(c.smashGameVersion) ?? [];
      list.push(c);
      stickersByGame.set(c.smashGameVersion, list);
    }
  }

  const erasSet = new Set<string>();
  for (const b of biosOrdered) erasSet.add(b.smashGameVersion);
  for (const t of allCollectibles) erasSet.add(t.smashGameVersion);
  
  const erasToShow = GAME_ORDER.filter((v) => erasSet.has(v));
  const appearances = erasToShow;


  // ── Montagem do Media Vault (Visão Geral) ───────────────────────────────────
  // Incluir TUDO: render, art, troféus, stickers, spirits, capas de jogos.

  const vaultAssets: MediaAsset[] = [];
  const fighterGifsMap: any = {};

  const pushGifs = (era: string) => {
    for (const g of fighterGifsMap[era] ?? []) {
      vaultAssets.push({ url: g.url, label: g.label, sublabel: g.sublabel, assetType: "gif" });
    }
  };

  const mediaAssets = allCollectibles.filter(c => c.type === "MEDIA");
  
  const pushMedia = (filter: (name: string) => boolean, assetType: MediaAsset["assetType"], sublabelFn: (name: string) => string) => {
    for (const m of mediaAssets.filter((m) => filter(m.name))) {
      vaultAssets.push({ url: m.assetRenderUrl!, label: m.name, sublabel: sublabelFn(m.name), assetType });
    }
  };

  const originGameEntry = fighter.chronicleLinks[0]?.chronicleEntry;
  const originGameLabel = originGameEntry
    ? `${originGameEntry.titleNtsc} (${originGameEntry.consoleName})`
    : fighter.franchise.name;

  // 1. Capas de Jogos (Chronicles)
  for (const link of fighter.chronicleLinks) {
    if (link.chronicleEntry.boxArtUrl) {
      vaultAssets.push({
        url: link.chronicleEntry.boxArtUrl,
        label: link.chronicleEntry.titleNtsc,
        sublabel: `Capa oficial · ${link.chronicleEntry.consoleName}`,
        assetType: "cover",
        href: `/chronicles?q=${encodeURIComponent(link.chronicleEntry.titleNtsc)}`,
      });
    }
  }

  // 2. ORIGIN — sprite de pixel art + GIFs do jogo de origem
  for (const oa of allCollectibles.filter((o) => o.type === "SPRITE" && o.assetRenderUrl)) {
    const consoleLabel = originGameEntry?.consoleName ?? "Super Famicom";
    vaultAssets.push({
      url: oa.assetRenderUrl!, label: oa.name,
      sublabel: `Sprite de batalha original · ${fighter.franchise.name} (${consoleLabel})`,
      assetType: "sprite",
    });
  }
  pushMedia((n) => n.includes("GIF"), "gif",
    (n) => `Gameplay de origem · ${originGameLabel} — ${n.replace("GIF - ", "")}`);

  // 3. SSBM (2001) — clay model → artwork → troféus → GIFs
  pushMedia((n) => n.includes("Clay"), "clay",
    () => "Modelo de argila utilizado como referência 3D · Super Smash Bros. Melee (GameCube, 2001)");
  pushMedia((n) => n.toLowerCase().includes("artwork"), "art",
    () => "Arte oficial · Super Smash Bros. Melee (GameCube, 2001)");
  
  for (const t of trophiesByGame.get("SSBM") ?? []) {
    if (t.assetRenderUrl) {
      vaultAssets.push({ url: t.assetRenderUrl, label: t.name,
        sublabel: "Troféu 3D oficial · Super Smash Bros. Melee (GameCube, 2001)", assetType: "trophy",
        href: `/collectibles?type=TROPHY&game=SSBM&trophy=${t.id}` });
    }
  }
  pushGifs("SSBM");

  // 4. SSBB (2008) — troféus → stickers → GIFs
  for (const t of trophiesByGame.get("SSBB") ?? []) {
    if (t.assetRenderUrl) {
      vaultAssets.push({ url: t.assetRenderUrl, label: t.name,
        sublabel: "Troféu 3D oficial · Super Smash Bros. Brawl (Wii, 2008)", assetType: "trophy",
        href: `/collectibles?type=TROPHY&game=SSBB&trophy=${t.id}` });
    }
  }
  for (const s of stickersByGame.get("SSBB") ?? []) {
    if (s.assetRenderUrl) {
      vaultAssets.push({ url: s.assetRenderUrl, label: s.name,
        sublabel: "Sticker colecionável · Super Smash Bros. Brawl (Wii, 2008)", assetType: "sticker",
        href: `/collectibles?type=STICKER&game=SSBB&trophy=${s.id}` });
    }
  }
  pushGifs("SSBB");

  // 5. SSB4 (2014) — troféus → GIFs
  for (const t of trophiesByGame.get("SSB4") ?? []) {
    if (t.assetRenderUrl) {
      vaultAssets.push({ url: t.assetRenderUrl, label: t.name,
        sublabel: "Troféu 3D oficial · Super Smash Bros. for Wii U / 3DS (2014)", assetType: "trophy",
        href: `/collectibles?type=TROPHY&game=SSB4&trophy=${t.id}` });
    }
  }
  pushGifs("SSB4");

  // 6. SSBU (2018) — render oficial → spirit → GIFs
  if (fighter.imageUrl) {
    vaultAssets.push({
      url: fighter.imageUrl, label: `${fighter.name} — Render Oficial`,
      sublabel: "Render 3D oficial do personagem · Super Smash Bros. Ultimate (Switch, 2018)",
      assetType: "render",
    });
  }
  for (const oa of allCollectibles.filter((o) => o.type === "SPIRIT" && o.assetRenderUrl)) {
    vaultAssets.push({
      url: oa.assetRenderUrl!, label: `${oa.name} — Spirit`,
      sublabel: "Spirit de batalha · Super Smash Bros. Ultimate (Switch, 2018)",
      assetType: "spirit",
      href: `/collectibles?type=SPIRIT&game=SSBU&trophy=${oa.id}`,
    });
  }
  pushGifs("SSBU");

  // Deduplicar por URL — remove renders com mesma URL (dados duplicados no banco)
  const seenVaultUrls = new Set<string>();
  const dedupedVaultAssets = vaultAssets.filter((a) => {
    if (!a.url) return true;
    if (seenVaultUrls.has(a.url)) return false;
    seenVaultUrls.add(a.url);
    return true;
  });

  // ── Serializa dados para FighterDataZone (client component) ─────────────────

  const serializedBios: SerializedBio[] = biosOrdered.map((b) => ({
    smashGameVersion:    b.smashGameVersion,
    contentEn:           b.contentEn,
    contentPt:           b.contentPt,
    contentJp:           b.contentJp,
    contentJpEn:         b.contentJpEn,
    contentJpTranslated: b.contentJpTranslated,
  }));

  const serializeCollectible = (c: { id: string; name: string; nameJp?: string | null; description?: string | null; descriptionPt?: string | null; descriptionJp?: string | null; descriptionJpEn?: string | null; smashGameVersion: string; sourceType: string; assetRenderUrl?: string | null; }): SerializedCollectible => ({
    id: c.id, name: c.name, nameJp: c.nameJp ?? null, description: c.description ?? null, descriptionPt: c.descriptionPt ?? null, descriptionJp: c.descriptionJp ?? null, descriptionJpEn: c.descriptionJpEn ?? null, smashGameVersion: c.smashGameVersion, sourceType: c.sourceType, assetRenderUrl: c.assetRenderUrl ?? null,
  });

  const trophiesMapSerialized: Record<string, SerializedCollectible[]> = {};
  for (const [ver, list] of trophiesByGame) {
    if (list.length > 0) trophiesMapSerialized[ver] = list.map(serializeCollectible);
  }

  const stickersMapSerialized: Record<string, SerializedCollectible[]> = {};
  for (const [ver, list] of stickersByGame) {
    if (list.length > 0) stickersMapSerialized[ver] = list.map(serializeCollectible);
  }

  // ── Origin games ligados DIRETAMENTE ao Chronicles (FighterChronicleLink) ──
  // Fonte única de verdade = ChronicleEntry (capa, wiki, console, datas, títulos JP).
  const dbOriginGames = [...fighter.chronicleLinks]
    .sort((a, b) => (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999))
    .map((link) => {
      const ce = link.chronicleEntry;
      const meta = consoleMeta(ce.consoleName);
      const na = parseChrDate(ce.releaseDateNtsc);
      const jp = parseChrDate(ce.releaseDateJp);
      const isLocal = ce.boxArtUrl?.startsWith("/");
      const isLocalJp = ce.boxArtUrlJp?.startsWith("/");
      return {
        name:          ce.titleNtsc,
        titleJp:       ce.titleJp ?? undefined,
        console:       meta.console,
        consoleFull:   meta.consoleFull,
        consoleFullEn: meta.consoleFullEn,
        year:          jp.year ?? na.year ?? 0,
        month:         jp.month,
        region:        ce.releaseDateJp ? "JP" : undefined,
        yearNa:        na.year,
        monthNa:       na.month,
        regionNa:      ce.releaseDateNtsc ? "NA" : undefined,
        badgeColor:    meta.color,
        iconFile:      meta.icon,
        boxArtPath:    isLocal ? ce.boxArtUrl ?? undefined : undefined,
        boxArtUrl:     isLocal ? undefined : ce.boxArtUrl ?? undefined,
        boxArtPathJp:  isLocalJp ? ce.boxArtUrlJp ?? undefined : undefined,
        jpExclusive:   !ce.releaseDateNtsc && !!ce.releaseDateJp,
        wikiUrl:       ce.wikiUrl ?? undefined,
        wikiUrlJp:     ce.wikiUrlJp ?? undefined,
      };
    });

  const originGamesUI = dbOriginGames;

  const originWorkGames: WorkGame[] = originGamesUI.map((g) => ({
    name:         g.name,
    titleJp:      g.titleJp,
    dateStr:      g.month ? `${g.year}.${String(g.month).padStart(2, "0")}` : String(g.year),
    dateStrNa:    g.monthNa ? `${g.yearNa}.${String(g.monthNa).padStart(2, "0")}` : (g.yearNa ? String(g.yearNa) : undefined),
    boxArtPath:   g.boxArtPath,
    boxArtPathJp: g.boxArtPathJp,
    badgeColor:   g.badgeColor,
    wikiUrl:      g.wikiUrl ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(g.name.replace(/\s+/g, "_"))}`,
    wikiUrlJp:    g.wikiUrlJp,
  }));

  // Movimentos/Final Smash por era (FighterMove)
  const movesMap: Record<string, SerializedMove[]> = {};
  for (const mv of fighter.moves) {
    (movesMap[mv.smashGameVersion] ??= []).push({
      smashGameVersion: mv.smashGameVersion,
      order:            mv.order,
      label:            mv.label,
      descEn:           mv.descEn,
      descPt:           mv.descPt,
      descJp:           mv.descJp,
      descJpEn:         mv.descJpEn,
    });
  }

  const dataZoneData: FighterDataZoneData = {
    fighterId:         fighter.id,
    franchiseName:     fighter.franchise.name,
    curatorOverviewEn:   fighter.curatorOverviewEn ?? null,
    curatorOverviewJp:   fighter.curatorOverviewJp ?? null,
    curatorOverviewPt:   fighter.curatorOverviewPt ?? null,
    curatorOverviewJpEn: fighter.curatorOverviewJpEn ?? null,
    erasToShow,
    bios:              serializedBios,
    trophiesMap:       trophiesMapSerialized,
    stickersMap:       stickersMapSerialized,
    appearances,
    fichaCounters: {
      eras:     erasToShow.length,
      trophies: allCollectibles.filter((c) => c.type === "TROPHY").length,
      stickers: allCollectibles.filter((c) => c.type === "STICKER").length,
      spirits:  allCollectibles.filter((c) => c.type === "SPIRIT").length,
    },
    originWorkGames,
    movesMap,
    fightersTips: fighter.tips,
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="h-screen overflow-hidden flex flex-col text-slate-100 antialiased relative" style={{ background: "#0a0a2a" }}>

      {/* ── Grid em perspectiva (fundo) ─────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "130%",
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(GRID_SVG)}")`,
          backgroundSize: "60px 60px", backgroundRepeat: "repeat",
          transform: "perspective(480px) rotateX(50deg)", transformOrigin: "50% 100%", opacity: 0.65,
        }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 45% at 50% 100%, rgba(20,60,220,0.09) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "35%", background: "linear-gradient(to bottom, #0a0a2a 0%, transparent 100%)" }} />
      
      {fighter.franchise.svgIconUrl && (
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-10 flex items-center justify-center"
          style={{ overflow: 'hidden' }}
        >
          <img src={fighter.franchise.svgIconUrl} alt="" className="w-full h-full object-contain scale-[1.5] blur-[1px] brightness-0 invert" />
        </div>
      )}
      </div>

      {/* ── Global Header ───────────────────────────────────────────── */}
      <header className="shrink-0 z-50 border-b border-cyan-500/10 bg-[#050518]/92 backdrop-blur-sm relative">
        <div className="flex items-center gap-4 px-6 py-3">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" strokeWidth={2.5} />
            <span className="font-black italic text-sm tracking-tight text-white">
              SMASH<span className="text-amber-400">COMPENDIUM</span>
            </span>
          </Link>
          <div className="flex items-center gap-1 font-mono text-[10px] text-cyan-900">
            <ChevronRight className="h-3 w-3" />
            <Link href="/fighters" className="hover:text-cyan-500 transition-colors">Lutadores</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-cyan-700">{fighter.name}</span>
          </div>

          {/* Curation status badge */}
          <div className="ml-auto flex items-center gap-2">
            {fighter.curationStatus === "approved" ? (
              <span className="font-mono text-[9px] text-emerald-500/50 border border-emerald-500/15 px-1.5 py-0.5">
                ✓ CURADO
              </span>
            ) : (
              <span className="font-mono text-[9px] text-amber-500/25 border border-amber-500/10 px-1.5 py-0.5">
                ● EM REVISÃO
              </span>
            )}
            <Link
              href="/admin/fighters"
              className="font-mono text-[9px] text-slate-700 hover:text-slate-400 border border-white/5 hover:border-white/15 px-1.5 py-0.5 transition-all"
            >
              ADMIN ↗
            </Link>
          </div>
        </div>
      </header>

      {/* ── Split Body ──────────────────────────────────────────────── */}
      <main className="flex-1 grid grid-cols-12 overflow-hidden min-h-0 relative z-10">
        <FighterPageLayout
          fighterId={fighter.id}
          fighterSlug={name}
          suggestions={fighter.suggestions.map((s: any) => ({
            id: s.id,
            authorName: s.authorName,
            message: s.message,
            section: s.section,
            createdAt: s.createdAt.toISOString()
          }))}
          assets={dedupedVaultAssets}
          music={(() => {
            const FIGHTER_MUSIC_FALLBACK: Record<string, any> = {
              "Ness": { youtubeId: "OsQEEHUuLGg", title: "Bein' Friends", artist: "Shogo Sakai · Melee Remix" },
            };

            return fighter.musicYoutubeId ? {
              youtubeId: fighter.musicYoutubeId,
              title: fighter.musicTitle ?? "Theme",
              artist: fighter.musicArtist ?? fighter.franchise.name,
            } : FIGHTER_MUSIC_FALLBACK[fighter.name];
          })()}
          header={{
            rosterNumber:  Number(fighter.rosterNumber),
            name:          fighter.name,
            franchiseName: fighter.franchise.name,
            appearances,
          }}
          originGames={originGamesUI}
          dataZone={dataZoneData}
          associatedCardsNode={
            <AssociatedCards
              currentId={fighter.id}
              name={fighter.name}
              franchiseId={fighter.franchiseId}
            />
          }
        />
      </main>
    </div>
  );
}
