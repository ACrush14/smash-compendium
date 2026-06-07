/**
 * populate-fighter-works.ts
 *
 * Popula a tabela FighterWork para todos os fighters com base em dados
 * definidos neste próprio arquivo (não depende de scraping).
 *
 * Como usar:
 *   1. O arquivo já tem os dados corretos para todos os 87 fighters
 *   2. Verifique os dados abaixo
 *   3. npx tsx --env-file=.env.local scripts/admin/populate-fighter-works.ts
 *   4. npx tsx --env-file=.env.local scripts/admin/populate-fighter-works.ts --dry-run
 *
 * Para adicionar/corrigir um fighter: edite FIGHTER_APPEARANCES abaixo.
 */

import { PrismaClient } from "@prisma/client";

const db      = new PrismaClient();
const args    = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");

// ─── Aparições por fighter ────────────────────────────────────────────────────
// Formato: { fighter: string, debut: GameKey, also: GameKey[] }
// GameKey: "SSB64" | "SSBM" | "SSBB" | "SSB4" | "SSBU"

type GameKey = "SSB64" | "SSBM" | "SSBB" | "SSB4" | "SSBU";

const FIGHTER_APPEARANCES: Array<{ fighter: string; debut: GameKey; also: GameKey[] }> = [
  // SSB64 originals (aparecem em todos os jogos)
  { fighter: "Mario",          debut: "SSB64", also: ["SSBM","SSBB","SSB4","SSBU"] },
  { fighter: "Donkey Kong",    debut: "SSB64", also: ["SSBM","SSBB","SSB4","SSBU"] },
  { fighter: "Link",           debut: "SSB64", also: ["SSBM","SSBB","SSB4","SSBU"] },
  { fighter: "Samus",          debut: "SSB64", also: ["SSBM","SSBB","SSB4","SSBU"] },
  { fighter: "Dark Samus",     debut: "SSBU",  also: [] },
  { fighter: "Yoshi",          debut: "SSB64", also: ["SSBM","SSBB","SSB4","SSBU"] },
  { fighter: "Kirby",          debut: "SSB64", also: ["SSBM","SSBB","SSB4","SSBU"] },
  { fighter: "Fox",            debut: "SSB64", also: ["SSBM","SSBB","SSB4","SSBU"] },
  { fighter: "Pikachu",        debut: "SSB64", also: ["SSBM","SSBB","SSB4","SSBU"] },
  { fighter: "Luigi",          debut: "SSB64", also: ["SSBM","SSBB","SSB4","SSBU"] },
  { fighter: "Ness",           debut: "SSB64", also: ["SSBM","SSBB","SSB4","SSBU"] },
  { fighter: "Captain Falcon", debut: "SSB64", also: ["SSBM","SSBB","SSB4","SSBU"] },
  { fighter: "Jigglypuff",     debut: "SSB64", also: ["SSBM","SSBB","SSB4","SSBU"] },

  // Melee newcomers
  { fighter: "Peach",          debut: "SSBM",  also: ["SSBB","SSB4","SSBU"] },
  { fighter: "Daisy",          debut: "SSBU",  also: [] },
  { fighter: "Bowser",         debut: "SSBM",  also: ["SSBB","SSB4","SSBU"] },
  { fighter: "Ice Climbers",   debut: "SSBM",  also: ["SSBB","SSBU"] },
  { fighter: "Sheik",          debut: "SSBM",  also: ["SSBB","SSB4","SSBU"] },
  { fighter: "Zelda",          debut: "SSBM",  also: ["SSBB","SSB4","SSBU"] },
  { fighter: "Dr. Mario",      debut: "SSBM",  also: ["SSB4","SSBU"] },
  { fighter: "Pichu",          debut: "SSBM",  also: ["SSBU"] },
  { fighter: "Falco",          debut: "SSBM",  also: ["SSBB","SSB4","SSBU"] },
  { fighter: "Marth",          debut: "SSBM",  also: ["SSBB","SSB4","SSBU"] },
  { fighter: "Lucina",         debut: "SSB4",  also: ["SSBU"] },
  { fighter: "Young Link",     debut: "SSBM",  also: ["SSBU"] },
  { fighter: "Ganondorf",      debut: "SSBM",  also: ["SSBB","SSB4","SSBU"] },
  { fighter: "Mewtwo",         debut: "SSBM",  also: ["SSB4","SSBU"] },
  { fighter: "Roy",            debut: "SSBM",  also: ["SSB4","SSBU"] },
  { fighter: "Chrom",          debut: "SSBU",  also: [] },
  { fighter: "Mr. Game & Watch", debut: "SSBM", also: ["SSBB","SSB4","SSBU"] },

  // Brawl newcomers
  { fighter: "Meta Knight",    debut: "SSBB",  also: ["SSB4","SSBU"] },
  { fighter: "Pit",            debut: "SSBB",  also: ["SSB4","SSBU"] },
  { fighter: "Dark Pit",       debut: "SSB4",  also: ["SSBU"] },
  { fighter: "Zero Suit Samus",debut: "SSBB",  also: ["SSB4","SSBU"] },
  { fighter: "Wario",          debut: "SSBB",  also: ["SSB4","SSBU"] },
  { fighter: "Snake",          debut: "SSBB",  also: ["SSBU"] },
  { fighter: "Ike",            debut: "SSBB",  also: ["SSB4","SSBU"] },
  { fighter: "Pokémon Trainer",debut: "SSBB",  also: ["SSBU"] },
  { fighter: "Diddy Kong",     debut: "SSBB",  also: ["SSB4","SSBU"] },
  { fighter: "Lucas",          debut: "SSBB",  also: ["SSB4","SSBU"] },
  { fighter: "Sonic",          debut: "SSBB",  also: ["SSB4","SSBU"] },
  { fighter: "King Dedede",    debut: "SSBB",  also: ["SSB4","SSBU"] },
  { fighter: "Olimar",         debut: "SSBB",  also: ["SSB4","SSBU"] },
  { fighter: "Lucario",        debut: "SSBB",  also: ["SSB4","SSBU"] },
  { fighter: "R.O.B.",         debut: "SSBB",  also: ["SSB4","SSBU"] },
  { fighter: "Toon Link",      debut: "SSBB",  also: ["SSB4","SSBU"] },
  { fighter: "Wolf",           debut: "SSBB",  also: ["SSBU"] },

  // SSB4 newcomers
  { fighter: "Villager",       debut: "SSB4",  also: ["SSBU"] },
  { fighter: "Mega Man",       debut: "SSB4",  also: ["SSBU"] },
  { fighter: "Wii Fit Trainer",debut: "SSB4",  also: ["SSBU"] },
  { fighter: "Rosalina & Luma",debut: "SSB4",  also: ["SSBU"] },
  { fighter: "Little Mac",     debut: "SSB4",  also: ["SSBU"] },
  { fighter: "Greninja",       debut: "SSB4",  also: ["SSBU"] },
  { fighter: "Mii Brawler",    debut: "SSB4",  also: ["SSBU"] },
  { fighter: "Mii Swordfighter",debut:"SSB4",  also: ["SSBU"] },
  { fighter: "Mii Gunner",     debut: "SSB4",  also: ["SSBU"] },
  { fighter: "Palutena",       debut: "SSB4",  also: ["SSBU"] },
  { fighter: "Pac-Man",        debut: "SSB4",  also: ["SSBU"] },
  { fighter: "Robin",          debut: "SSB4",  also: ["SSBU"] },
  { fighter: "Shulk",          debut: "SSB4",  also: ["SSBU"] },
  { fighter: "Bowser Jr.",     debut: "SSB4",  also: ["SSBU"] },
  { fighter: "Duck Hunt",      debut: "SSB4",  also: ["SSBU"] },
  { fighter: "Ryu",            debut: "SSB4",  also: ["SSBU"] },
  { fighter: "Ken",            debut: "SSBU",  also: [] },
  { fighter: "Cloud",          debut: "SSB4",  also: ["SSBU"] },
  { fighter: "Corrin",         debut: "SSB4",  also: ["SSBU"] },
  { fighter: "Bayonetta",      debut: "SSB4",  also: ["SSBU"] },

  // SSBU newcomers
  { fighter: "Inkling",        debut: "SSBU",  also: [] },
  { fighter: "Ridley",         debut: "SSBU",  also: [] },
  { fighter: "Simon",          debut: "SSBU",  also: [] },
  { fighter: "Richter",        debut: "SSBU",  also: [] },
  { fighter: "King K. Rool",   debut: "SSBU",  also: [] },
  { fighter: "Isabelle",       debut: "SSBU",  also: [] },
  { fighter: "Incineroar",     debut: "SSBU",  also: [] },

  // SSBU DLC
  { fighter: "Piranha Plant",  debut: "SSBU",  also: [] },
  { fighter: "Joker",          debut: "SSBU",  also: [] },
  { fighter: "Hero",           debut: "SSBU",  also: [] },
  { fighter: "Banjo & Kazooie",debut: "SSBU",  also: [] },
  { fighter: "Terry",          debut: "SSBU",  also: [] },
  { fighter: "Byleth",         debut: "SSBU",  also: [] },
  { fighter: "Min Min",        debut: "SSBU",  also: [] },
  { fighter: "Steve",          debut: "SSBU",  also: [] },
  { fighter: "Sephiroth",      debut: "SSBU",  also: [] },
  { fighter: "Pyra",           debut: "SSBU",  also: [] },
  { fighter: "Mythra",         debut: "SSBU",  also: [] },
  { fighter: "Kazuya",         debut: "SSBU",  also: [] },
  { fighter: "Sora",           debut: "SSBU",  also: [] },
];

