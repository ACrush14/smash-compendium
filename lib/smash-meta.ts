/**
 * smash-meta.ts — Constantes compartilhadas entre server e client components.
 * Importado em page.tsx (server) e FighterDataZone.tsx (client).
 */

export type GameVersion = "SSB64" | "SSBM" | "SSBB" | "SSB4" | "SSBU";

export interface GameMetaEntry {
  short:        string;
  platform:     string;    // plataforma do console (ex: "Nintendo 64")
  consoleFull:  string;    // nome completo do console (ex: "NINTENDO 64")
  year:         string;
  // Tailwind classes — completas para safelist
  color:        string;    // badge (border + bg + text)
  accent:       string;    // border-l do bloco de era
  headerFrom:   string;    // gradient-from do cabeçalho
  platBg:       string;    // platform badge bg
  platBorder:   string;    // platform badge border
  platText:     string;    // platform badge text color
  // Estilo da era no cabeçalho expandido
  eraHeaderBg:    string;    // fundo do bloco de identidade do console (CSS color)
  eraTextColor:   string;    // cor do texto principal da era (CSS color)
  consoleBg:      string;    // fundo do bloco esquerdo do console (CSS color)
  releaseMonth?:  string;    // mês de lançamento JP (ex: "01") para exibir "1999.01"
  // Nomes completos EN e JP
  fullNameEn?:    string;
  fullNameJp?:    string;
  // Box art images
  boxArtUsa?:          string;   // /assets/games/...
  boxArtJp?:           string;   // /assets/games/...
  boxArtAlt?:          string;   // box art adicional (ex: 3DS JP para SSB4)
  boxArtAltJp?:        string;
  // Orientação/proporção do box art para o painel de estreia
  boxArtUsaLandscape?: boolean;  // true = paisagem (apenas SSB64 USA)
  boxArtUsaAspect?:    number;   // w/h explícito (ex: 0.62 para Switch 620×1000)
  boxArtJpAspect?:     number;   // w/h explícito para caixa JP
  // Links da Wikipedia
  wikiUrlUsa?:         string;
  wikiUrlJp?:          string;
  // Console icon (injetado no bloco esquerdo da EraHeader)
  consoleIcon?: string;    // /assets/consoles/...
}

