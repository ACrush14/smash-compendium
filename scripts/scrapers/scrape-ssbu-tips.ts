/**
 * scrape-ssbu-tips.ts
 * Scrapes all SSBU fighter tips from:
 *   https://www.ssbwiki.com/List_of_tips_(SSBU)/Fighters
 *
 * Each fighter section is an H2. Each tip is a list item with pattern:
 *   (★☆☆) TitleText – Description text
 *
 * Stores results in FighterTip (upsert by fighterId + titleEn).
 * Run: npx tsx --env-file=.env.local scripts/scrapers/scrape-ssbu-tips.ts
 */

import * as cheerio from "cheerio";
import { PrismaClient } from "@prisma/client";

const db  = new PrismaClient();
const URL = "https://www.ssbwiki.com/List_of_tips_(SSBU)/Fighters";

// Delay polite
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Name normalizations: ssbwiki section heading → DB fighter name ────────────
const NAME_MAP: Record<string, string> = {
  "Donkey Kong":       "Donkey Kong",
  "Zero Suit Samus":   "Zero Suit Samus",
  "Ice Climbers":      "Ice Climbers",
  "King Dedede":       "King Dedede",
  "Meta Knight":       "Meta Knight",
  "Toon Link":         "Toon Link",
  "Rosalina & Luma":   "Rosalina & Luma",
  "Mega Man":          "Mega Man",
  "Wii Fit Trainer":   "Wii Fit Trainer",
  "Little Mac":        "Little Mac",
  "Mii Brawler":       "Mii Brawler",
  "Mii Swordfighter":  "Mii Swordfighter",
  "Mii Gunner":        "Mii Gunner",
  "Pac-Man":           "Pac-Man",
  "PAC-MAN":           "Pac-Man",
  "Robin":             "Robin",
  "Duck Hunt":         "Duck Hunt",
  "Ryu":               "Ryu",
  "Cloud":             "Cloud",
  "Corrin":            "Corrin",
  "Bayonetta":         "Bayonetta",
  "Inkling":           "Inkling",
  "Ridley":            "Ridley",
  "King K. Rool":      "King K. Rool",
  "Isabelle":          "Isabelle",
  "Incineroar":        "Incineroar",
  "Piranha Plant":     "Piranha Plant",
  "Joker":             "Joker",
  "Hero":              "Hero",
  "Banjo & Kazooie":   "Banjo & Kazooie",
  "Terry":             "Terry",
  "Byleth":            "Byleth",
  "Min Min":           "Min Min",
  "Steve":             "Steve",
  "Sephiroth":         "Sephiroth",
  "Pyra/Mythra":       "Pyra/Mythra",
  "Kazuya":            "Kazuya",
  "Sora":              "Sora",
};

// Sections that map to multiple DB fighters
const MULTI_MAP: Record<string, string[]> = {
  "Pyra/Mythra": ["Pyra", "Mythra"],
};

function normalizeName(raw: string): string {
  const cleaned = raw.replace(/\[edit.*\].*$/, "").trim();
  return NAME_MAP[cleaned] ?? cleaned;
}
function resolveNames(raw: string): string[] {
  const cleaned = raw.replace(/\[edit.*\].*$/, "").trim();
  if (MULTI_MAP[cleaned]) return MULTI_MAP[cleaned];
  return [normalizeName(raw)];
}

// ── Parse one tip line: "(★★☆) Title – Description" ───────────────────────────
function parseTipLine(raw: string): { stars: string; title: string; text: string } | null {
  // Extract stars prefix: (★☆☆) or (★★★) etc.
  const starsMatch = raw.match(/^\(([★☆]+)\)\s*/);
  const stars = starsMatch ? (starsMatch[1] ?? "") : "";
  const rest   = starsMatch ? raw.slice(starsMatch[0].length) : raw;

  // Split on em-dash (– or —) to separate title from description
  const dashIdx = rest.search(/\s[–—]\s/);
  if (dashIdx === -1) return null;

  const title = rest.slice(0, dashIdx).trim().replace(/\*\*/g, "");
  const text  = rest.slice(dashIdx).replace(/^\s*[–—]\s*/, "").trim();

  if (!title || !text) return null;
  return { stars, title, text };
}

async function main() {
  console.log("Fetching tips page…");
  const res = await fetch(URL, {
    headers: { "User-Agent": "SmashCompendiumBot/1.0 (academic research)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const $    = cheerio.load(html);

  // Load all fighters from DB for name lookup
  const dbFighters = await db.fighter.findMany({ select: { id: true, name: true } });
  const fighterMap = new Map(dbFighters.map((f) => [f.name.toLowerCase(), f]));

  let totalSaved = 0;
  let totalSkipped = 0;

  // ── Walk H2 sections (each fighter) ─────────────────────────────────────────
  $(".mw-parser-output h2").each((_, h2el) => {
    const rawName = $(h2el).text();
    const names   = resolveNames(rawName);

    // Collect tips: look for <li> items under this h2 until next h2
    const tips: { stars: string; title: string; text: string }[] = [];
    let node = $(h2el).next();
    while (node.length) {
      const tag = (node[0] as any)?.name;
      if (tag === "h2") break;
      if (tag === "ul" || tag === "ol") {
        node.find("li").each((_, li) => {
          const parsed = parseTipLine($(li).text().trim());
          if (parsed) tips.push(parsed);
        });
      }
      node = node.next();
    }

    for (const name of names) {
      const fighter = fighterMap.get(name.toLowerCase());
      if (!fighter) {
        if (!["Contents", "References", "Notes", "Trivia"].includes(name)) {
          console.warn(`  ⚠ No DB match for section: "${name}"`);
        }
        continue;
      }
      if (tips.length === 0) {
        console.warn(`  ⚠ No tips parsed for: "${name}"`);
        continue;
      }
      console.log(`  ✓ ${name}: ${tips.length} tips`);
      (fighter as any)._tips = tips;
    }
  });

  // ── Write to DB ──────────────────────────────────────────────────────────────
  console.log("\nWriting to DB…");
  for (const fighter of dbFighters) {
    const tips = (fighter as any)._tips as Array<{ stars: string; title: string; text: string }> | undefined;
    if (!tips) continue;

    // Delete existing tips for this fighter first (clean re-import)
    await db.fighterTip.deleteMany({ where: { fighterId: fighter.id } });

    // Insert all tips
    for (const tip of tips) {
      await db.fighterTip.create({
        data: {
          fighterId: fighter.id,
          titleEn:   `${tip.stars ? `[${tip.stars}] ` : ""}${tip.title}`,
          textEn:    tip.text,
        },
      });
    }
    totalSaved += tips.length;
    await sleep(20);
  }

  console.log(`\n✅ Done. ${totalSaved} tips saved. ${totalSkipped} skipped.`);
}

main().catch(console.error).finally(() => db.$disconnect());