// ─── Dados dos 5 jogos Smash (IDs fixos para idempotência) ───────────────────
const SMASH_GAMES: Record<GameKey, { id: string; titleEn: string; releaseYear: number; platform: string }> = {
  SSB64: { id: "game-SSB64", titleEn: "Super Smash Bros.",                   releaseYear: 1999, platform: "N64" },
  SSBM:  { id: "game-SSBM",  titleEn: "Super Smash Bros. Melee",             releaseYear: 2001, platform: "GCN" },
  SSBB:  { id: "game-SSBB",  titleEn: "Super Smash Bros. Brawl",             releaseYear: 2008, platform: "Wii" },
  SSB4:  { id: "game-SSB4",  titleEn: "Super Smash Bros. for Wii U / 3DS",   releaseYear: 2014, platform: "WiiU" },
  SSBU:  { id: "game-SSBU",  titleEn: "Super Smash Bros. Ultimate",          releaseYear: 2018, platform: "NSW" },
};

async function main() {
  // Garantir que os 5 jogos Smash existem no banco
  console.log("Verificando jogos Smash no banco...");
  for (const [key, g] of Object.entries(SMASH_GAMES) as [GameKey, typeof SMASH_GAMES[GameKey]][]) {
    if (!DRY_RUN) {
      await db.game.upsert({
        where:  { id: g.id },
        update: { titleEn: g.titleEn },
        create: { id: g.id, titleEn: g.titleEn, releaseYear: g.releaseYear, platform: g.platform,
                  franchiseId: (await db.franchise.findFirst({ where: { name: "Super Smash Bros." } }))!.id },
      });
    }
    console.log(`  ✓ ${key}: ${g.titleEn}`);
  }

  const gameIdMap: Partial<Record<GameKey, string>> = {};
  for (const [key, g] of Object.entries(SMASH_GAMES) as [GameKey, typeof SMASH_GAMES[GameKey]][]) {
    gameIdMap[key as GameKey] = g.id;
  }

  // Buscar fighters
  const fighters = await db.fighter.findMany({ select: { id: true, name: true } });
  const fighterMap = new Map(fighters.map(f => [f.name.toLowerCase(), f.id]));

  let created = 0, skipped = 0, notFound = 0;

  for (const row of FIGHTER_APPEARANCES) {
    const fighterId = fighterMap.get(row.fighter.toLowerCase());
    if (!fighterId) {
      console.warn(`⚠️  Fighter não encontrado: "${row.fighter}"`);
      notFound++;
      continue;
    }

    const allGames = [{ key: row.debut, isDebut: true }, ...row.also.map(k => ({ key: k, isDebut: false }))];

    for (const { key, isDebut } of allGames) {
      const gameId = gameIdMap[key as GameKey];
      if (!gameId) { skipped++; continue; }

      if (!DRY_RUN) {
        await db.fighterWork.upsert({
          where:  { fighterId_gameId: { fighterId, gameId } },
          update: { isDebut },
          create: { fighterId, gameId, isDebut },
        });
      }

      if (DRY_RUN || created < 5) {
        console.log(`  ${isDebut ? "★" : " "} ${row.fighter} → ${key}`);
      }
      created++;
    }
  }

  if (!DRY_RUN && created > 5) console.log(`  ... (${created} total)`);
  console.log(`\n✅ FighterWork: ${created} criados/atualizados | ${skipped} ignorados | ${notFound} fighters não encontrados`);
  await db.$disconnect();
}

main().catch(console.error);
