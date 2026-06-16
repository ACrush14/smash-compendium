/**
 * Creates CollectibleChronicleLink records linking unlinked SSBM trophies
 * to their corresponding ChronicleEntries via the sourceGame field.
 *
 * Run dry-run first: link-ssbm-trophies-dry-run.ts
 */
import { db } from "../../lib/db";

const SKIP_PATTERNS = [
  /^SMASH$/i,
  /^Game & Watch/i,
  /^Disk System/i,
  /^Super Scope/i,
  /^Super Smash Bros\. Melee/i,
];

const PAL_ALIASES = new Set([
  "Lylatwars", "Starwing", "Kirby's Fun Pak", "Kirby's Fun Pack",
]);

const ALIASES: Record<string, string[]> = {
  "Donkey Kong Junior":    ["Donkey Kong Jr."],
  "Pokémon Red & Blue":    ["Pokémon Red & Pokémon Blue", "Pokémon Red & Blue"],
  "Pokémon Gold & Silver": ["Pokémon Gold & Pokémon Silver", "Pokémon Gold & Silver"],
  "Fire Emblem":           ["Fire Emblem", "Fire Emblem: Shadow Dragon and the Blade of Light"],
  "Mario and Wario":       ["Mario & Wario", "Mario and Wario"],
  "Mario Bros.":           ["Mario Bros."],
};

function parseSourceGames(raw: string | null): string[] {
  if (!raw) return [];
  if (SKIP_PATTERNS.some(p => p.test(raw))) return [];

  const results: string[] = [];
  const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);

  for (const line of lines) {
    if (/^future release$/i.test(line)) continue;

    let s = line.replace(/^\([^)]+\)\s*/, "");

    // Remove [sic] FIRST (may trail after the date)
    s = s.replace(/\s*\[sic\].*$/, "").trim();

    // Remove trailing date " MM/YY" or " MM/YYYY"
    s = s.replace(/\s+\d{1,2}\/\d{2,4}$/, "").trim();

    // Remove trailing " YYYY" (Arcade year)
    s = s.replace(/\s+\d{4}$/, "").trim();

    // Remove "Japan Only" suffix
    s = s.replace(/\s+Japan Only$/i, "").trim();

    // Remove " Arcade" or "Arcade" (handles "Donkey KongArcade" concatenation)
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
  const DRY_RUN = process.argv.includes("--dry-run");
  if (DRY_RUN) console.log("[DRY RUN] No changes will be made.\n");

  // Fetch all ChronicleEntries
  const allEntries = await db.chronicleEntry.findMany({
    select: { id: true, titleNtsc: true, consoleName: true },
  });

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

  // Only unlinked SSBM trophies
  const trophies = await db.collectible.findMany({
    where: { smashGameVersion: "SSBM", type: "TROPHY", chronicleLinks: { none: {} } },
    select: { id: true, name: true, sourceGame: true },
    orderBy: { posicaoTrofeuMelee: "asc" },
  });

  console.log(`Processing ${trophies.length} unlinked SSBM trophies...\n`);

  let created = 0, skipped = 0, errors = 0;

  for (const trophy of trophies) {
    const parsedTitles = parseSourceGames(trophy.sourceGame);

    if (parsedTitles.length === 0) {
      skipped++;
      continue;
    }

    // Expand aliases
    const titlesToSearch: string[] = [];
    for (const pt of parsedTitles) {
      const aliased = ALIASES[pt];
      if (aliased) titlesToSearch.push(...aliased);
      else titlesToSearch.push(pt);
    }

    // Find matching entries (deduplicated by id)
    const hitIds = new Set<string>();
    const hits: { id: string; titleNtsc: string | null; consoleName: string }[] = [];
    for (const title of titlesToSearch) {
      const exact = byExact.get(title) ?? [];
      const norm  = byNorm.get(normalizeTitle(title)) ?? [];
      const found = exact.length > 0 ? exact : norm;
      for (const e of found) {
        if (!hitIds.has(e.id)) {
          hitIds.add(e.id);
          hits.push(e);
        }
      }
    }

    if (hits.length === 0) {
      console.log(`MISS  "${trophy.name}" ← ${JSON.stringify(parsedTitles)}`);
      errors++;
      continue;
    }

    for (const entry of hits) {
      const desc = `"${trophy.name}" → "${entry.titleNtsc}" [${entry.consoleName}]`;
      if (DRY_RUN) {
        console.log(`  WOULD CREATE: ${desc}`);
        created++;
        continue;
      }
      try {
        await db.collectibleChronicleLink.create({
          data: {
            collectibleId:    trophy.id,
            chronicleEntryId: entry.id,
          },
        });
        console.log(`  CREATED: ${desc}`);
        created++;
      } catch (err: any) {
        if (err?.code === "P2002") {
          // Already exists — skip silently
        } else {
          console.error(`  ERROR: ${desc} — ${err?.message}`);
          errors++;
        }
      }
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`Links created : ${created}`);
  console.log(`Trophies skipped (no game) : ${skipped}`);
  console.log(`Errors        : ${errors}`);

  await db.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
