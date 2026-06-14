import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Zap } from "lucide-react";
import { db } from "@/lib/db";
import { GAME_META, GAME_ORDER, type GameVersion } from "@/lib/smash-meta";
import { type MediaAsset } from "@/components/ui/MediaVaultViewer";
import { type MusicTrack } from "@/components/ui/MusicPlayer";
import FighterPageLayout from "@/components/ui/FighterPageLayout";
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
  boxArtPath?:      string;   // capa NA/EN (local)
  boxArtPathJp?:    string;   // capa JP (local)
  boxArtUrl?:       string;   // URL externa via ChronicleEntry (fallback)
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
  // Xenoblade Chronicles 2 — Pyra e Mythra compartilham a mesma página
  "Pyra":  [{ name: "Xenoblade Chronicles 2", console: "NSW", year: 2017, badgeColor: "#2a2a8e", wikiUrl: "https://en.wikipedia.org/wiki/Xenoblade_Chronicles_2" }],
  "Mythra":[{ name: "Xenoblade Chronicles 2", console: "NSW", year: 2017, badgeColor: "#2a2a8e", wikiUrl: "https://en.wikipedia.org/wiki/Xenoblade_Chronicles_2" }],
  // Cloud e Sephiroth compartilham Final Fantasy VII
  "Cloud":     [{ name: "Final Fantasy VII", console: "PS", year: 1997, badgeColor: "#1a1a7e", wikiUrl: "https://en.wikipedia.org/wiki/Final_Fantasy_VII" }],
  "Sephiroth": [{ name: "Final Fantasy VII", console: "PS", year: 1997, badgeColor: "#1a1a7e", wikiUrl: "https://en.wikipedia.org/wiki/Final_Fantasy_VII" }],
};

// ─── GIFs por lutador e por era ─────────────────────────────────────────────

type GifEra   = "ORIGIN" | "SSB64" | "SSBM" | "SSBB" | "SSB4" | "SSBU";
type GifEntry = { url: string; label: string; sublabel: string };

const FIGHTER_GIFS: Record<string, Partial<Record<GifEra, GifEntry[]>>> = {
  "Ness": {
    // Sem GIFs de origem (EarthBound) — paula e poo eram troféus Melee, removidos
    SSBM: [
      { url: "/assets/gifs/ness-melee-pk.gif",   label: "Ness · PK Fire",           sublabel: "Ataque especial PK Fire · Super Smash Bros. Melee (GameCube, 2001)"   },
      { url: "/assets/gifs/ness-melee-2.gif",    label: "Ness · Entrada em cena",   sublabel: "Movimentação em batalha · Super Smash Bros. Melee (GameCube, 2001)"  },
    ],
    SSBB: [
      { url: "/assets/gifs/ness-mother2-1.gif",  label: "Ness · Troféu Brawl",      sublabel: "Troféu 3D animado · Super Smash Bros. Brawl (Wii, 2008)"              },
      { url: "/assets/gifs/ness-smash-anim.gif", label: "Ness · Animação Brawl",    sublabel: "Cena de gameplay · Super Smash Bros. Brawl (Wii, 2008)"               },
    ],
    SSB4: [
      { url: "/assets/gifs/ness-mother2-2.gif",  label: "Ness · Troféu Smash 4",    sublabel: "Card de troféu · Super Smash Bros. for Wii U (Wii U, 2014)"           },
      { url: "/assets/gifs/ness-smash4.gif",     label: "Ness · Gameplay Smash 4",  sublabel: "Cena de batalha · Super Smash Bros. for Wii U (Wii U, 2014)"          },
    ],
    SSBU: [
      { url: "/assets/gifs/ness-ultimate-1.gif", label: "Ness · Ultimate",          sublabel: "Gameplay em batalha · Super Smash Bros. Ultimate (Switch, 2018)"      },
      { url: "/assets/gifs/ness-ultimate-2.gif", label: "Ness · PK Thunder",        sublabel: "Ataque especial PK Thunder · Super Smash Bros. Ultimate (Switch, 2018)" },
      { url: "/assets/gifs/jeff-mother2.gif",    label: "Ness + Jeff · Cena",       sublabel: "Assist Trophy de Jeff · Super Smash Bros. Ultimate (Switch, 2018)"    },
    ],
  },
};

