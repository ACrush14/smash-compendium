/**
 * fetch-all-boxarts.ts
 *
 * Pega capas de jogos de duas fontes:
 *   1. ChronicleEntry (947 jogos) — busca na Wikipedia/MarioWiki via wikiUrl do banco
 *   2. Origin games do page.tsx   — tabela curada com URLs Wikipedia
 *
 * Salva as imagens em public/assets/games/<safe-filename>.jpg
 * Atualiza ChronicleEntry.boxArtUrl no banco com URL externa (não baixa, só salva a URL)
 * Gera um arquivo JSON de mapeamento para os origin games (para colar no page.tsx)
 *
 * Run: npx tsx --env-file=.env.local scripts/scrapers/fetch-all-boxarts.ts
 */

import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "@prisma/client";

const db    = new PrismaClient();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const GAMES_DIR = path.join(process.cwd(), "public", "assets", "games");
if (!fs.existsSync(GAMES_DIR)) fs.mkdirSync(GAMES_DIR, { recursive: true });

// ── Curated Wikipedia URLs for all origin games in FRANCHISE_ORIGIN_GAMES ─────
interface OriginGameMeta {
  franchise:  string;
  name:       string;
  wikiUrl:    string;
  filename:   string;     // save as public/assets/games/{filename}
}

