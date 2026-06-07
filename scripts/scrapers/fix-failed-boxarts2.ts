/**
 * fix-failed-boxarts2.ts
 * Segunda tentativa com MediaWiki Action API (prop=pageimages) para os 5 restantes.
 * Run: npx tsx --env-file=.env.local scripts/scrapers/fix-failed-boxarts2.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";

const GAMES_DIR = path.join(process.cwd(), "public", "assets", "games");
const MAP_PATH  = path.join(process.cwd(), "scripts", "scrapers", "origin-boxart-map.json");

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const REMAINING: Array<{ name: string; wikiTitle: string; filename: string }> = [
  { name: "Donkey Kong",        wikiTitle: "Donkey_Kong_(video_game)",                 filename: "DONKEY_KONG_ARC_BOX" },
  { name: "Star Fox",           wikiTitle: "Star_Fox_(video_game)",                    filename: "STARFOX_SNES_BOX" },
  { name: "Sonic the Hedgehog", wikiTitle: "Sonic_the_Hedgehog_(video_game)",          filename: "SONIC_GEN_BOX" },
  { name: "Castlevania",        wikiTitle: "Castlevania_(video_game)",                 filename: "CASTLEVANIA_NES_BOX" },
  { name: "Ball",               wikiTitle: "Ball_(Nintendo_Game_&_Watch)",             filename: "BALL_GW_BOX" },
];

async function getViaActionAPI(wikiTitle: string): Promise<string | null> {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&pithumbsize=600&titles=${encodeURIComponent(wikiTitle)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "SmashCompendiumBot/1.0 (academic fan project)" },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return null;
    const json = await res.json() as any;
    const pages = json.query?.pages;
    if (!pages) return null;
    const page = Object.values(pages)[0] as any;
    return page?.original?.source ?? page?.thumbnail?.source ?? null;
  } catch {
    return null;
  }
}

async function getViaPageScrape(wikiTitle: string): Promise<string | null> {
  // More aggressive HTML scraping - look at ALL img tags with upload.wikimedia.org
  try {
    const url = `https://en.wikipedia.org/wiki/${wikiTitle}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SmashCompendiumBot/1.0; academic fan project)",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const $    = cheerio.load(html);

    let found: string | null = null;
    // Look through ALL img tags
    $("img").each((_, el) => {
      if (found) return;
      const src     = $(el).attr("src") ?? "";
      const dataSrc = $(el).attr("data-src") ?? "";
      const raw = dataSrc || src;
      if (raw.includes("upload.wikimedia.org")) {
        let imgUrl = raw.startsWith("//") ? `https:${raw}` : raw;
        // Convert thumb to full
        if (imgUrl.includes("/thumb/")) {
          imgUrl = imgUrl.replace("/thumb/", "/").replace(/\/\d+px-[^/]+$/, "");
        }
        // Skip known non-box-art patterns
        if (imgUrl.match(/\/(Wikipe|Question|Edit|Lock|Icon|Arrow|Flag|Portal|Book|Commons|Wikidata)/i)) return;
        if (imgUrl.match(/\.svg$/i)) return;
        found = imgUrl;
      }
    });

    return found;
  } catch {
    return null;
  }
}

async function downloadImage(url: string, dest: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "SmashCompendiumBot/1.0 (academic fan project)" },
      signal: AbortSignal.timeout(25_000),
    });
    if (!res.ok) return false;
    const buf = await res.arrayBuffer();
    fs.writeFileSync(dest, Buffer.from(buf));
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log("Round 2: fixing remaining 5 games...\n");

  const existingMap: Record<string, string> = JSON.parse(
    fs.existsSync(MAP_PATH) ? fs.readFileSync(MAP_PATH, "utf8") : "{}"
  );

  let fixed = 0;

  for (const game of REMAINING) {
    process.stdout.write(`  ${game.name}… `);

    // Try MediaWiki Action API first
    let imgUrl = await getViaActionAPI(game.wikiTitle);

    if (!imgUrl) {
      // Fall back to aggressive HTML scrape
      process.stdout.write("[html] ");
      imgUrl = await getViaPageScrape(game.wikiTitle);
    }

    if (!imgUrl) {
      console.log("❌ still no image found");
      await sleep(1500);
      continue;
    }

    const extMatch = imgUrl.match(/\.(jpg|jpeg|png|gif|webp)/i);
    const ext = extMatch ? extMatch[1]!.toLowerCase() : "jpg";
    const filename = `${game.filename}.${ext}`;
    const dest     = path.join(GAMES_DIR, filename);
    const assetPath = `/assets/games/${filename}`;

    const ok = await downloadImage(imgUrl, dest);
    if (ok) {
      const size = fs.statSync(dest).size;
      console.log(`✅ ${filename} (${(size/1024).toFixed(0)}KB)`);
      existingMap[game.name] = assetPath;
      fixed++;
    } else {
      console.log(`❌ download failed — ${imgUrl.split("/").pop()?.substring(0, 50)}`);
    }

    await sleep(1800 + Math.random() * 500);
  }

  fs.writeFileSync(MAP_PATH, JSON.stringify(existingMap, null, 2));
  console.log(`\n✅ Done. Fixed ${fixed}/${REMAINING.length}.`);
  console.log(`📄 Updated: scripts/scrapers/origin-boxart-map.json`);
}

main().catch(console.error);
