/**
 * check-status.ts
 *
 * Dashboard rápido do estado do projeto — roda em segundos.
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/admin/check-status.ts
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const [
    fighters,
    fightersWithWorks,
    fightersNoBio,
    fightersNoTrophy,
    fightersNoSpirit,
    fightersNoImage,
    chronTotal,
    chronWithArt,
    chronWithWiki,
    chronComplete,
    spirits,
    trophies,
    stickers,
    musicPending,
  ] = await Promise.all([
    db.fighter.count(),
    db.fighter.count({ where: { works: { some: {} } } }),
    db.fighter.count({ where: { bios: { none: {} } } }),
    db.fighter.count({ where: { collectibles: { none: { type: "TROPHY" } } } }),
    db.fighter.count({ where: { collectibles: { none: { type: "SPIRIT" } } } }),
    db.fighter.count({ where: { imageUrl: null } }),
    db.chronicleEntry.count(),
    db.chronicleEntry.count({ where: { boxArtUrl: { not: null } } }),
    db.chronicleEntry.count({ where: { wikiUrl: { not: null } } }),
    db.chronicleEntry.count({ where: { wikiUrl: { not: null }, boxArtUrl: { not: null } } }),
    db.collectible.count({ where: { type: "SPIRIT" } }),
    db.collectible.count({ where: { type: "TROPHY" } }),
    db.collectible.count({ where: { type: "STICKER" } }),
    db.fighter.count({ where: { musicStatus: { not: "approved" } } }),
  ]);

  const bar = (n: number, total: number, width = 20) => {
    const filled = Math.round((n / total) * width);
    return "█".repeat(filled) + "░".repeat(width - filled);
  };
  const pct = (n: number, total: number) => `${Math.round((n / total) * 100)}%`;

  console.log("\n╔════════════════════════════════════════════╗");
  console.log("║     SmashCompendium — Status Dashboard      ║");
  console.log("╚════════════════════════════════════════════╝\n");

  console.log("── FIGHTERS (" + fighters + " total) ──────────────────────");
  console.log(`  FighterWork    ${bar(fightersWithWorks, fighters)}  ${fightersWithWorks}/${fighters}  ${pct(fightersWithWorks, fighters)}`);
  console.log(`  Com bio        ${bar(fighters - fightersNoBio, fighters)}  ${fighters - fightersNoBio}/${fighters}  ${pct(fighters - fightersNoBio, fighters)}`);
  console.log(`  Com troféus    ${bar(fighters - fightersNoTrophy, fighters)}  ${fighters - fightersNoTrophy}/${fighters}  ${pct(fighters - fightersNoTrophy, fighters)}`);
  console.log(`  Com spirits    ${bar(fighters - fightersNoSpirit, fighters)}  ${fighters - fightersNoSpirit}/${fighters}  ${pct(fighters - fightersNoSpirit, fighters)}`);
  console.log(`  Com imageUrl   ${bar(fighters - fightersNoImage, fighters)}  ${fighters - fightersNoImage}/${fighters}  ${pct(fighters - fightersNoImage, fighters)}`);
  console.log(`  Música OK      ${bar(fighters - musicPending, fighters)}  ${fighters - musicPending}/${fighters}  ${pct(fighters - musicPending, fighters)}`);

  console.log("\n── COLLECTIBLES ─────────────────────────────");
  console.log(`  Troféus:  ${trophies.toLocaleString()}`);
  console.log(`  Spirits:  ${spirits.toLocaleString()}`);
  console.log(`  Stickers: ${stickers.toLocaleString()}`);

  console.log("\n── CHRONICLES (" + chronTotal + " entradas) ─────────────────");
  console.log(`  Com wikiUrl    ${bar(chronWithWiki, chronTotal)}  ${chronWithWiki}/${chronTotal}  ${pct(chronWithWiki, chronTotal)}`);
  console.log(`  Com boxArtUrl  ${bar(chronWithArt, chronTotal)}  ${chronWithArt}/${chronTotal}  ${pct(chronWithArt, chronTotal)}`);
  console.log(`  Completas      ${bar(chronComplete, chronTotal)}  ${chronComplete}/${chronTotal}  ${pct(chronComplete, chronTotal)}`);

  console.log("\n── PENDÊNCIAS CRÍTICAS ──────────────────────");
  if (fightersWithWorks < fighters)
    console.log(`  🔴 ${fighters - fightersWithWorks} fighters sem FighterWork → rode populate-fighter-works.ts`);
  if (fightersNoImage > 0)
    console.log(`  🔴 ${fightersNoImage} fighters sem imageUrl (render)`);
  if (chronTotal - chronWithWiki > 0)
    console.log(`  🟡 ${chronTotal - chronWithWiki} Chronicles sem wikiUrl`);
  if (chronTotal - chronWithArt > 0)
    console.log(`  🟡 ${chronTotal - chronWithArt} Chronicles sem capa`);
  if (musicPending > 0)
    console.log(`  🟠 ${musicPending} músicas pending_review → /admin/music`);

  console.log("");
  await db.$disconnect();
}

main().catch(console.error);
