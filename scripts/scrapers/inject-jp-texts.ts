/**
 * inject-jp-texts.ts — Injeta os textos japoneses (bio + troféus) do Ness no banco de dados.
 * Uso: npx tsx scripts/scrapers/inject-jp-texts.ts
 */
import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const jsonPath = path.join(process.cwd(), "data", "ness_jp_texts.json");
  const data = JSON.parse(await fs.readFile(jsonPath, "utf-8"));

  // ── 1. Buscar o Fighter ────────────────────────────────────────────────
  const fighter = await prisma.fighter.findUnique({ where: { name: "Ness" } });
  if (!fighter) { console.error("❌ Fighter 'Ness' not found"); return; }
  console.log(`✅ Fighter: ${fighter.name} (${fighter.id})`);

  // ── 2. Atualizar Bio JP (SSB64) ────────────────────────────────────────
  if (data.bio?.SSB64) {
    const updated = await prisma.fighterBio.updateMany({
      where: { fighterId: fighter.id, smashGameVersion: "SSB64" },
      data: { contentJp: data.bio.SSB64 },
    });
    console.log(`✅ Bio SSB64 JP: ${updated.count} row(s) updated`);
  }

  // ── 3. Atualizar Troféus JP ────────────────────────────────────────────
  const gameVersionMap: Record<string, string> = {
    SSBM: "SSBM",
    SSBB: "SSBB",
    SSB4: "SSB4",
    SSBU: "SSBU",
  };

  for (const [jsonKey, dbKey] of Object.entries(gameVersionMap)) {
    const trophies = data.trophies?.[jsonKey];
    if (!trophies || trophies.length === 0) continue;

    // Buscar troféus existentes no banco para esta era
    const dbTrophies = await prisma.collectible.findMany({
      where: {
        fighterId: fighter.id,
        type: "TROPHY",
        smashGameVersion: dbKey,
      },
    });

    if (dbTrophies.length === 0) {
      console.log(`⚠️  No trophies in DB for ${dbKey}, skipping`);
      continue;
    }

    // Estratégia de matching: por ordem (o wiki e o banco geralmente seguem a mesma ordem)
    // e também por nome parcial
    for (let i = 0; i < trophies.length; i++) {
      const jpTrophy = trophies[i];
      const jpName = jpTrophy.name;
      const jpText = jpTrophy.text;

      // Tentar match por nome japonês parcial, ou por índice se não houver match
      let target = dbTrophies.find((t) => t.nameJp === jpName);
      
      if (!target && i < dbTrophies.length) {
        target = dbTrophies[i]; // fallback: match por posição
      }

      if (target) {
        await prisma.collectible.update({
          where: { id: target.id },
          data: {
            nameJp: jpName,
            descriptionJp: jpText,
          },
        });
        console.log(`✅ Trophy ${dbKey}: "${target.name}" ← JP "${jpName}"`);
      } else {
        console.log(`⚠️  No DB match for JP trophy "${jpName}" in ${dbKey}`);
      }
    }
  }

  console.log("\n🎉 Done!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
