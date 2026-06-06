/**
 * fix-cf-db.ts
 * Corrige os problemas de dados do Captain Falcon no banco:
 * 1. Disassocia troféus errados (Captain Olimar, Falcon Flyer) do Captain Falcon
 * 2. Corrige spirit: Falco Lombardi vinculado ao Captain Falcon → desvincula
 */
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  // ── Encontrar Captain Falcon ────────────────────────────────────────────────
  const cf = await db.fighter.findFirstOrThrow({ where: { name: "Captain Falcon" } });
  console.log(`Captain Falcon id: ${cf.id}`);

  // ── 1. Troféus errados no Melee ─────────────────────────────────────────────
  // "Captain Olimar" e "Falcon Flyer" foram scraped erroneamente para o fighterId do CF
  const wrongTrophies = await db.collectible.findMany({
    where: {
      fighterId: cf.id,
      type: "TROPHY",
      name: { in: ["Captain Olimar", "Falcon Flyer"] },
    },
  });

  if (wrongTrophies.length > 0) {
    console.log(`\nTroféus errados a desassociar:`);
    wrongTrophies.forEach(t => console.log(` - [${t.smashGameVersion}] ${t.name}`));

    const result = await db.collectible.updateMany({
      where: {
        fighterId: cf.id,
        type: "TROPHY",
        name: { in: ["Captain Olimar", "Falcon Flyer"] },
      },
      data: { fighterId: null },
    });
    console.log(`✅ ${result.count} troféus desassociados do Captain Falcon`);
  } else {
    console.log("\nNenhum troféu errado encontrado para remover.");
  }

  // ── 2. Spirit errado: Falco Lombardi vinculado ao CF ───────────────────────
  const wrongSpirit = await db.collectible.findFirst({
    where: { fighterId: cf.id, type: "SPIRIT" },
  });

  if (wrongSpirit) {
    console.log(`\nSpirit incorreto encontrado: "${wrongSpirit.name}"`);
    await db.collectible.update({
      where: { id: wrongSpirit.id },
      data: { fighterId: null },
    });
    console.log(`✅ Spirit "${wrongSpirit.name}" desassociado do Captain Falcon`);
  } else {
    console.log("\nNenhum spirit incorreto encontrado.");
  }

  // ── 3. Duplicatas de SSBM "Capt. Falcon SMASH" ────────────────────────────
  // Há dois trophies com o mesmo nome — manter apenas o que tem imagem
  const smbSmash = await db.collectible.findMany({
    where: { fighterId: cf.id, type: "TROPHY", smashGameVersion: "SSBM", name: "Capt. Falcon SMASH" },
    select: { id: true, name: true, assetRenderUrl: true },
  });
  console.log(`\n"Capt. Falcon SMASH" no banco: ${smbSmash.length}`);
  smbSmash.forEach(t => console.log(` - id:${t.id} | img:${!!t.assetRenderUrl}`));

  // ── 4. Verificar estado final ───────────────────────────────────────────────
  console.log("\n=== Estado final das trophies do Captain Falcon ===");
  const remaining = await db.collectible.findMany({
    where: { fighterId: cf.id, type: "TROPHY" },
    select: { name: true, smashGameVersion: true, assetRenderUrl: true },
    orderBy: [{ smashGameVersion: "asc" }, { name: "asc" }],
  });
  remaining.forEach(t => console.log(` [${t.smashGameVersion}] ${t.name} | img:${!!t.assetRenderUrl}`));
}

main().catch(console.error).finally(() => db.$disconnect());
