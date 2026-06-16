import { db } from "../../lib/db";

// Skip these sourceGame values entirely
const SKIP_PATTERNS = [
  /^SMASH$/i,
  /^Game & Watch/i,
  /^Disk System/i,
  /^Super Scope/i,
  /^Super Smash Bros\. Melee/i,
];

// PAL/EU alternate names (second lines that are just EU names, not separate games)
const PAL_ALIASES = new Set([
  "Lylatwars", "Starwing", "Kirby's Fun Pak", "Kirby's Fun Pack",
]);

// Manual alias map: parsed title → canonical chronicle title
// Used when the parsed title differs from what's in the DB
const ALIASES: Record<string, string[]> = {
  "Donkey Kong Junior":       ["Donkey Kong Jr."],
  "Pokémon Red & Blue":       ["Pokémon Red & Pokémon Blue", "Pokémon Red & Blue"],
  "Pokémon Gold & Silver":    ["Pokémon Gold & Pokémon Silver", "Pokémon Gold & Silver"],
  "Fire Emblem":              ["Fire Emblem", "Fire Emblem: Shadow Dragon and the Blade of Light"],
  "Mario and Wario":          ["Mario & Wario", "Mario and Wario"],
  "Mario Bros.":              ["Mario Bros."],
};

function parseSourceGames(raw: string | null): string[] {
  if (!raw) return [];
  if (SKIP_PATTERNS.some(p => p.test(raw))) return [];

  const results: string[] = [];
  const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);

  for (const line of lines) {
    if (/^future release$/i.test(line)) continue;

    // Remove leading version/region tags: "(1.0 NTSC/1.01 NTSC)" or "(1.02 NTSC/PAL)"
    let s = line.replace(/^\([^)]+\)\s*/, "");

    // Remove "[sic]" FIRST (before date patterns, since "[sic]" can trail after the date)
    s = s.replace(/\s*\[sic\].*$/, "").trim();

    // Remove trailing date " MM/YY" or " MM/YYYY"
    s = s.replace(/\s+\d{1,2}\/\d{2,4}$/, "").trim();

    // Remove trailing " YYYY" (Arcade year)
    s = s.replace(/\s+\d{4}$/, "").trim();

    // Remove "Japan Only" suffix
    s = s.replace(/\s+Japan Only$/i, "").trim();

    // Remove " Arcade" suffix or "Arcade" (handles "Donkey KongArcade" concatenation)
    s = s.replace(/\s*Arcade\s*$/, "").trim();

    if (PAL_ALIASES.has(s)) continue;
    if (s.length > 1) results.push(s);
  }

  return [...new Set(results)];
}

function normalizeTitle(t: string): string {
  return t
    .toLowerCase()
    .replace(/[''`]/g, "'")
    .replace(/[éè]/g, "e")
    .replace(/[^a-z0-9\s&']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  const allEntries = await db.chronicleEntry.findMany({
    select: { id: true, titleNtsc: true, consoleName: true },
    orderBy: { releaseDateNtsc: "asc" },
  });

  // Maps for lookup
  const byExact = new Map<string, typeof allEntries>();
  const byNorm  = new Map<string, typeof allEntries>();
  for (const e of allEntries) {
    const t = e.titleNtsc ?? "";
    if (!t) continue;
    if (!byExact.has(t)) byExact.set(t, []);
    byExact.get(t)!.push(e);
    const n = normalizeTitle(t);
    if (!byNorm.has(n)) byNorm.set(n, []);
    byNorm.get(n)!.push(e);
  }

  const trophies = await db.collectible.findMany({
    where: { smashGameVersion: "SSBM", type: "TROPHY", chronicleLinks: { none: {} } },
    select: { id: true, name: true, sourceGame: true },
    orderBy: { posicaoTrofeuMelee: "asc" },
  });

  console.log(`Trophies to process: ${trophies.length}\n`);

  let matched = 0, skipped = 0, unmatched = 0;
  const missedSourceGames = new Set<string>();

  for (const trophy of trophies) {
    const parsedTitles = parseSourceGames(trophy.sourceGame);

    if (parsedTitles.length === 0) {
      console.log(`SKIP  "${trophy.name}" ← ${JSON.stringify(trophy.sourceGame ?? "null")}`);
      skipped++;
      continue;
    }

    // Expand via aliases
    const titlesToSearch: string[] = [];
    for (const pt of parsedTitles) {
      const aliased = ALIASES[pt];
      if (aliased) titlesToSearch.push(...aliased);
      else titlesToSearch.push(pt);
    }

    const hits: Array<{ entry: (typeof allEntries)[0]; matchedTitle: string }> = [];
    for (const title of titlesToSearch) {
      const exact = byExact.get(title) ?? [];
      const norm  = byNorm.get(normalizeTitle(title)) ?? [];
      const found = exact.length > 0 ? exact : norm;
      for (const e of found) {
        if (!hits.find(h => h.entry.id === e.id)) {
          hits.push({ entry: e, matchedTitle: title });
        }
      }
    }

    if (hits.length === 0) {
      console.log(`MISS  "${trophy.name}" ← titles=${JSON.stringify(parsedTitles)}`);
      unmatched++;
      parsedTitles.forEach(t => missedSourceGames.add(t));
    } else {
      const desc = hits.map(h => `"${h.entry.titleNtsc}" [${h.entry.consoleName}]`).join(" | ");
      console.log(`HIT   "${trophy.name}" → ${desc}`);
      matched++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Total   : ${trophies.length}`);
  console.log(`Matched : ${matched}`);
  console.log(`Skipped : ${skipped}`);
  console.log(`Missed  : ${unmatched}`);
  if (missedSourceGames.size > 0) {
    console.log(`\nMissed titles:`);
    [...missedSourceGames].sort().forEach(t => console.log(`  "${t}"`));
  }

  await db.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