const ORIGIN_GAME_WIKI: OriginGameMeta[] = [
  // Mario / Donkey Kong
  { franchise: "Mario",        name: "Donkey Kong",          wikiUrl: "https://en.wikipedia.org/wiki/Donkey_Kong_(video_game)",                       filename: "DONKEY_KONG_ARC_BOX.jpg" },
  { franchise: "Mario",        name: "Super Mario Bros.",    wikiUrl: "https://en.wikipedia.org/wiki/Super_Mario_Bros.",                               filename: "SUPER_MARIO_BROS_NES_BOX.jpg" },
  { franchise: "Donkey Kong",  name: "Donkey Kong Country",  wikiUrl: "https://en.wikipedia.org/wiki/Donkey_Kong_Country",                             filename: "DKC_SNES_BOX.jpg" },
  // Zelda
  { franchise: "The Legend of Zelda", name: "The Legend of Zelda", wikiUrl: "https://en.wikipedia.org/wiki/The_Legend_of_Zelda_(video_game)",          filename: "ZELDA_NES_BOX.jpg" },
  // Metroid
  { franchise: "Metroid",      name: "Metroid",              wikiUrl: "https://en.wikipedia.org/wiki/Metroid_(video_game)",                            filename: "METROID_NES_BOX.jpg" },
  // Kirby
  { franchise: "Kirby",        name: "Kirby's Dream Land",   wikiUrl: "https://en.wikipedia.org/wiki/Kirby%27s_Dream_Land",                           filename: "KIRBY_DREAMLAND_GB_BOX.jpg" },
  // Star Fox
  { franchise: "Star Fox",     name: "Star Fox",             wikiUrl: "https://en.wikipedia.org/wiki/Star_Fox_(video_game)",                           filename: "STARFOX_SNES_BOX.jpg" },
  // Pokémon
  { franchise: "Pokémon",      name: "Pokémon Red / Blue",   wikiUrl: "https://en.wikipedia.org/wiki/Pok%C3%A9mon_Red_and_Blue",                      filename: "POKEMON_RED_BLUE_GB_BOX.jpg" },
  { franchise: "Pokémon",      name: "Pocket Monsters R/G",  wikiUrl: "https://en.wikipedia.org/wiki/Pok%C3%A9mon_Red_and_Blue",                      filename: "POKEMON_RED_BLUE_GB_BOX.jpg" },
  // F-Zero
  { franchise: "F-Zero",       name: "F-Zero",               wikiUrl: "https://en.wikipedia.org/wiki/F-Zero_(video_game)",                            filename: "FZERO_SNES_BOX.jpg" },
  { franchise: "F-Zero",       name: "F-Zero X",             wikiUrl: "https://en.wikipedia.org/wiki/F-Zero_X",                                       filename: "FZERO_X_N64_BOX.jpg" },
  { franchise: "F-Zero",       name: "F-Zero GX",            wikiUrl: "https://en.wikipedia.org/wiki/F-Zero_GX",                                      filename: "FZERO_GX_GCN_BOX.jpg" },
  { franchise: "F-Zero",       name: "F-Zero GP Legend",     wikiUrl: "https://en.wikipedia.org/wiki/F-Zero_GP_Legend_(video_game)",                  filename: "FZERO_GPLEGEND_GBA_BOX.jpg" },
  { franchise: "F-Zero",       name: "F-Zero Climax",        wikiUrl: "https://en.wikipedia.org/wiki/F-Zero_Climax",                                  filename: "FZERO_CLIMAX_GBA_BOX.jpg" },
  // Fire Emblem
  { franchise: "Fire Emblem",  name: "Fire Emblem",          wikiUrl: "https://en.wikipedia.org/wiki/Fire_Emblem:_Shadow_Dragon_and_the_Blade_of_Light", filename: "FIRE_EMBLEM_NES_BOX.jpg" },
  // Pikmin
  { franchise: "Pikmin",       name: "Pikmin",               wikiUrl: "https://en.wikipedia.org/wiki/Pikmin_(video_game)",                            filename: "PIKMIN_GCN_BOX.jpg" },
  // Animal Crossing
  { franchise: "Animal Crossing", name: "Animal Forest",     wikiUrl: "https://en.wikipedia.org/wiki/Animal_Crossing_(video_game)",                   filename: "ANIMAL_CROSSING_N64_BOX.jpg" },
  // Kid Icarus
  { franchise: "Kid Icarus",   name: "Kid Icarus",           wikiUrl: "https://en.wikipedia.org/wiki/Kid_Icarus",                                     filename: "KID_ICARUS_NES_BOX.jpg" },
  // Ice Climber
  { franchise: "Ice Climber",  name: "Ice Climber",          wikiUrl: "https://en.wikipedia.org/wiki/Ice_Climber",                                    filename: "ICE_CLIMBER_NES_BOX.jpg" },
  // Wario
  { franchise: "Wario",        name: "Wario Land",           wikiUrl: "https://en.wikipedia.org/wiki/Wario_Land:_Super_Mario_Land_3",                 filename: "WARIO_LAND_GB_BOX.jpg" },
  // Yoshi
  { franchise: "Yoshi",        name: "Yoshi's Island",       wikiUrl: "https://en.wikipedia.org/wiki/Super_Mario_World_2:_Yoshi%27s_Island",          filename: "YOSHIS_ISLAND_SNES_BOX.jpg" },
  // Xenoblade
  { franchise: "Xenoblade",    name: "Xenoblade Chronicles", wikiUrl: "https://en.wikipedia.org/wiki/Xenoblade_Chronicles",                           filename: "XENOBLADE_WII_BOX.jpg" },
  // Punch-Out
  { franchise: "Punch-Out!!",  name: "Punch-Out!!",          wikiUrl: "https://en.wikipedia.org/wiki/Punch-Out!!_(NES)",                              filename: "PUNCHOUT_NES_BOX.jpg" },
  // Duck Hunt
  { franchise: "Duck Hunt",    name: "Duck Hunt",            wikiUrl: "https://en.wikipedia.org/wiki/Duck_Hunt",                                      filename: "DUCK_HUNT_NES_BOX.jpg" },
  // Sonic
  { franchise: "Sonic",        name: "Sonic the Hedgehog",   wikiUrl: "https://en.wikipedia.org/wiki/Sonic_the_Hedgehog_(video_game)",                filename: "SONIC_GEN_BOX.jpg" },
  // Mega Man
  { franchise: "Mega Man",     name: "Mega Man",             wikiUrl: "https://en.wikipedia.org/wiki/Mega_Man_(video_game)",                          filename: "MEGA_MAN_NES_BOX.jpg" },
  // Pac-Man
  { franchise: "Pac-Man",      name: "Pac-Man",              wikiUrl: "https://en.wikipedia.org/wiki/Pac-Man",                                        filename: "PAC_MAN_ARC_BOX.jpg" },
  // Street Fighter
  { franchise: "Street Fighter", name: "Street Fighter II",  wikiUrl: "https://en.wikipedia.org/wiki/Street_Fighter_II",                             filename: "SF2_ARC_BOX.jpg" },
  // Castlevania
  { franchise: "Castlevania",  name: "Castlevania",          wikiUrl: "https://en.wikipedia.org/wiki/Castlevania_(video_game)",                       filename: "CASTLEVANIA_NES_BOX.jpg" },
  // Persona
  { franchise: "Persona",      name: "Persona 5",            wikiUrl: "https://en.wikipedia.org/wiki/Persona_5",                                     filename: "PERSONA5_PS4_BOX.jpg" },
  // Dragon Quest
  { franchise: "Dragon Quest", name: "Dragon Quest",         wikiUrl: "https://en.wikipedia.org/wiki/Dragon_Quest_(video_game)",                     filename: "DRAGON_QUEST_NES_BOX.jpg" },
  // Banjo-Kazooie
  { franchise: "Banjo-Kazooie", name: "Banjo-Kazooie",       wikiUrl: "https://en.wikipedia.org/wiki/Banjo-Kazooie",                                 filename: "BANJO_KAZOOIE_N64_BOX.jpg" },
  // ARMS
  { franchise: "ARMS",         name: "ARMS",                 wikiUrl: "https://en.wikipedia.org/wiki/ARMS_(video_game)",                             filename: "ARMS_NSW_BOX.jpg" },
  // Bayonetta
  { franchise: "Bayonetta",    name: "Bayonetta",            wikiUrl: "https://en.wikipedia.org/wiki/Bayonetta_(video_game)",                        filename: "BAYONETTA_PS3_BOX.jpg" },
  // Game & Watch
  { franchise: "Game & Watch", name: "Ball",                  wikiUrl: "https://en.wikipedia.org/wiki/Ball_(Nintendo_Game_%26_Watch)",                filename: "BALL_GW_BOX.jpg" },
  // EarthBound / Mother — already have local files, skip download but register
  { franchise: "EarthBound",   name: "EarthBound",           wikiUrl: "https://en.wikipedia.org/wiki/EarthBound",                                    filename: "EARTHBOUND_USA_BOX.jpg" },
  { franchise: "EarthBound",   name: "Mother 3",             wikiUrl: "https://en.wikipedia.org/wiki/Mother_3",                                      filename: "MOTHER3_JP_BOX.jpg" },
];

