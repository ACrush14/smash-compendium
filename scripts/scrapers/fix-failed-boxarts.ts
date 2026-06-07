/**
 * fix-failed-boxarts.ts
 * Corrige os origin games que falharam em fetch-all-boxarts.ts
 * Usa a Wikipedia REST API (page summary thumbnail) como fallback.
 *
 * Run: npx tsx --env-file=.env.local scripts/scrapers/fix-failed-boxarts.ts
 */

import * as fs from "fs";
import * as path from "path";

const GAMES_DIR = path.join(process.cwd(), "public", "assets", "games");
const MAP_PATH  = path.join(process.cwd(), "scripts", "scrapers", "origin-boxart-map.json");

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Wikipedia page title → {gameName, filename}
const FAILED_GAMES: Array<{ name: string; wikiTitle: string; filename: string }> = [
  { name: "Donkey Kong",        wikiTitle: "Donkey_Kong_(video_game)",                 filename: "DONKEY_KONG_ARC_BOX" },
  { name: "Kirby's Dream Land", wikiTitle: "Kirby's_Dream_Land",                       filename: "KIRBY_DREAMLAND_GB_BOX" },
  { name: "Star Fox",           wikiTitle: "Star_Fox_(video_game)",                    filename: "STARFOX_SNES_BOX" },
  { name: "F-Zero Climax",      wikiTitle: "F-Zero_Climax",                            filename: "FZERO_CLIMAX_GBA_BOX" },
  { name: "Kid Icarus",         wikiTitle: "Kid_Icarus",                               filename: "KID_ICARUS_NES_BOX" },
  { name: "Yoshi's Island",     wikiTitle: "Super_Mario_World_2:_Yoshi's_Island",      filename: "YOSHIS_ISLAND_SNES_BOX" },
  { name: "Sonic the Hedgehog", wikiTitle: "Sonic_the_Hedgehog_(video_game)",          filename: "SONIC_GEN_BOX" },
  { name: "Castlevania",        wikiTitle: "Castlevania_(video_game)",                 filename: "CASTLEVANIA_NES_BOX" },
  { name: "Ball",               wikiTitle: "Ball_(Nintendo_Game_&_Watch)",             filename: "BALL_GW_BOX" },
];

async function getWikiThumbnail(wikiTitle: string): Promise<string | null> {
  try {
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`;
    const res = await fetch(apiUrl, {
      headers: { "User-Agent": "SmashCompendiumBot/1.0 (academic fan project)" },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return null;
    const json = await res.json() as any;
    // originalimage is higher quality than thumbnail
    return json.originalimage?.source ?? json.thumbnail?.source ?? null;
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
  console.log("Fixing failed origin game box arts via Wikipedia REST API...\n");

  const existingMap: Record<string, string> = JSON.parse(
    fs.existsSync(MAP_PATH) ? fs.readFileSync(MAP_PATH, "utf8") : "{}"
  );

  let fixed = 0;

  for (const game of FAILED_GAMES) {
    process.stdout.write(`  ${game.name}… `);

    const imgUrl = await getWikiThumbnail(game.wikiTitle);
    if (!imgUrl) {
      console.log("❌ no thumbnail from API");
      await sleep(1500);
      continue;
    }

    // Determine extension
    const extMatch = imgUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)/i);
    const ext = extMatch ? extMatch[1]!.toLowerCase() : "jpg";
    const filename = `${game.filename}.${ext}`;
    const dest     = path.join(GAMES_DIR, filename);
    const assetPath = `/assets/games/${filename}`;

    if (fs.existsSync(dest)) {
      console.log(`⏭  already exists (${filename})`);
      existingMap[game.name] = assetPath;
      fixed++;
      await sleep(500);
      continue;
    }

    const ok = await downloadImage(imgUrl, dest);
    if (ok) {
      console.log(`✅ ${filename} (${ext.toUpperCase()})`);
      existingMap[game.name] = assetPath;
      fixed++;
    } else {
      // Try with smaller thumbnail URL (original might be too large / geo-blocked)
      const thumbUrl = imgUrl.replace(/\/\d+px-/, "/500px-");
      const ok2 = imgUrl !== thumbUrl ? await downloadImage(thumbUrl, dest) : false;
      if (ok2) {
        console.log(`✅ ${filename} (thumb fallback)`);
        existingMap[game.name] = assetPath;
        fixed++;
      } else {
        console.log(`❌ download failed — ${imgUrl.split("/").pop()}`);
      }
    }

    await sleep(1500 + Math.random() * 500);
  }

  fs.writeFileSync(MAP_PATH, JSON.stringify(existingMap, null, 2));
  console.log(`\n✅ Done. Fixed ${fixed}/${FAILED_GAMES.length} games.`);
  console.log(`📄 Updated: scripts/scrapers/origin-boxart-map.json`);
}

main().catch(console.error);
