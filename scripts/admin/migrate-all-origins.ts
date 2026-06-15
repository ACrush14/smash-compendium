import { db } from "../../lib/db";

type OriginGame = {
  name:           string;
  titleJp?:       string;
  console:        string;
  consoleFull?:   string;
  consoleFullEn?: string;
  year:           number;
  month?:         number;
  region?:        string;
  yearNa?:        number;
  monthNa?:       number;
  regionNa?:      string;
  badgeColor:     string;
  iconFile?:      string;
  boxArtPath?:    string;
  boxArtPathJp?:  string;
  boxArtUrl?:     string;
  boxArtLandscape?: boolean;
  jpExclusive?:   boolean;
  wikiUrl?:       string;
  wikiUrlJp?:     string;
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
// Helpers
function getConsoleNameByAbbrev(abbrev: string): string {
  for (const [key, val] of Object.entries(CONSOLE_META)) {
    if (val.console === abbrev) return key;
  }
  return abbrev; // fallback
}

async function main() {
  const fighters = await db.fighter.findMany({ include: { franchise: true } });
  
  for (const fighter of fighters) {
    if (fighter.name === "Mario") continue; // Already done by Claude
    
    const origins = FIGHTER_ORIGIN_GAMES[fighter.name] ?? FRANCHISE_ORIGIN_GAMES[fighter.franchise.name] ?? [];
    if (origins.length === 0) continue;
    
    let order = 1;
    for (const g of origins) {
      const consoleName = getConsoleNameByAbbrev(g.console);
      
      // Look for an existing ChronicleEntry
      let entry = await db.chronicleEntry.findFirst({
        where: { titleNtsc: { equals: g.name, mode: "insensitive" }, consoleName },
      });
      
      // Create if missing
      if (!entry) {
        // Build basic dates from year/month
        const releaseJp = g.region === "JP" ? (g.year ? `${g.year}${g.month ? '/' + String(g.month).padStart(2, '0') : ''}` : null) : null;
        const releaseNa = (g.regionNa === "NA" || g.region === "NA" || !g.region) ? (g.yearNa ? `${g.yearNa}${g.monthNa ? '/' + String(g.monthNa).padStart(2, '0') : ''}` : (g.year ? `${g.year}${g.month ? '/' + String(g.month).padStart(2, '0') : ''}` : null)) : null;
        
        entry = await db.chronicleEntry.create({
          data: {
            titleNtsc: g.name,
            titleJp: g.titleJp,
            consoleName,
            releaseDateNtsc: releaseNa,
            releaseDateJp: releaseJp || releaseNa,
            boxArtUrl: g.boxArtPath || g.boxArtUrl,
            boxArtUrlJp: g.boxArtPathJp,
            wikiUrl: g.wikiUrl,
            wikiUrlJp: g.wikiUrlJp,
          }
        });
        console.log(`✨ Created ChronicleEntry: ${g.name} [${consoleName}]`);
      }
      
      // Link to Fighter
      await db.fighterChronicleLink.upsert({
        where: { fighterId_chronicleEntryId: { fighterId: fighter.id, chronicleEntryId: entry.id } },
        create: { fighterId: fighter.id, chronicleEntryId: entry.id, isDebut: order === 1, displayOrder: order },
        update: { isDebut: order === 1, displayOrder: order },
      });
      order++;
    }
    console.log(`✓ Links criados para ${fighter.name}`);
  }
  
  console.log("Migration complete!");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());