// ── Extract box art URL from a Wikipedia/MediaWiki page ───────────────────────
async function extractBoxArtUrl(pageUrl: string): Promise<string | null> {
  try {
    const res = await fetch(pageUrl, {
      headers: {
        "User-Agent": "SmashCompendiumBot/1.0 (academic fan project; contact: anderson.crush.link@gmail.com)",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const $    = cheerio.load(html);

    // Wikipedia: .infobox-image img, .infobox img, .thumb img
    // MarioWiki: similar structure
    let imgUrl: string | null = null;

    const selectors = [
      ".infobox-image img",
      "table.infobox img",
      ".infobox img",
      ".thumb img",
    ];

    // Iterate ALL imgs in each selector to skip badges/icons
    for (const sel of selectors) {
      if (imgUrl) break;
      $(sel).each((_, el) => {
        if (imgUrl) return;
        const raw = $(el).attr("data-src") ?? $(el).attr("src") ?? "";
        if (!raw) return;
        let resolved = raw.startsWith("//") ? `https:${raw}` : raw;
        if (resolved.includes("upload.wikimedia.org") || resolved.includes("wiki.gallery")) {
          if (resolved.match(/cc-by|cc-0|creative.commons|copyright|license|poweredby/i)) return;
          if (resolved.match(/\.svg(?:\.png)?/i)) return;
          if (resolved.match(/Cscr-|featured|disambig|question_mark|OOjs_UI|search/i)) return;
          imgUrl = resolved;
        }
      });
    }

    if (!imgUrl) return null;

    // Convert thumbnail to full resolution
    // https://upload.wikimedia.org/wikipedia/en/thumb/X/XX/file.jpg/200px-file.jpg
    // → https://upload.wikimedia.org/wikipedia/en/X/XX/file.jpg
    if (imgUrl.includes("/thumb/")) {
      imgUrl = imgUrl.replace("/thumb/", "/").replace(/\/\d+px-[^/]+$/, "");
    }

    return imgUrl;
  } catch (err) {
    return null;
  }
}

// ── Download image to local file ─────────────────────────────────────────────
async function downloadImage(url: string, dest: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "SmashCompendiumBot/1.0 (academic fan project)" },
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) return false;
    const buf = await res.arrayBuffer();
    fs.writeFileSync(dest, Buffer.from(buf));
    return true;
  } catch {
    return false;
  }
}

// Safe filename for file system
function safeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_.-]/g, "_").replace(/_+/g, "_");
}

