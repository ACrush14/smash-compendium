/**
 * fix-failed-boxarts3.ts
 * Usa prop=images → imageinfo para encontrar capas via MediaWiki API.
 * Run: npx tsx --env-file=.env.local scripts/scrapers/fix-failed-boxarts3.ts
 */

import * as fs from "fs";
import * as path from "path";

const GAMES_DIR = path.join(process.cwd(), "public", "assets", "games");
const MAP_PATH  = path.join(process.cwd(), "scripts", "scrapers", "origin-boxart-map.json");
const sleep     = (ms: number) => new Promise((r) => setTimeout(r, ms));

const REMAINING: Array<{ name: string; wikiTitle: string; filename: string }> = [
  { name: "Donkey Kong",        wikiTitle: "Donkey_Kong_(video_game)",                 filename: "DONKEY_KONG_ARC_BOX" },
  { name: "Star Fox",           wikiTitle: "Star_Fox_(video_game)",                    filename: "STARFOX_SNES_BOX" },
  { name: "Sonic the Hedgehog", wikiTitle: "Sonic_the_Hedgehog_(video_game)",          filename: "SONIC_GEN_BOX" },
  { name: "Castlevania",        wikiTitle: "Castlevania_(video_game)",                 filename: "CASTLEVANIA_NES_BOX" },
  { name: "Ball",               wikiTitle: "Ball_(Nintendo_Game_&_Watch)",             filename: "BALL_GW_BOX" },
];

const UA = "SmashCompendiumBot/1.0 (academic fan project; contact: anderson.crush.link@gmail.com)";

// Keywords indicating a file is likely the box art / cover image
const COVER_KEYWORDS = [
  "box", "cover", "artwork", "art", "packag", "cartridge", "box_art", "boxart",
  "north_america", "na_box", "us_box", "nes_", "snes_", "n64_", "gba_", "gb_",
  "genesis", "game_boy", "arcade", "pac-man", "sonic", "donkey_kong", "star_fox",
  "castlevania", "watch"
];
const SKIP_PATTERNS = ["logo", "icon", "flag", "map", "chart", "chart", "wikidata", "commons", "portal"];

/** Get all image file names used in a Wikipedia article */
async function getPageImages(wikiTitle: string): Promise<string[]> {
  const url = `https://en.wikipedia.org/w/api.php?` +
    `action=query&prop=images&format=json&imlimit=50&titles=${encodeURIComponent(wikiTitle)}`;
  const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(15_000) });
  if (!res.ok) return [];
  const json = await res.json() as any;
  const pages = json.query?.pages;
  if (!pages) return [];
  const page = Object.values(pages)[0] as any;
  return (page?.images ?? []).map((i: any) => i.title as string);
}

/** Get direct URL for a Wiki file */
async function getFileUrl(fileTitle: string): Promise<string | null> {
  const url = `https://en.wikipedia.org/w/api.php?` +
    `action=query&prop=imageinfo&iiprop=url&format=json&titles=${encodeURIComponent(fileTitle)}`;
  const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(15_000) });
  if (!res.ok) return null;
  const json = await res.json() as any;
  const pages = json.query?.pages;
  if (!pages) return null;
  const page = Object.values(pages)[0] as any;
  return page?.imageinfo?.[0]?.url ?? null;
}

function isCoverFile(filename: string): boolean {
  const lower = filename.toLowerCase();
  if (SKIP_PATTERNS.some((p) => lower.includes(p))) return false;
  if (lower.endsWith(".svg")) return false;
  return true;   // accept any non-svg, non-icon file (we'll score them)
}

function coverScore(filename: string): number {
  const lower = filename.toLowerCase();
  let score = 0;
  for (const kw of COVER_KEYWORDS) {
    if (lower.includes(kw)) score += 10;
  }
  // Prefer box art over screenshots
  if (lower.match(/box|cover|pack|cartridge/)) score += 20;
  if (lower.match(/screen|sprite|model|gameplay/)) score -= 30;
  // Prefer jpg/png over gif
  if (lower.endsWith(".jpg") || lower.endsWith(".png")) score += 5;
  return score;
}

async function downloadImage(url: string, dest: string): Promise<boolean> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(25_000) });
    if (!res.ok) return false;
    const buf = await res.arrayBuffer();
    fs.writeFileSync(dest, Buffer.from(buf));
    return true;
  } catch { return false; }
}

async function main() {
  console.log("Round 3: using MediaWiki prop=images + imageinfo...\n");

  const existingMap: Record<string, string> = JSON.parse(
    fs.existsSync(MAP_PATH) ? fs.readFileSync(MAP_PATH, "utf8") : "{}"
  );

  let fixed = 0;

  for (const game of REMAINING) {
    process.stdout.write(`  ${game.name}…\n`);

    // Step 1: get list of all files on the page
    const allFiles = await getPageImages(game.wikiTitle);
    console.log(`    Found ${allFiles.length} files on page`);
    await sleep(500);

    // Step 2: filter and score candidates
    const candidates = allFiles
      .filter(isCoverFile)
      .map((f) => ({ title: f, score: coverScore(f) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    console.log(`    Top candidates: ${candidates.map(c => `${c.title.split(":")[1]} (${c.score})`).join(", ")}`);

    let saved = false;
    for (const candidate of candidates) {
      const imgUrl = await getFileUrl(candidate.title);
      await sleep(400);
      if (!imgUrl) continue;

      const extMatch = imgUrl.match(/\.(jpg|jpeg|png|gif|webp)/i);
      const ext = extMatch ? extMatch[1]!.toLowerCase() : "jpg";
      const filename  = `${game.filename}.${ext}`;
      const dest      = path.join(GAMES_DIR, filename);
      const assetPath = `/assets/games/${filename}`;

      const ok = await downloadImage(imgUrl, dest);
      if (ok) {
        const size = fs.statSync(dest).size;
        console.log(`    ✅ ${filename} (${(size/1024).toFixed(0)}KB) from ${candidate.title.split(":")[1]}`);
        existingMap[game.name] = assetPath;
        fixed++;
        saved = true;
        break;
      }
    }

    if (!saved) {
      console.log(`    ❌ could not download any candidate`);
    }

    await sleep(1500);
  }

  fs.writeFileSync(MAP_PATH, JSON.stringify(existingMap, null, 2));
  console.log(`\n✅ Done. Fixed ${fixed}/${REMAINING.length}.`);
}

main().catch(console.error);
