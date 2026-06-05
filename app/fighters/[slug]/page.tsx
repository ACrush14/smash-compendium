import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Zap } from "lucide-react";
import { db } from "@/lib/db";
import { GAME_META, GAME_ORDER, type GameVersion } from "@/lib/smash-meta";
import MediaVaultViewer, { type MediaAsset } from "@/components/ui/MediaVaultViewer";
import FighterRightPanel from "@/components/ui/FighterRightPanel";
import {
  type FighterDataZoneData,
  type SerializedBio,
  type SerializedCollectible,
  type WorkGame,
} from "@/components/ui/FighterDataZone";

// ─── Jogos de origem por franquia ─────────────────────────────────────────────

type OriginGame = {
  name:           string;   // Nome EN
  titleJp?:       string;   // Título japonês oficial (ex: "MOTHER2 ギーグの逆襲")
  console:        string;   // Abreviação do console (ex: "SNES", "GBA")
  consoleFull?:   string;   // Nome JP completo (ex: "Super Family Computer (Super Famicom)")
  consoleFullEn?: string;   // Nome EN completo (ex: "Super Nintendo Entertainment System")
  year:           number;   // Ano JP
  month?:         number;   // Mês JP (1-12)
  region?:        string;   // "JP" | "NA" | "PAL"
  yearNa?:        number;   // Ano NA
  monthNa?:       number;   // Mês NA
  regionNa?:      string;   // região NA
  badgeColor:       string;
  iconFile?:        string;   // ex: "snes.png" → /assets/consoles/snes.png
  boxArtPath?:      string;   // capa NA/EN
  boxArtPathJp?:    string;   // capa JP
  boxArtLandscape?: boolean;
  jpExclusive?:     boolean;
  wikiUrl?:         string;   // Link Wikipedia EN/NA
  wikiUrlJp?:       string;   // Link Wikipedia JP
};

// Override por lutador (tem prioridade sobre a franquia)
const FIGHTER_ORIGIN_GAMES: Record<string, OriginGame[]> = {
  "Ness": [
    { name: "EarthBound", titleJp: "MOTHER2 ギーグの逆襲", console: "SNES", consoleFull: "Super Family Computer (Super Famicom)", consoleFullEn: "Super Nintendo Entertainment System", year: 1994, month: 8, region: "JP", yearNa: 1995, monthNa: 6, regionNa: "NA", badgeColor: "#6d3b8e", iconFile: "snes.svg", boxArtPath: "/assets/games/EARTHBOUND_USA_BOX.jpg", boxArtPathJp: "/assets/games/MOTHER2_JP_BOX.png", boxArtLandscape: true, wikiUrl: "https://en.wikipedia.org/wiki/EarthBound", wikiUrlJp: "https://ja.wikipedia.org/wiki/MOTHER2_ギーグの逆襲" },
  ],
  "Lucas": [
    { name: "EarthBound", titleJp: "MOTHER2 ギーグの逆襲", console: "SNES", consoleFull: "Super Family Computer (Super Famicom)", consoleFullEn: "Super Nintendo Entertainment System", year: 1994, month: 8, region: "JP", yearNa: 1995, monthNa: 6, regionNa: "NA", badgeColor: "#6d3b8e", iconFile: "snes.svg", boxArtPath: "/assets/games/EARTHBOUND_USA_BOX.jpg", boxArtPathJp: "/assets/games/MOTHER2_JP_BOX.png", boxArtLandscape: true, wikiUrl: "https://en.wikipedia.org/wiki/EarthBound", wikiUrlJp: "https://ja.wikipedia.org/wiki/MOTHER2_ギーグの逆襲" },
    { name: "Mother 3",   titleJp: "MOTHER3",              console: "GBA",  consoleFull: "Game Boy Advance", year: 2006, month: 4, region: "JP", badgeColor: "#5c1f8a", iconFile: "gba.svg", jpExclusive: true, boxArtPath: "/assets/games/MOTHER3_JP_BOX.jpg", boxArtLandscape: true, wikiUrl: "https://ja.wikipedia.org/wiki/MOTHER3", wikiUrlJp: "https://ja.wikipedia.org/wiki/MOTHER3" },
  ],
};

