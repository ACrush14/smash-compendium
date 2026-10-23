/**
 * Desvincula dois troféus que o scraper antigo ligou ao lutador errado (matching por substring):
 *   "Mew" (SSBM)        estava em Mewtwo
 *   "Mr. Resetti" (SSBM) estava em Mr. Game & Watch
 * O vídeo de ambos está certo; só o `fighterId` muda (vira null).
 *
 *   npx tsx --env-file=.env.local scripts/admin/fix-mew-resetti-fighter-links.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const FIXES = [
  { id: "TROPHY-SSBM-Mew", wrongFighter: "Mewtwo" },
  { id: "TROPHY-SSBM-Mr. Resetti", wrongFighter: "Mr. Game & Watch" },
];

async function main() {
  for (const f of FIXES) {
    const t = await db.collectible.findUnique({ where: { id: f.id }, select: { id: true, name: true, fighter: { select: { name: true } } } });
    if (!t) { console.log(`! ${f.id} não existe`); continue; }
    const current = t.fighter?.name ?? null;
    if (current === null) { console.log(`= ${t.name}: já está sem lutador`); continue; }
    if (current !== f.wrongFighter) { console.log(`! ${t.name}: ligado a "${current}", esperado "${f.wrongFighter}". Nada foi alterado.`); continue; }
    await db.collectible.update({ where: { id: f.id }, data: { fighterId: null } });
    console.log(`✓ ${t.name}: desvinculado de ${current}`);
  }
}
main().finally(() => db.$disconnect());
