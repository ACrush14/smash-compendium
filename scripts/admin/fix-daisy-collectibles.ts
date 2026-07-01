import { db } from "../../lib/db";

// Troféus da Daisy sem fighterId (não apareciam na página do lutador) + timing corrigido
// Brawl: 30:52-31:09 = 1852-1869s | SSB4 WiiU: 20:29-20:40 = 1229-1240s (já correto) | SSB4 3DS Tennis: 25:34-25:44 = 1534-1544s

async function main() {
  const daisy = await db.fighter.findFirst({ where: { name: "Daisy" }, select: { id: true } });
  if (!daisy) { console.log("Daisy not found"); return; }

  // SSBB "Striker Daisy" — corrigir corrupção (1845-111720) + linkar fighterId
  const ssbbTrophy = await db.collectible.findFirst({
    where: { name: "Striker Daisy", smashGameVersion: "SSBB", type: "TROPHY" },
    select: { id: true, videoStartSec: true, videoEndSec: true },
  });
  if (ssbbTrophy) {
    await db.collectible.update({
      where: { id: ssbbTrophy.id },
      data: { fighterId: daisy.id, videoStartSec: 1852, videoEndSec: 1869 },
    });
    console.log(`✅ SSBB "Striker Daisy": fighterId linkado + timing ${ssbbTrophy.videoStartSec}-${ssbbTrophy.videoEndSec} → 1852-1869 (30:52-31:09)`);
  }

  // SSB4_WIIU "Daisy" — timing já correto (1229-1240), só linkar fighterId
  const wiiuTrophy = await db.collectible.findFirst({
    where: { name: "Daisy", smashGameVersion: "SSB4_WIIU", type: "TROPHY" },
    select: { id: true, videoStartSec: true, videoEndSec: true },
  });
  if (wiiuTrophy) {
    await db.collectible.update({ where: { id: wiiuTrophy.id }, data: { fighterId: daisy.id } });
    console.log(`✅ SSB4_WIIU "Daisy": fighterId linkado (timing já correto ${wiiuTrophy.videoStartSec}-${wiiuTrophy.videoEndSec})`);
  }

  // SSB4_3DS "Daisy (Tennis Outfit)" — corrigir 1s + linkar fighterId
  const tennisTrophy = await db.collectible.findFirst({
    where: { name: "Daisy (Tennis Outfit)", smashGameVersion: "SSB4_3DS", type: "TROPHY" },
    select: { id: true, videoStartSec: true, videoEndSec: true },
  });
  if (tennisTrophy) {
    await db.collectible.update({
      where: { id: tennisTrophy.id },
      data: { fighterId: daisy.id, videoStartSec: 1534, videoEndSec: 1544 },
    });
    console.log(`✅ SSB4_3DS "Daisy (Tennis Outfit)": fighterId linkado + timing ${tennisTrophy.videoStartSec}-${tennisTrophy.videoEndSec} → 1534-1544 (25:34-25:44)`);
  }

  await db.$disconnect();
}
main().catch(console.error);
