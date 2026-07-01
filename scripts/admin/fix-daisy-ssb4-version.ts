import { db } from "../../lib/db";

// Bug: página do lutador agrupa troféus por smashGameVersion EXATO "SSB4" (não "SSB4_WIIU"/"SSB4_3DS").
// Daisy tinha 2 troféus SSB4 com versão não-normalizada, por isso nunca apareciam na tab Smash 4.

async function main() {
  const wiiu = await db.collectible.updateMany({
    where: { name: "Daisy", smashGameVersion: "SSB4_WIIU", type: "TROPHY" },
    data: { smashGameVersion: "SSB4" },
  });
  console.log(`✅ "Daisy" SSB4_WIIU → SSB4: ${wiiu.count} registro(s)`);

  const tds = await db.collectible.updateMany({
    where: { name: "Daisy (Tennis Outfit)", smashGameVersion: "SSB4_3DS", type: "TROPHY" },
    data: { smashGameVersion: "SSB4" },
  });
  console.log(`✅ "Daisy (Tennis Outfit)" SSB4_3DS → SSB4: ${tds.count} registro(s)`);

  await db.$disconnect();
}
main().catch(console.error);
