import { db } from "../../lib/db";

async function main() {
  // Pega todos os 360 TROPHY existentes para determinar o número base de cada fighter
  const existing360s = await db.collectible.findMany({
    where: { smashGameVersion: "SSBM", type: "MEDIA", name: { startsWith: "360 TROPHY" } },
    select: { name: true, assetRenderUrl: true, fighterId: true },
  });

  // Mapa fighterId → menor número de arquivo (= número base do troféu principal)
  const fighterBaseNum = new Map<string, number>();
  for (const m of existing360s) {
    if (!m.fighterId || !m.assetRenderUrl) continue;
    const match = m.assetRenderUrl.match(/trophy_360_(\d+)\.webm/);
    if (!match) continue;
    const num = parseInt(match[1]);
    const existing = fighterBaseNum.get(m.fighterId);
    if (!existing || num < existing) fighterBaseNum.set(m.fighterId, num);
  }

  // Conjunto de MEDIA já existentes (fighterId+name)
  const existingSet = new Set(existing360s.map(m => `${m.fighterId}||${m.name}`));

  // Todos os troféus SSBM SMASH vinculados a fighters
  const smashTrophies = await db.collectible.findMany({
    where: {
      smashGameVersion: "SSBM",
      type: "TROPHY",
      fighterId: { not: null },
      OR: [
        { name: { endsWith: " SMASH" } },
        { name: { endsWith: " SMASH (2)" } },
      ],
    },
    select: { name: true, fighterId: true, fighter: { select: { name: true } } },
  });

  let created = 0;

  for (const trophy of smashTrophies) {
    if (!trophy.fighterId) continue;
    const baseNum = fighterBaseNum.get(trophy.fighterId);
    if (!baseNum) {
      console.log(`⚠️  Sem base_num para fighter ${trophy.fighterId} (troféu: ${trophy.name})`);
      continue;
    }

    const isSMASH2 = trophy.name.endsWith(" SMASH (2)");
    const offset = isSMASH2 ? 2 : 1;
    const fileNum = baseNum + offset;
    const mediaName = `360 TROPHY - ${trophy.name}`;
    const url = `/assets/media/SSBM/gifs/trophy_360_${fileNum}.webm`;
    const key = `${trophy.fighterId}||${mediaName}`;

    if (existingSet.has(key)) {
      console.log(`⏭️  Já existe: "${mediaName}"`);
      continue;
    }

    await db.collectible.create({
      data: {
        name: mediaName,
        type: "MEDIA",
        smashGameVersion: "SSBM",
        fighterId: trophy.fighterId,
        assetRenderUrl: url,
      },
    });
    console.log(`✅ Criado: "${mediaName}" → ${url} (${trophy.fighter?.name})`);
    created++;
  }

  console.log(`\nTotal criado: ${created}`);
  await db.$disconnect();
}
main();