const FRANCHISE_ORIGIN_GAMES: Record<string, OriginGame[]> = {
  "EarthBound":          [
    { name: "EarthBound", titleJp: "MOTHER2 ギーグの逆襲", console: "SNES", consoleFull: "Super Famicom",   year: 1994, month: 8, region: "JP", badgeColor: "#6d3b8e", iconFile: "snes.svg", boxArtPath: "/assets/games/EARTHBOUND_USA_BOX.jpg", boxArtLandscape: true, wikiUrl: "https://en.wikipedia.org/wiki/EarthBound", wikiUrlJp: "https://ja.wikipedia.org/wiki/MOTHER2_ギーグの逆襲" },
    { name: "Mother 3",   titleJp: "MOTHER3",              console: "GBA",  consoleFull: "Game Boy Advance", year: 2006, month: 4, region: "JP", badgeColor: "#5c1f8a", iconFile: "gba.svg", jpExclusive: true, boxArtPath: "/assets/games/MOTHER3_JP_BOX.jpg", boxArtLandscape: true, wikiUrl: "https://ja.wikipedia.org/wiki/MOTHER3", wikiUrlJp: "https://ja.wikipedia.org/wiki/MOTHER3" },
  ],
  "Mario":               [{ name: "Donkey Kong",              console: "ARC",  year: 1981,              badgeColor: "#b02020" },
                          { name: "Super Mario Bros.",         console: "NES",  year: 1985,              badgeColor: "#e60012" }],
  "Donkey Kong":         [{ name: "Donkey Kong",              console: "ARC",  year: 1981,              badgeColor: "#b02020" },
                          { name: "Donkey Kong Country",       console: "SNES", year: 1994,              badgeColor: "#6d3b8e" }],
  "The Legend of Zelda": [{ name: "The Legend of Zelda",      console: "NES",  year: 1986,              badgeColor: "#e60012" }],
  "Pokémon":             [{ name: "Pocket Monsters R/G",      console: "GB",   year: 1996, region: "JP", badgeColor: "#555"   },
                          { name: "Pokémon Red / Blue",        console: "GB",   year: 1998,              badgeColor: "#555"   }],
  "Metroid":             [{ name: "Metroid",                  console: "NES",  year: 1986,              badgeColor: "#e60012" }],
  "Kirby":               [{ name: "Kirby's Dream Land",       console: "GB",   year: 1992,              badgeColor: "#555"   }],
  "Star Fox":            [{ name: "Star Fox",                 console: "SNES", year: 1993,              badgeColor: "#6d3b8e" }],
  "F-Zero":              [{ name: "F-Zero",                   console: "SNES", year: 1990,              badgeColor: "#6d3b8e" }],
  "Fire Emblem":         [{ name: "Fire Emblem",              console: "NES",  year: 1990, region: "JP", badgeColor: "#e60012" }],
  "Pikmin":              [{ name: "Pikmin",                   console: "GCN",  year: 2001,              badgeColor: "#1a1a5e" }],
  "Animal Crossing":     [{ name: "Animal Forest",            console: "N64",  year: 2001, region: "JP", badgeColor: "#1a3a7e" }],
  "Kid Icarus":          [{ name: "Kid Icarus",               console: "NES",  year: 1986,              badgeColor: "#e60012" }],
  "Ice Climber":         [{ name: "Ice Climber",              console: "NES",  year: 1984,              badgeColor: "#e60012" }],
  "Wario":               [{ name: "Wario Land",               console: "GB",   year: 1994,              badgeColor: "#555"   }],
  "Yoshi":               [{ name: "Yoshi's Island",           console: "SNES", year: 1995,              badgeColor: "#6d3b8e" }],
  "Xenoblade":           [{ name: "Xenoblade Chronicles",     console: "Wii",  year: 2010,              badgeColor: "#2a2a8e" }],
  "Punch-Out!!":         [{ name: "Punch-Out!!",              console: "NES",  year: 1987,              badgeColor: "#e60012" }],
  "Duck Hunt":           [{ name: "Duck Hunt",                console: "NES",  year: 1984,              badgeColor: "#e60012" }],
  "Sonic":               [{ name: "Sonic the Hedgehog",       console: "GEN",  year: 1991,              badgeColor: "#0044aa" }],
  "Mega Man":            [{ name: "Mega Man",                 console: "NES",  year: 1987,              badgeColor: "#e60012" }],
  "Pac-Man":             [{ name: "Pac-Man",                  console: "ARC",  year: 1980,              badgeColor: "#b02020" }],
  "Street Fighter":      [{ name: "Street Fighter II",        console: "ARC",  year: 1991,              badgeColor: "#b02020" }],
  "Castlevania":         [{ name: "Castlevania",              console: "NES",  year: 1986,              badgeColor: "#e60012" }],
  "Persona":             [{ name: "Persona 5",                console: "PS4",  year: 2016,              badgeColor: "#aa0000" }],
  "Dragon Quest":        [{ name: "Dragon Quest",             console: "NES",  year: 1986, region: "JP", badgeColor: "#e60012" }],
  "Banjo-Kazooie":       [{ name: "Banjo-Kazooie",            console: "N64",  year: 1998,              badgeColor: "#1a3a7e" }],
  "ARMS":                [{ name: "ARMS",                     console: "NSW",  year: 2017,              badgeColor: "#e60040" }],
  "Bayonetta":           [{ name: "Bayonetta",                console: "PS3",  year: 2009,              badgeColor: "#2a2a8e" }],
  "Game & Watch":        [{ name: "Ball",                     console: "G&W",  year: 1980,              badgeColor: "#333"   }],
};

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

  const [fighter, trophies, stickers, originAssets] = await Promise.all([
    db.fighter.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
      include: {
        franchise: true,
        bios:  { orderBy: { smashGameVersion: "asc" } },
        works: { include: { game: true } },
        tips: true,
      },
    }),
    db.collectible.findMany({
      where: { fighter: { name: { equals: name, mode: "insensitive" } }, type: "TROPHY" },
      orderBy: [{ smashGameVersion: "asc" }, { name: "asc" }],
    }),
    db.collectible.findMany({
      where: { fighter: { name: { equals: name, mode: "insensitive" } }, type: "STICKER" },
    }),
    db.collectible.findMany({
      where: {
        fighter: { name: { equals: name, mode: "insensitive" } },
        type:    { in: ["SPRITE", "SPIRIT"] },
      },
    }),
  ]);

  if (!fighter) notFound();

  // ── Derivações ──────────────────────────────────────────────────────────────

  const biosOrdered = [...fighter.bios].sort(
    (a, b) => GAME_ORDER.indexOf(a.smashGameVersion as GameVersion) - GAME_ORDER.indexOf(b.smashGameVersion as GameVersion),
  );

  const appearances: string[] = [];
  for (const w of fighter.works) {
    const t = w.game.titleEn;
    let ver = "";
    if (t.includes("Ultimate"))                                            ver = "SSBU";
    else if (t.includes("4") || t.includes("3DS") || t.includes("Wii U")) ver = "SSB4";
    else if (t.includes("Brawl"))                                          ver = "SSBB";
    else if (t.includes("Melee"))                                          ver = "SSBM";
    else if (t === "Super Smash Bros." || t.includes("64"))                ver = "SSB64";
    if (ver && !appearances.includes(ver)) appearances.push(ver);
  }
  appearances.sort((a, b) => GAME_ORDER.indexOf(a as GameVersion) - GAME_ORDER.indexOf(b as GameVersion));

  const trophiesByGame = new Map<string, typeof trophies>();
  for (const t of trophies) {
    const list = trophiesByGame.get(t.smashGameVersion) ?? [];
    list.push(t);
    trophiesByGame.set(t.smashGameVersion, list);
  }

  const stickersByGame = new Map<string, typeof stickers>();
  for (const s of stickers) {
    const list = stickersByGame.get(s.smashGameVersion) ?? [];
    list.push(s);
    stickersByGame.set(s.smashGameVersion, list);
  }

  const erasSet = new Set<string>();
  for (const v of appearances) erasSet.add(v);
  for (const b of biosOrdered) erasSet.add(b.smashGameVersion);
  for (const [v] of trophiesByGame) erasSet.add(v);
  for (const [v] of stickersByGame) erasSet.add(v);
  const erasToShow = GAME_ORDER.filter((v) => erasSet.has(v));

  // ── Media Vault assets — ORDEM CRONOLÓGICA ESTRITA ───────────────────────
  const vaultAssets: MediaAsset[] = [];

  // 1. Sprite de origem — PRIMEIRO (personagem antes do Smash)
  for (const oa of originAssets.filter((o) => o.type === "SPRITE")) {
    vaultAssets.push({
      url: oa.assetRenderUrl, label: oa.name,
      sublabel: `Sprite Original · ${fighter.franchise.name}`,
      assetType: "sprite",
    });
  }

  // 2. SSB64 → Melee → Brawl → SSB4 (troféus + stickers por era)
  for (const gameVer of GAME_ORDER.filter((v) => v !== "SSBU")) {
    for (const t of trophiesByGame.get(gameVer) ?? []) {
      vaultAssets.push({ url: t.assetRenderUrl, label: t.name, sublabel: `Troféu · ${GAME_META[gameVer]?.short ?? gameVer}`, assetType: "trophy" });
    }
    for (const s of stickersByGame.get(gameVer) ?? []) {
      vaultAssets.push({ url: s.assetRenderUrl, label: s.name, sublabel: `Sticker · ${GAME_META[gameVer]?.short ?? gameVer}`, assetType: "sticker" });
    }
  }

  // 3. SSBU items
  for (const t of trophiesByGame.get("SSBU") ?? []) {
    vaultAssets.push({ url: t.assetRenderUrl, label: t.name, sublabel: "Troféu · Ultimate", assetType: "trophy" });
  }
  for (const s of stickersByGame.get("SSBU") ?? []) {
    vaultAssets.push({ url: s.assetRenderUrl, label: s.name, sublabel: "Sticker · Ultimate", assetType: "sticker" });
  }

  // 4. Render SSBU — último (jogo mais recente)
  if (fighter.imageUrl) {
    vaultAssets.push({
      url: fighter.imageUrl, label: `${fighter.name} — Render`,
      sublabel: "Super Smash Bros. Ultimate · 2018", assetType: "render",
    });
  }

  // 5. Spirit SSBU
  for (const oa of originAssets.filter((o) => o.type === "SPIRIT")) {
    vaultAssets.push({ url: oa.assetRenderUrl, label: oa.name, sublabel: "Spirit · Ultimate", assetType: "spirit" });
  }

  // 6. Slots reservados — Clay Model, N64 Art, GIF, Video (pipeline futuro)
  const reservedSlots: MediaAsset[] = [
    { url: null, label: "Clay Model",      sublabel: "Argila Melee · Pendente ETL",    assetType: "placeholder-clay"  as MediaAsset["assetType"] },
    { url: null, label: "Arte N64",        sublabel: "SSB 64 · Pendente ETL",          assetType: "placeholder-art"   as MediaAsset["assetType"] },
    { url: null, label: "GIF Animado",     sublabel: "Moveset · Reservado pipeline",   assetType: "placeholder-gif"   as MediaAsset["assetType"] },
    { url: null, label: "Vídeo Showcase",  sublabel: "WebM · Reservado pipeline",      assetType: "placeholder-video" as MediaAsset["assetType"] },
  ];
  vaultAssets.push(...reservedSlots);

  // ── Serializa dados para FighterDataZone (client component) ─────────────────

  const serializedBios: SerializedBio[] = biosOrdered.map((b) => ({
    smashGameVersion:    b.smashGameVersion,
    contentEn:           b.contentEn,
    contentPt:           b.contentPt,
    contentJp:           b.contentJp,
    contentJpEn:         b.contentJpEn,
    contentJpTranslated: b.contentJpTranslated,
  }));

  const serializeCollectible = (c: { id: string; name: string; description?: string | null; smashGameVersion: string }): SerializedCollectible => ({
    id: c.id, name: c.name, description: c.description ?? null, smashGameVersion: c.smashGameVersion,
  });

  const trophiesMapSerialized: Record<string, SerializedCollectible[]> = {};
  for (const [ver, list] of trophiesByGame) {
    trophiesMapSerialized[ver] = list.map(serializeCollectible);
  }

  const stickersMapSerialized: Record<string, SerializedCollectible[]> = {};
  for (const [ver, list] of stickersByGame) {
    stickersMapSerialized[ver] = list.map(serializeCollectible);
  }

  const rawOriginGames =
    FIGHTER_ORIGIN_GAMES[fighter.name] ??
    FRANCHISE_ORIGIN_GAMES[fighter.franchise.name] ??
    [];

  const originWorkGames: WorkGame[] = rawOriginGames.map((g) => ({
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

  const dataZoneData: FighterDataZoneData = {
    franchiseName:     fighter.franchise.name,
    curatorOverviewEn: fighter.curatorOverviewEn ?? null,
    erasToShow,
    bios:              serializedBios,
    trophiesMap:       trophiesMapSerialized,
    stickersMap:       stickersMapSerialized,
    appearances,
    fichaCounters: {
      eras:     erasToShow.length,
      trophies: trophies.length,
      stickers: stickers.length,
      spirits:  0,
    },
    originWorkGames,
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
        </div>
      </header>

      {/* ── Split Body ──────────────────────────────────────────────── */}
      <main className="flex-1 grid grid-cols-12 overflow-hidden min-h-0 relative z-10">

        {/* ZONA ESQUERDA — MediaVault (5 cols) */}
        <aside className="col-span-5 relative border-r border-cyan-500/10">
          <MediaVaultViewer assets={vaultAssets} />
        </aside>

        {/* ZONA DIREITA — FighterRightPanel gerencia idioma + header + data zone */}
        <div className="col-span-7 relative">
          <FighterRightPanel
            header={{
              rosterNumber:  Number(fighter.rosterNumber),
              name:          fighter.name,
              franchiseName: fighter.franchise.name,
              appearances,
            }}
            originGames={rawOriginGames}
            dataZone={dataZoneData}
          />
        </div>

      </main>
    </div>
  );
}
