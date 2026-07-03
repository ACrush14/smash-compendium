import { db } from "../lib/db";
async function main() {
  const sf = await db.fighter.findFirst({ where: { name: "Mii Swordfighter" }, select: { id: true } });
  if (!sf) { console.log("not found"); return; }

  const main = await db.collectible.findFirst({ where: { name: { contains: "Mii Swordfighter" }, type: "TROPHY", smashGameVersion: "SSB4", posicaoTrofeuSsb4: 3 }, select: { id: true, name: true, videoStartSec: true, videoEndSec: true, videoStartSec2: true, videoEndSec2: true } });
  if (main) {
    await db.collectible.update({ where: { id: main.id }, data: { fighterId: sf.id, videoStartSec: 40, videoEndSec: 50, videoStartSec2: 27, videoEndSec2: 37 } });
    console.log(`✅ Trophy "${main.name}" [SSB4]: linkado, vídeo WiiU 40-50 | 3DS 27-37 (era ${main.videoStartSec}-${main.videoEndSec} | ${main.videoStartSec2}-${main.videoEndSec2})`);
  } else {
    console.log("main trophy not found");
  }

  const alt = await db.collectible.findFirst({ where: { name: { contains: "Mii Swordfighter" }, type: "TROPHY", smashGameVersion: "SSB4", posicaoTrofeuSsb4: 4 }, select: { id: true, name: true } });
  if (alt) {
    await db.collectible.update({ where: { id: alt.id }, data: { fighterId: sf.id } });
    console.log(`✅ Trophy "${alt.name}" [SSB4]: linkado (vídeo mantido, já plausível)`);
  } else {
    console.log("alt trophy not found");
  }
  await db.$disconnect();
}
main().catch(console.error);