export const GAME_META: Record<string, GameMetaEntry> = {
  SSB64: {
    short:        "SSB 64",
    platform:     "Nintendo 64",
    consoleFull:  "NINTENDO 64",
    year:         "1999",
    color:        "border-amber-500/50 bg-amber-950/30 text-amber-300",
    accent:       "border-l-amber-500",
    headerFrom:   "from-amber-950/50",
    platBg:       "bg-amber-950/60", platBorder: "border-amber-600/40", platText: "text-amber-300",
    eraHeaderBg:   "rgba(40,20,0,0.85)",
    eraTextColor:  "#fbbf24",
    consoleBg:     "rgba(60,30,0,0.9)",
    releaseMonth:  "01",
    fullNameEn:    "Super Smash Bros.",
    fullNameJp:    "大乱闘スマッシュブラザーズ",
    boxArtUsa:           "/assets/games/SSB64_USA_BOX.jpg",
    boxArtJp:            "/assets/games/SSB64_JP_BOX.jpg",
    boxArtUsaLandscape:  true,   // caixa N64 USA é landscape
    consoleIcon:         "n64.svg",
    wikiUrlUsa:          "https://en.wikipedia.org/wiki/Super_Smash_Bros._(video_game)",
    wikiUrlJp:           "https://ja.wikipedia.org/wiki/ニンテンドウオールスター!大乱闘スマッシュブラザーズ",
  },
  SSBM: {
    short:        "Melee",
    platform:     "GameCube",
    consoleFull:  "GAMECUBE",
    year:         "2001",
    color:        "border-sky-500/50 bg-sky-950/30 text-sky-300",
    accent:       "border-l-sky-400",
    headerFrom:   "from-sky-950/50",
    platBg:       "bg-sky-950/60", platBorder: "border-sky-500/40", platText: "text-sky-300",
    eraHeaderBg:   "rgba(0,20,40,0.85)",
    eraTextColor:  "#38bdf8",
    consoleBg:     "rgba(0,30,55,0.9)",
    releaseMonth:  "11",
    fullNameEn:    "Super Smash Bros. Melee",
    fullNameJp:    "大乱闘スマッシュブラザーズDX",
    boxArtUsa:    "/assets/games/SSBMELEE_USA_BOX.jpg",
    boxArtJp:     "/assets/games/SSBMELEE_JP_BOX.jpg",
    consoleIcon:  "gcn.svg",
    wikiUrlUsa:   "https://en.wikipedia.org/wiki/Super_Smash_Bros._Melee",
    wikiUrlJp:    "https://ja.wikipedia.org/wiki/大乱闘スマッシュブラザーズDX",
  },
  SSBB: {
    short:        "Brawl",
    platform:     "Wii",
    consoleFull:  "WII",
    year:         "2008",
    color:        "border-purple-500/50 bg-purple-950/30 text-purple-300",
    accent:       "border-l-purple-500",
    headerFrom:   "from-purple-950/60",
    platBg:       "bg-purple-950/60", platBorder: "border-purple-500/40", platText: "text-purple-300",
    eraHeaderBg:   "rgba(20,0,40,0.85)",
    eraTextColor:  "#c084fc",
    consoleBg:     "rgba(30,0,55,0.9)",
    releaseMonth:  "01",
    fullNameEn:    "Super Smash Bros. Brawl",
    fullNameJp:    "大乱闘スマッシュブラザーズX",
    boxArtUsa:    "/assets/games/SSBBRAWL_USA_BOX.webp",
    boxArtJp:     "/assets/games/SSBBRAWL_JP_BOX.jpg",
    consoleIcon:  "wii.svg",
    wikiUrlUsa:   "https://en.wikipedia.org/wiki/Super_Smash_Bros._Brawl",
    wikiUrlJp:    "https://ja.wikipedia.org/wiki/大乱闘スマッシュブラザーズX",
  },
  SSB4: {
    short:        "Smash 4",
    platform:     "Wii U / 3DS",
    consoleFull:  "WII U  ·  3DS",
    year:         "2014",
    color:        "border-blue-500/50 bg-blue-950/30 text-blue-300",
    accent:       "border-l-blue-400",
    headerFrom:   "from-blue-950/50",
    platBg:       "bg-blue-950/60", platBorder: "border-blue-500/40", platText: "text-blue-300",
    eraHeaderBg:   "rgba(0,10,40,0.85)",
    eraTextColor:  "#60a5fa",
    consoleBg:     "rgba(0,15,55,0.9)",
    releaseMonth:  "09",
    fullNameEn:    "Super Smash Bros. for Wii U / 3DS",
    fullNameJp:    "大乱闘スマッシュブラザーズ for Wii U / 3DS",
    boxArtUsa:    "/assets/games/SSBWIIU_USA_BOX.jpg",
    boxArtAltJp:  "/assets/games/SSB3DS_JP_BOX.jpg",
    consoleIcon:  "wiiu.svg",
    wikiUrlUsa:   "https://en.wikipedia.org/wiki/Super_Smash_Bros._for_Nintendo_3DS_and_Wii_U",
    wikiUrlJp:    "https://ja.wikipedia.org/wiki/大乱闘スマッシュブラザーズ_for_Nintendo_3DS_/_Wii_U",
  },
  SSBU: {
    short:        "Ultimate",
    platform:     "Nintendo Switch",
    consoleFull:  "NINTENDO SWITCH",
    year:         "2018",
    color:        "border-red-500/50 bg-red-950/30 text-red-300",
    accent:       "border-l-red-500",
    headerFrom:   "from-red-950/50",
    platBg:       "bg-red-950/60", platBorder: "border-red-500/40", platText: "text-red-300",
    eraHeaderBg:   "rgba(40,0,0,0.85)",
    eraTextColor:  "#f87171",
    consoleBg:     "rgba(60,0,0,0.9)",
    releaseMonth:  "12",
    fullNameEn:    "Super Smash Bros. Ultimate",
    fullNameJp:    "大乱闘スマッシュブラザーズ SPECIAL",
    boxArtUsa:        "/assets/games/SSBULTIMATE_USA_BOX.jpg",
    boxArtJp:         "/assets/games/SSBULTIMATE_JP_BOX.jpg",
    boxArtUsaAspect:  0.62,   // Switch box: 620×1000
    boxArtJpAspect:   0.62,
    consoleIcon:      "switch.svg",
    wikiUrlUsa:       "https://en.wikipedia.org/wiki/Super_Smash_Bros._Ultimate",
    wikiUrlJp:        "https://ja.wikipedia.org/wiki/大乱闘スマッシュブラザーズ_SPECIAL",
  },
};

export const GAME_ORDER: GameVersion[] = ["SSB64", "SSBM", "SSBB", "SSB4", "SSBU"];
