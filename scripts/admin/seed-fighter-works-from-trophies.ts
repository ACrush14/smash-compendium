/**
 * seed-fighter-works-from-trophies.ts
 *
 * Popula FighterChronicleLinks a partir dos CollectibleChronicleLinks dos
 * trofeus/spirits/stickers de cada lutador. Os jogos de origem dos troféus
 * canônicos de cada personagem são exatamente os Works que devem aparecer
 * na página do lutador.
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/admin/seed-fighter-works-from-trophies.ts
 *   npx tsx --env-file=.env.local scripts/admin/seed-fighter-works-from-trophies.ts --dry-run
 *   npx tsx --env-file=.env.local scripts/admin/seed-fighter-works-from-trophies.ts --clear
 *   npx tsx --env-file=.env.local scripts/admin/seed-fighter-works-from-trophies.ts --fighter Yoshi
 */

import { db } from "../../lib/db";

const args     = process.argv.slice(2);
const DRY_RUN  = args.includes("--dry-run");
const CLEAR    = args.includes("--clear");
const FIGHTER_ARG = args.includes("--fighter") ? args[args.indexOf("--fighter") + 1] : null;

const SMASH_GAMES = new Set([
  "Super Smash Bros.", "Super Smash Bros. Melee", "Super Smash Bros. Brawl",
  "Super Smash Bros. for Nintendo 3DS", "Super Smash Bros. for Wii U",
  "Super Smash Bros. for Nintendo 3DS / Wii U", "Super Smash Bros. Ultimate",
]);

function isExcluded(title: string) {
  if (SMASH_GAMES.has(title)) return true;
  if (title.includes("EXCLUSIVE")) return true;
  return false;
}

function normalizeTitle(title: string) {
  return title.toLowerCase().replace(/[®™'':]/g, "").replace(/\s+/g, " ").trim();
}

async function main() {
  const fighterWhere = FIGHTER_ARG ? { name: FIGHTER_ARG } : {};

  const fighters = await db.fighter.findMany({
    where: {
      ...fighterWhere,
      collectibles: { some: { chronicleLinks: { some: {} } } },
    },
    select: {
      id: true,
      name: true,
      rosterNumber: true,
      collectibles: {
        select: {
          id: true,
          name: true,
          type: true,
          smashGameVersion: true,
          chronicleLinks: {
            select: {
              chronicleEntry: {
                select: { id: true, titleNtsc: true, releaseDateNtsc: true },
              },
            },
          },
        },
      },
    },
    orderBy: { rosterNumber: "asc" },
  });

  console.log(`Lutadores a processar: ${fighters.length}${DRY_RUN ? " (DRY RUN)" : ""}`);

  if (CLEAR && !DRY_RUN) {
    const ids = fighters.map(f => f.id);
    const deleted = await db.fighterChronicleLink.deleteMany({
      where: { fighterId: { in: ids } },
    });
    console.log(`--clear: ${deleted.count} FighterChronicleLinks apagados\n`);
  }

  let totalLinked = 0;

  for (const fighter of fighters) {
    // Agrega todos os ChronicleEntries únicos de todos os collectibles deste lutador
    // Agrega entradas únicas por título normalizado (filtra Smash/EXCLUSIVE/duplicatas)
    const seenTitles = new Set<string>();
    const entryMap = new Map<string, { id: string; titleNtsc: string; releaseDateNtsc: string | null }>();

    for (const col of fighter.collectibles) {
      for (const cl of col.chronicleLinks) {
        const e = cl.chronicleEntry;
        if (isExcluded(e.titleNtsc)) continue;
        const norm = normalizeTitle(e.titleNtsc);
        if (seenTitles.has(norm)) continue;
        seenTitles.add(norm);
        entryMap.set(e.id, e);
      }
    }

    if (entryMap.size === 0) continue;

    // Ordena por data de lançamento para displayOrder
    const sorted = [...entryMap.values()].sort((a, b) => {
      const da = a.releaseDateNtsc ?? "9999";
      const db = b.releaseDateNtsc ?? "9999";
      return da.localeCompare(db);
    });

    const games = sorted.map(e => e.titleNtsc).join(", ");
    console.log(`  ${fighter.name.padEnd(24)} → ${sorted.length} jogos: ${games}`);

    if (!DRY_RUN) {
      for (let i = 0; i < sorted.length; i++) {
        const entry = sorted[i]!;
        await db.fighterChronicleLink.upsert({
          where: {
            fighterId_chronicleEntryId: {
              fighterId: fighter.id,
              chronicleEntryId: entry.id,
            },
          },
          create: {
            fighterId: fighter.id,
            chronicleEntryId: entry.id,
            displayOrder: i + 1,
            isDebut: i === 0,
          },
          update: {
            displayOrder: i + 1,
            isDebut: i === 0,
          },
        });
      }
    }

    totalLinked += sorted.length;
  }

  await db.$disconnect();
  console.log(`\n=== RESULTADO ===`);
  console.log(`Fighters processados: ${fighters.length}`);
  console.log(`FighterChronicleLinks ${DRY_RUN ? "a criar" : "criados"}: ${totalLinked}`);
}

main().catch(e => { console.error(e); process.exit(1); });