// ── Part 1: Origin Games ──────────────────────────────────────────────────────
async function fetchOriginGames() {
  console.log("\n═══ ORIGIN GAMES ═══");
  console.log(`Processing ${ORIGIN_GAME_WIKI.length} origin games...\n`);

  const results: Record<string, string> = {};  // name → /assets/games/{filename}
  let saved = 0, skipped = 0, failed = 0;

  for (const game of ORIGIN_GAME_WIKI) {
    const destPath = path.join(GAMES_DIR, game.filename);
    const assetPath = `/assets/games/${game.filename}`;

    // Skip if already downloaded
    if (fs.existsSync(destPath)) {
      console.log(`  ⏭  ${game.name} — already exists`);
      results[game.name] = assetPath;
      skipped++;
      await sleep(100);
      continue;
    }

    process.stdout.write(`  ${game.franchise} → ${game.name}… `);
    const imgUrl = await extractBoxArtUrl(game.wikiUrl);

    if (!imgUrl) {
      console.log("❌ no image found");
      failed++;
      await sleep(1500);
      continue;
    }

    // Determine actual extension from URL
    const extMatch = imgUrl.match(/\.(jpg|jpeg|png|gif|webp)/i);
    const ext = extMatch ? extMatch[1]!.toLowerCase() : "jpg";
    const actualFilename = game.filename.replace(/\.\w+$/, `.${ext}`);
    const actualDest = path.join(GAMES_DIR, actualFilename);
    const actualAssetPath = `/assets/games/${actualFilename}`;

    const ok = await downloadImage(imgUrl, actualDest);
    if (ok) {
      console.log(`✅ ${actualFilename} (${ext.toUpperCase()})`);
      results[game.name] = actualAssetPath;
      saved++;
    } else {
      console.log(`❌ download failed`);
      failed++;
    }

    await sleep(1500 + Math.random() * 500);
  }

  console.log(`\nOrigin games: saved=${saved}, skipped=${skipped}, failed=${failed}`);

  // Write mapping JSON for updating page.tsx
  const mapPath = path.join(process.cwd(), "scripts", "scrapers", "origin-boxart-map.json");
  fs.writeFileSync(mapPath, JSON.stringify(results, null, 2));
  console.log(`📄 Mapeamento salvo em: scripts/scrapers/origin-boxart-map.json`);
  console.log("👉 Use esse JSON para adicionar boxArtPath em FRANCHISE_ORIGIN_GAMES no page.tsx\n");

  return results;
}

// ── Part 2: Chronicles ────────────────────────────────────────────────────────
async function fetchChroniclesBoxArts() {
  console.log("\n═══ CHRONICLES ═══");

  const entries = await db.chronicleEntry.findMany({
    where: {
      boxArtUrl: null,
      wikiUrl:   { not: null },
    },
    orderBy: { consoleName: "asc" },
  });

  console.log(`Processing ${entries.length} ChronicleEntry without box art...\n`);

  let saved = 0, failed = 0;
  let batch = 0;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]!;
    process.stdout.write(`  [${i+1}/${entries.length}] ${entry.consoleName} — ${entry.titleNtsc}… `);

    const wikiUrl = entry.wikiUrl!;

    // Handle different URL formats
    // If it's a relative path (e.g. "/wiki/..."), prepend ssbwiki
    // If it's a full URL (wikipedia, mariowiki), use directly
    const fullUrl = wikiUrl.startsWith("http") ? wikiUrl : `https://www.ssbwiki.com${wikiUrl}`;

    const imgUrl = await extractBoxArtUrl(fullUrl);

    if (imgUrl) {
      await db.chronicleEntry.update({
        where: { id: entry.id },
        data:  { boxArtUrl: imgUrl },
      });
      console.log(`✅ ${imgUrl.split("/").pop()?.substring(0, 40)}`);
      saved++;
    } else {
      console.log("❌");
      failed++;
    }

    batch++;
    // Polite delay — bigger pause every 20 requests
    await sleep(batch % 20 === 0 ? 3000 : 1200 + Math.random() * 400);
  }

  console.log(`\nChronicles: saved=${saved}, failed=${failed}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const arg = process.argv[2] ?? "all"; // "origins" | "chronicles" | "all"

  if (arg === "origins" || arg === "all") {
    await fetchOriginGames();
  }
  if (arg === "chronicles" || arg === "all") {
    await fetchChroniclesBoxArts();
  }

  console.log("\n✅ Done.");
}

main().catch(console.error).finally(() => db.$disconnect());