// ─── Trilha sonora hardcoded (fallback enquanto o DB não está populado) ───────
// A fonte primária é fighter.musicYoutubeId / musicTitle / musicArtist no banco.
// Esta constante só é usada se o banco não tiver dados para o personagem.
const FIGHTER_MUSIC_FALLBACK: Record<string, MusicTrack> = {
  "Ness": { youtubeId: "OsQEEHUuLGg", title: "Bein' Friends", artist: "Shogo Sakai · Melee Remix" },
};

const FRANCHISE_ORIGIN_GAMES: Record<string, OriginGame[]> = {
  "EarthBound":          [
    { name: "EarthBound", titleJp: "MOTHER2 ギーグの逆襲", console: "SNES", consoleFull: "Super Famicom",   year: 1994, month: 8, region: "JP", badgeColor: "#6d3b8e", iconFile: "snes.svg", boxArtPath: "/assets/games/EARTHBOUND_USA_BOX.jpg", boxArtLandscape: true, wikiUrl: "https://en.wikipedia.org/wiki/EarthBound", wikiUrlJp: "https://ja.wikipedia.org/wiki/MOTHER2_ギーグの逆襲" },
    { name: "Mother 3",   titleJp: "MOTHER3",              console: "GBA",  consoleFull: "Game Boy Advance", year: 2006, month: 4, region: "JP", badgeColor: "#5c1f8a", iconFile: "gba.svg", jpExclusive: true, boxArtPath: "/assets/games/MOTHER3_JP_BOX.jpg", boxArtLandscape: true, wikiUrl: "https://ja.wikipedia.org/wiki/MOTHER3", wikiUrlJp: "https://ja.wikipedia.org/wiki/MOTHER3" },
  ],
  "Mario":               [{ name: "Donkey Kong",         console: "ARC",  year: 1981,              badgeColor: "#b02020", boxArtPath: "/assets/games/DONKEY_KONG_ARC_BOX.jpg",    wikiUrl: "https://en.wikipedia.org/wiki/Donkey_Kong_(1981_video_game)" },
                          { name: "Super Mario Bros.",    console: "NES",  year: 1985,              badgeColor: "#e60012", boxArtPath: "/assets/games/SUPER_MARIO_BROS_NES_BOX.png", wikiUrl: "https://en.wikipedia.org/wiki/Super_Mario_Bros." }],
  "Donkey Kong":         [{ name: "Donkey Kong",         console: "ARC",  year: 1981,              badgeColor: "#b02020", boxArtPath: "/assets/games/DONKEY_KONG_ARC_BOX.jpg",    wikiUrl: "https://en.wikipedia.org/wiki/Donkey_Kong_(1981_video_game)" },
                          { name: "Donkey Kong Country", console: "SNES", year: 1994,              badgeColor: "#6d3b8e", boxArtPath: "/assets/games/DKC_SNES_BOX.png",           wikiUrl: "https://en.wikipedia.org/wiki/Donkey_Kong_Country" }],
  "The Legend of Zelda": [{ name: "The Legend of Zelda", console: "NES",  year: 1986,              badgeColor: "#e60012", boxArtPath: "/assets/games/ZELDA_NES_BOX.png",          wikiUrl: "https://en.wikipedia.org/wiki/The_Legend_of_Zelda_(video_game)" }],
  "Pokémon":             [{ name: "Pocket Monsters R/G", console: "GB",   year: 1996, region: "JP", badgeColor: "#555",   boxArtPath: "/assets/games/POKEMON_RED_BLUE_GB_BOX.webp", wikiUrl: "https://en.wikipedia.org/wiki/Pok%C3%A9mon_Red_and_Blue" },
                          { name: "Pokémon Red / Blue",  console: "GB",   year: 1998,              badgeColor: "#555",   boxArtPath: "/assets/games/POKEMON_RED_BLUE_GB_BOX.webp", wikiUrl: "https://en.wikipedia.org/wiki/Pok%C3%A9mon_Red_and_Blue" }],
  "Metroid":             [{ name: "Metroid",             console: "NES",  year: 1986,              badgeColor: "#e60012", boxArtPath: "/assets/games/METROID_NES_BOX.jpg",         wikiUrl: "https://en.wikipedia.org/wiki/Metroid_(video_game)" }],
  "Kirby":               [{ name: "Kirby's Dream Land",  console: "GB",   year: 1992,              badgeColor: "#555",   boxArtPath: "/assets/games/KIRBY_DREAMLAND_GB_BOX.png",  wikiUrl: "https://en.wikipedia.org/wiki/Kirby%27s_Dream_Land" }],
  "Star Fox":            [{ name: "Star Fox",            console: "SNES", year: 1993,              badgeColor: "#6d3b8e", boxArtPath: "/assets/games/STARFOX_SNES_BOX.jpg",        wikiUrl: "https://en.wikipedia.org/wiki/Star_Fox_(SNES)" }],
  "F-Zero": [
    { name: "F-Zero",           titleJp: "F-ZERO",             console: "SNES", consoleFull: "Super Famicom",     consoleFullEn: "Super Nintendo Entertainment System", year: 1990, month: 11, region: "JP", yearNa: 1991, monthNa: 8,  regionNa: "NA", badgeColor: "#1a6ecc", iconFile: "snes.svg", boxArtPath: "/assets/games/FZERO_SNES_BOX.jpg",        wikiUrl: "https://en.wikipedia.org/wiki/F-Zero_(video_game)",            wikiUrlJp: "https://ja.wikipedia.org/wiki/F-ZERO" },
    { name: "F-Zero X",         titleJp: "F-ZERO X",           console: "N64",  consoleFull: "Nintendo 64",       year: 1998, month: 7,  region: "JP", yearNa: 1998, monthNa: 10, regionNa: "NA", badgeColor: "#1a6ecc", iconFile: "n64.svg",  boxArtPath: "/assets/games/FZERO_X_N64_BOX.jpg",       wikiUrl: "https://en.wikipedia.org/wiki/F-Zero_X",                       wikiUrlJp: "https://ja.wikipedia.org/wiki/F-ZERO_X" },
    { name: "F-Zero GX",        titleJp: "F-ZERO GX",          console: "GCN",  consoleFull: "Nintendo GameCube", year: 2003, month: 7,  region: "JP", yearNa: 2003, monthNa: 8,  regionNa: "NA", badgeColor: "#1a6ecc", iconFile: "gcn.svg",  boxArtPath: "/assets/games/FZERO_GX_GCN_BOX.png",      wikiUrl: "https://en.wikipedia.org/wiki/F-Zero_GX",                      wikiUrlJp: "https://ja.wikipedia.org/wiki/F-ZERO_GX" },
    { name: "F-Zero GP Legend",  titleJp: "F-ZERO ファルコン伝説", console: "GBA",  consoleFull: "Game Boy Advance",  year: 2003, month: 8,  region: "JP", yearNa: 2004, monthNa: 9,  regionNa: "NA", badgeColor: "#1a6ecc", iconFile: "gba.svg",  boxArtPath: "/assets/games/FZERO_GPLEGEND_GBA_BOX.gif",wikiUrl: "https://en.wikipedia.org/wiki/F-Zero_GP_Legend_(video_game)",  wikiUrlJp: "https://ja.wikipedia.org/wiki/F-ZERO_ファルコン伝説" },
    { name: "F-Zero Climax",     titleJp: "F-ZERO クライマックス", console: "GBA",  consoleFull: "Game Boy Advance",  year: 2004, month: 10, region: "JP", jpExclusive: true,         badgeColor: "#1a6ecc", iconFile: "gba.svg",  boxArtPath: "/assets/games/FZERO_CLIMAX_GBA_BOX.png",  wikiUrl: "https://en.wikipedia.org/wiki/F-Zero_Climax",                  wikiUrlJp: "https://ja.wikipedia.org/wiki/F-ZERO_クライマックス" },
  ],
  "Fire Emblem":         [{ name: "Fire Emblem",         console: "NES",  year: 1990, region: "JP", badgeColor: "#e60012", boxArtPath: "/assets/games/FIRE_EMBLEM_NES_BOX.jpg",    wikiUrl: "https://en.wikipedia.org/wiki/Fire_Emblem:_Shadow_Dragon_and_the_Blade_of_Light" }],
  "Pikmin":              [{ name: "Pikmin",              console: "GCN",  year: 2001,              badgeColor: "#1a1a5e", boxArtPath: "/assets/games/PIKMIN_GCN_BOX.jpg",           wikiUrl: "https://en.wikipedia.org/wiki/Pikmin_(video_game)" }],
  "Animal Crossing":     [{ name: "Animal Forest",       console: "N64",  year: 2001, region: "JP", badgeColor: "#1a3a7e", boxArtPath: "/assets/games/ANIMAL_CROSSING_N64_BOX.png", wikiUrl: "https://en.wikipedia.org/wiki/Animal_Crossing_(video_game)" }],
  "Kid Icarus":          [{ name: "Kid Icarus",          console: "NES",  year: 1986,              badgeColor: "#e60012", boxArtPath: "/assets/games/KID_ICARUS_NES_BOX.png",      wikiUrl: "https://en.wikipedia.org/wiki/Kid_Icarus" }],
  "Ice Climber":         [{ name: "Ice Climber",         console: "NES",  year: 1984,              badgeColor: "#e60012", boxArtPath: "/assets/games/ICE_CLIMBER_NES_BOX.jpg",     wikiUrl: "https://en.wikipedia.org/wiki/Ice_Climber" }],
  "Wario":               [{ name: "Wario Land",          console: "GB",   year: 1994,              badgeColor: "#555",   boxArtPath: "/assets/games/WARIO_LAND_GB_BOX.png",        wikiUrl: "https://en.wikipedia.org/wiki/Wario_Land:_Super_Mario_Land_3" }],
  "Yoshi":               [{ name: "Yoshi's Island",      console: "SNES", year: 1995,              badgeColor: "#6d3b8e", boxArtPath: "/assets/games/YOSHIS_ISLAND_SNES_BOX.jpg",  wikiUrl: "https://en.wikipedia.org/wiki/Super_Mario_World_2:_Yoshi%27s_Island" }],
  "Xenoblade":           [{ name: "Xenoblade Chronicles",console: "Wii",  year: 2010,              badgeColor: "#2a2a8e", boxArtPath: "/assets/games/XENOBLADE_WII_BOX.png",       wikiUrl: "https://en.wikipedia.org/wiki/Xenoblade_Chronicles" }],
  "Punch-Out!!":         [{ name: "Punch-Out!!",         console: "NES",  year: 1987,              badgeColor: "#e60012", boxArtPath: "/assets/games/PUNCHOUT_NES_BOX.jpg",        wikiUrl: "https://en.wikipedia.org/wiki/Punch-Out!!_(NES)" }],
  "Duck Hunt":           [{ name: "Duck Hunt",           console: "NES",  year: 1984,              badgeColor: "#e60012", boxArtPath: "/assets/games/DUCK_HUNT_NES_BOX.jpg",       wikiUrl: "https://en.wikipedia.org/wiki/Duck_Hunt" }],
  "Sonic":               [{ name: "Sonic the Hedgehog",  console: "GEN",  year: 1991,              badgeColor: "#0044aa", boxArtPath: "/assets/games/SONIC_GEN_BOX.jpg",           wikiUrl: "https://en.wikipedia.org/wiki/Sonic_the_Hedgehog_(1991_video_game)" }],
  // Alias para nome do DB ("Sonic the Hedgehog")
  "Sonic the Hedgehog":  [{ name: "Sonic the Hedgehog",  console: "GEN",  year: 1991,              badgeColor: "#0044aa", boxArtPath: "/assets/games/SONIC_GEN_BOX.jpg",           wikiUrl: "https://en.wikipedia.org/wiki/Sonic_the_Hedgehog_(1991_video_game)" }],
  "Mega Man":            [{ name: "Mega Man",            console: "NES",  year: 1987,              badgeColor: "#e60012", boxArtPath: "/assets/games/MEGA_MAN_NES_BOX.jpg",        wikiUrl: "https://en.wikipedia.org/wiki/Mega_Man_(video_game)" }],
  "Pac-Man":             [{ name: "Pac-Man",             console: "ARC",  year: 1980,              badgeColor: "#b02020", boxArtPath: "/assets/games/PAC_MAN_ARC_BOX.png",         wikiUrl: "https://en.wikipedia.org/wiki/Pac-Man" }],
  "Street Fighter":      [{ name: "Street Fighter II",   console: "ARC",  year: 1991,              badgeColor: "#b02020", boxArtPath: "/assets/games/SF2_ARC_BOX.jpg",             wikiUrl: "https://en.wikipedia.org/wiki/Street_Fighter_II" }],
  "Castlevania":         [{ name: "Castlevania",         console: "NES",  year: 1986,              badgeColor: "#e60012", boxArtPath: "/assets/games/CASTLEVANIA_NES_BOX.png",     wikiUrl: "https://en.wikipedia.org/wiki/Castlevania_(1986_video_game)" }],
  "Persona":             [{ name: "Persona 5",           console: "PS4",  year: 2016,              badgeColor: "#aa0000", boxArtPath: "/assets/games/PERSONA5_PS4_BOX.jpg",        wikiUrl: "https://en.wikipedia.org/wiki/Persona_5" }],
  "Dragon Quest":        [{ name: "Dragon Quest",        console: "NES",  year: 1986, region: "JP", badgeColor: "#e60012", boxArtPath: "/assets/games/DRAGON_QUEST_NES_BOX.jpg",   wikiUrl: "https://en.wikipedia.org/wiki/Dragon_Quest_(video_game)" }],
  "Banjo-Kazooie":       [{ name: "Banjo-Kazooie",       console: "N64",  year: 1998,              badgeColor: "#1a3a7e", boxArtPath: "/assets/games/BANJO_KAZOOIE_N64_BOX.png",  wikiUrl: "https://en.wikipedia.org/wiki/Banjo-Kazooie" }],
  "ARMS":                [{ name: "ARMS",                console: "NSW",  year: 2017,              badgeColor: "#e60040", boxArtPath: "/assets/games/ARMS_NSW_BOX.jpg",            wikiUrl: "https://en.wikipedia.org/wiki/ARMS_(video_game)" }],
  "Bayonetta":           [{ name: "Bayonetta",           console: "PS3",  year: 2009,              badgeColor: "#2a2a8e", boxArtPath: "/assets/games/BAYONETTA_PS3_BOX.png",       wikiUrl: "https://en.wikipedia.org/wiki/Bayonetta_(video_game)" }],
  "Game & Watch":        [{ name: "Ball",                console: "G&W",  year: 1980,              badgeColor: "#333",   wikiUrl: "https://en.wikipedia.org/wiki/Ball_(Nintendo_Game_%26_Watch)" }],
  // Xenoblade Chronicles (alias para nome do DB)
  "Xenoblade Chronicles":[{ name: "Xenoblade Chronicles",console: "Wii",  year: 2010,              badgeColor: "#2a2a8e", boxArtPath: "/assets/games/XENOBLADE_WII_BOX.png",       wikiUrl: "https://en.wikipedia.org/wiki/Xenoblade_Chronicles" }],
  // 3rd party & DLC
  "Metal Gear":          [{ name: "Metal Gear Solid",    console: "PS",   year: 1998,              badgeColor: "#3a3a3a", wikiUrl: "https://en.wikipedia.org/wiki/Metal_Gear_Solid" }],
  "Wii Fit":             [{ name: "Wii Fit",             console: "Wii",  year: 2007,              badgeColor: "#7bc3e2", wikiUrl: "https://en.wikipedia.org/wiki/Wii_Fit" }],
  "Splatoon":            [{ name: "Splatoon",            console: "WiiU", year: 2015,              badgeColor: "#e75f14", wikiUrl: "https://en.wikipedia.org/wiki/Splatoon_(video_game)" }],
  "Fatal Fury":          [{ name: "Fatal Fury",          console: "NEO",  year: 1991,              badgeColor: "#cc2200", wikiUrl: "https://en.wikipedia.org/wiki/Fatal_Fury:_King_of_Fighters" }],
  "Final Fantasy":       [{ name: "Final Fantasy VII",   console: "PS",   year: 1997,              badgeColor: "#1a1a7e", wikiUrl: "https://en.wikipedia.org/wiki/Final_Fantasy_VII" }],
  "Minecraft":           [{ name: "Minecraft",           console: "PC",   year: 2011,              badgeColor: "#5c9e31", wikiUrl: "https://en.wikipedia.org/wiki/Minecraft" }],
  "Tekken":              [{ name: "Tekken",              console: "ARC",  year: 1994,              badgeColor: "#1a1a1a", wikiUrl: "https://en.wikipedia.org/wiki/Tekken_(video_game)" }],
  "Kingdom Hearts":      [{ name: "Kingdom Hearts",      console: "PS2",  year: 2002,              badgeColor: "#1a4db7", wikiUrl: "https://en.wikipedia.org/wiki/Kingdom_Hearts_(video_game)" }],
  "R.O.B.":              [{ name: "Gyromite",            console: "NES",  year: 1985,              badgeColor: "#e60012", wikiUrl: "https://en.wikipedia.org/wiki/Gyromite" }],
  "Super Smash Bros.":   [{ name: "Mii",                 console: "Wii",  year: 2006,              badgeColor: "#e60012", wikiUrl: "https://en.wikipedia.org/wiki/Mii" }],
};

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

  const [fighter, trophies, originAssets] = await Promise.all([
    db.fighter.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
      include: {
        franchise: true,
        bios:  { orderBy: { smashGameVersion: "asc" } },
        works: { include: { game: { include: { franchise: true } } } },
        chronicleLinks: { include: { chronicleEntry: true } },
        tips: true,
        suggestions: {
          where: { approved: true },
          orderBy: { createdAt: "desc" }
        }
      },
    }),
    db.collectible.findMany({
      where: { fighter: { name: { equals: name, mode: "insensitive" } }, type: "TROPHY" },
      orderBy: [{ smashGameVersion: "asc" }, { name: "asc" }],
    }),
    db.collectible.findMany({
      where: {
        fighter: { name: { equals: name, mode: "insensitive" } },
        type:    { in: ["SPRITE", "SPIRIT", "MEDIA"] },
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
    if (w.game.franchise?.name !== "Super Smash Bros.") continue; // só aparições no Smash
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

  const erasSet = new Set<string>();
  for (const v of appearances) erasSet.add(v);
  for (const b of biosOrdered) erasSet.add(b.smashGameVersion);
  for (const [v] of trophiesByGame) erasSet.add(v);
  const erasToShow = GAME_ORDER.filter((v) => erasSet.has(v));



  // ── Media Vault — ORDEM CRONOLÓGICA: ORIGIN → SSBM → SSBB → SSB4 → SSBU ──
  const vaultAssets: MediaAsset[] = [];
  const fighterGifsMap = FIGHTER_GIFS[fighter.name] ?? {};

  const pushGifs = (era: GifEra) => {
    for (const g of fighterGifsMap[era] ?? []) {
      vaultAssets.push({ url: g.url, label: g.label, sublabel: g.sublabel, assetType: "gif" });
    }
  };

  const mediaAssets = originAssets.filter((o) => o.type === "MEDIA");
  const pushMedia = (filter: (name: string) => boolean, assetType: MediaAsset["assetType"], sublabelFn: (name: string) => string) => {
    for (const m of mediaAssets.filter((m) => filter(m.name))) {
      vaultAssets.push({ url: m.assetRenderUrl, label: m.name, sublabel: sublabelFn(m.name), assetType });
    }
  };

  const originGameEntry = (FIGHTER_ORIGIN_GAMES[fighter.name] ?? FRANCHISE_ORIGIN_GAMES[fighter.franchise.name] ?? [])[0];
  const originGameLabel = originGameEntry
    ? `${originGameEntry.name} (${originGameEntry.console}, ${originGameEntry.yearNa ?? originGameEntry.year})`
    : fighter.franchise.name;

  // 1. ORIGIN — sprite de pixel art + GIFs do jogo de origem
  for (const oa of originAssets.filter((o) => o.type === "SPRITE")) {
    const consoleLabel = originGameEntry?.consoleFull ?? "Super Famicom";
    const yearLabel    = originGameEntry?.year ?? "1994";
    vaultAssets.push({
      url: oa.assetRenderUrl, label: oa.name,
      sublabel: `Sprite de batalha original · ${fighter.franchise.name} (${consoleLabel}, ${yearLabel})`,
      assetType: "sprite",
    });
  }
  pushMedia((n) => n.includes("GIF"), "gif",
    (n) => `Gameplay de origem · ${originGameLabel} — ${n.replace("GIF - ", "")}`);

  // 2. SSBM (2001) — clay model → artwork → troféus → GIFs
  pushMedia((n) => n.includes("Clay"), "clay",
    () => "Modelo de argila utilizado como referência 3D · Super Smash Bros. Melee (GameCube, 2001)");
  pushMedia((n) => n.toLowerCase().includes("artwork"), "art",
    () => "Arte oficial · Super Smash Bros. Melee (GameCube, 2001)");
  for (const t of trophiesByGame.get("SSBM") ?? []) {
    vaultAssets.push({ url: t.assetRenderUrl, label: t.name,
      sublabel: "Troféu 3D oficial · Super Smash Bros. Melee (GameCube, 2001)", assetType: "trophy" });
  }
  pushGifs("SSBM");

  // 3. SSBB (2008) — troféus → GIFs (stickers removidos)
  for (const t of trophiesByGame.get("SSBB") ?? []) {
    vaultAssets.push({ url: t.assetRenderUrl, label: t.name,
      sublabel: "Troféu 3D oficial · Super Smash Bros. Brawl (Wii, 2008)", assetType: "trophy" });
  }
  pushGifs("SSBB");

  // 4. SSB4 (2014) — troféus → GIFs
  for (const t of trophiesByGame.get("SSB4") ?? []) {
    vaultAssets.push({ url: t.assetRenderUrl, label: t.name,
      sublabel: "Troféu 3D oficial · Super Smash Bros. for Wii U / 3DS (2014)", assetType: "trophy" });
  }
  pushGifs("SSB4");

  // 5. SSBU (2018) — render oficial → spirit → GIFs
  if (fighter.imageUrl) {
    vaultAssets.push({
      url: fighter.imageUrl, label: `${fighter.name} — Render Oficial`,
      sublabel: "Render 3D oficial do personagem · Super Smash Bros. Ultimate (Switch, 2018)",
      assetType: "render",
    });
  }
  for (const oa of originAssets.filter((o) => o.type === "SPIRIT")) {
    vaultAssets.push({
      url: oa.assetRenderUrl, label: `${oa.name} — Spirit`,
      sublabel: "Spirit de batalha · Super Smash Bros. Ultimate (Switch, 2018)",
      assetType: "spirit",
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

  const rawOriginGamesBase =
    FIGHTER_ORIGIN_GAMES[fighter.name] ??
    FRANCHISE_ORIGIN_GAMES[fighter.franchise.name] ??
    [];

  // Para jogos sem capa local, busca boxArtUrl no ChronicleEntry
  const needsArt = rawOriginGamesBase.filter(g => !g.boxArtPath && !g.boxArtPathJp).map(g => g.name);
  const chronicleArtMap = new Map<string, string>();
  if (needsArt.length > 0) {
    const entries = await db.chronicleEntry.findMany({
      where: { titleNtsc: { in: needsArt }, boxArtUrl: { not: null } },
      select: { titleNtsc: true, boxArtUrl: true },
    });
    for (const e of entries) {
      if (e.boxArtUrl) chronicleArtMap.set(e.titleNtsc, e.boxArtUrl);
    }
  }
  const rawOriginGames = rawOriginGamesBase.map(g =>
    chronicleArtMap.has(g.name) ? { ...g, boxArtUrl: chronicleArtMap.get(g.name) } : g
  );

  // ── Origin games ligados DIRETAMENTE ao Chronicles (FighterChronicleLink) ──
  // Fonte única de verdade = ChronicleEntry (capa, wiki, console, datas, títulos JP).
  const dbOriginGames = [...fighter.chronicleLinks]
    .sort((a, b) => (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999))
    .map((link): typeof rawOriginGames[number] => {
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

  // Usa os links do Chronicles se houver; senão, cai para o hardcoded legado.
  const originGamesUI = dbOriginGames.length > 0 ? dbOriginGames : rawOriginGames;

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
      trophies: trophies.length,
      stickers: 0,
      spirits:  originAssets.filter((o) => o.type === "SPIRIT").length,
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
          music={
            // Prioridade: DB (musicStatus = approved ou pending_review) → fallback hardcoded
            fighter.musicYoutubeId
              ? { youtubeId: fighter.musicYoutubeId, title: fighter.musicTitle ?? "", artist: fighter.musicArtist ?? undefined }
              : FIGHTER_MUSIC_FALLBACK[fighter.name]
          }
          header={{
            rosterNumber:  Number(fighter.rosterNumber),
            name:          fighter.name,
            franchiseName: fighter.franchise.name,
            appearances,
          }}
          originGames={originGamesUI}
          dataZone={dataZoneData}
        />
      </main>
    </div>
  );
}
