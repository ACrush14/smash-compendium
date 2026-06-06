/**
 * scrape-spirits.ts
 * Scrapes spirit descriptions from ssbuspirits.com for every SSBU fighter.
 * URL pattern: https://www.ssbuspirits.com/spirits/{slug}
 *   slug = fighter name → lowercase, spaces/& to dashes, special chars removed
 *
 * For each fighter:
 *   - Fetches the spirit page
 *   - Extracts spirit number + description text
 *   - Upserts a Collectible { type: "SPIRIT", smashGameVersion: "SSBU" }
 *     with descriptionEn populated
 *
 * Run: npx tsx --env-file=.env.local scripts/scrapers/scrape-spirits.ts
 */

import * as cheerio from "cheerio";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Slug generation ───────────────────────────────────────────────────────────
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// Manual overrides for tricky names
const SLUG_OVERRIDES: Record<string, string> = {
  "Pikachu":             "pikachu",
  "Pokémon Trainer":     "pokemon-trainer",
  "Rosalina & Luma":     "rosalina-and-luma",
  "Banjo & Kazooie":     "banjo-and-kazooie",
  "Pyra/Mythra":         "pyra-mythra",
  "Mii Brawler":         "mii-brawler",
  "Mii Swordfighter":    "mii-swordfighter",
  "Mii Gunner":          "mii-gunner",
  "Piranha Plant":       "piranha-plant",
  "Duck Hunt":           "duck-hunt",
  "King K. Rool":        "king-k-rool",
  "Zero Suit Samus":     "zero-suit-samus",
  "Ice Climbers":        "ice-climbers",
  "Meta Knight":         "meta-knight",
  "King Dedede":         "king-dedede",
  "Toon Link":           "toon-link",
  "Wii Fit Trainer":     "wii-fit-trainer",
  "Little Mac":          "little-mac",
  "Pac-Man":             "pac-man",
  "Mega Man":            "mega-man",
  "Captain Falcon":      "captain-falcon",
  "Captain Toad":        "captain-toad",
};

function getSlug(name: string): string {
  return SLUG_OVERRIDES[name] ?? toSlug(name);
}

// ── Scrape one spirit page ────────────────────────────────────────────────────
async function scrapeSpiritPage(slug: string): Promise<{ spiritNum: string; description: string } | null> {
  const url = `https://www.ssbuspirits.com/spirits/${slug}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "SmashCompendiumBot/1.0 (academic research)" },
      signal: AbortSignal.timeout(12_000),
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    const $    = cheerio.load(html);

    // Extract spirit number
    let spiritNum = "";
    $("*").each((_, el) => {
      const text = $(el).text();
      const m = text.match(/No\.\s*(\d+)/);
      if (m && !spiritNum) spiritNum = m[1] ?? "";
    });

    // Extract description — look for the longest paragraph text on the page
    // ssbuspirits uses wix, so text can be in various containers
    let bestText = "";
    $("p, span.wixui-rich-text__text, div[data-testid='richTextElement'] p").each((_, el) => {
      const txt = $(el).text().trim();
      if (txt.length > bestText.length && txt.length > 80 && !txt.includes("No.") && !txt.includes("Spirit #")) {
        bestText = txt;
      }
    });

    // Fallback: grab all text blocks and find the longest that looks like a bio
    if (!bestText) {
      $("*").each((_, el) => {
        const children = $(el).children();
        if (children.length > 2) return; // skip container divs
        const txt = $(el).text().trim();
        if (txt.length > 80 && txt.length > bestText.length && txt[0] && /[A-Z]/.test(txt[0])) {
          bestText = txt;
        }
      });
    }

    return { spiritNum, description: bestText };
  } catch (err) {
    console.warn(`  Error fetching ${slug}: ${err}`);
    return null;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const fighters = await db.fighter.findMany({
    orderBy: [{ rosterNumber: "asc" }],
    select: { id: true, name: true, rosterNumber: true },
  });

  console.log(`Processing ${fighters.length} fighters…\n`);

  let saved = 0, failed = 0;

  for (const fighter of fighters) {
    const slug = getSlug(fighter.name);
    process.stdout.write(`[${fighter.rosterNumber}] ${fighter.name} (${slug})… `);

    const data = await scrapeSpiritPage(slug);

    if (!data || !data.description) {
      console.log("❌ no data");
      failed++;
      await sleep(800);
      continue;
    }

    // Build collectible ID
    const collectibleId = `SPIRIT-SSBU-${fighter.name}-${data.spiritNum || "0"}`;

    try {
      await db.collectible.upsert({
        where: { id: collectibleId },
        create: {
          id:               collectibleId,
          type:             "SPIRIT",
          smashGameVersion: "SSBU",
          name:             fighter.name,
          fighterId:        fighter.id,
          sourceType:       "Official",
          descriptionEn:    data.description,
        },
        update: {
          descriptionEn: data.description,
          fighterId:     fighter.id,
        },
      });

      console.log(`✅ #${data.spiritNum} — ${data.description.substring(0, 60)}…`);
      saved++;
    } catch (err) {
      console.log(`❌ DB error: ${err}`);
      failed++;
    }

    await sleep(1200 + Math.random() * 400);
  }

  console.log(`\n=== Done. Saved: ${saved} | Failed: ${failed} ===`);
}

main().catch(console.error).finally(() => db.$disconnect());
