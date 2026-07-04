import { db } from "../lib/db";
async function main() {
  const bowserJr = await db.fighter.findFirst({ where: { name: "Bowser Jr." }, select: { id: true, name: true } });
  if (!bowserJr) { console.log("Bowser Jr. not found"); return; }
  const larry = await db.collectible.findFirst({ where: { name: "Larry", type: "TROPHY", smashGameVersion: "SSB4" }, select: { franchiseId: true, sourceGame: true, sourceType: true } });
  if (!larry) { console.log("Larry template not found"); return; }

  const existing = await db.collectible.findFirst({ where: { id: "TROPHY-SSB4-RoyKoopa" } });
  if (existing) { console.log("Already exists, aborting"); return; }

  const created = await db.collectible.create({
    data: {
      id: "TROPHY-SSB4-RoyKoopa",
      fighterId: bowserJr.id,
      franchiseId: larry.franchiseId,
      type: "TROPHY",
      smashGameVersion: "SSB4",
      name: "Roy (Super Mario)",
      sourceType: larry.sourceType,
      sourceGame: larry.sourceGame,
      posicaoTrofeuSsb4: 68,
      videoStartSec: 700,
      videoEndSec: 712,
      videoStartSec2: 677,
      videoEndSec2: 688,
      curationStatus: "pending_review",
    },
  });
  console.log("✅ Criado:", created.id, created.name, "pos", created.posicaoTrofeuSsb4, "video", created.videoStartSec, created.videoEndSec, "|", created.videoStartSec2, created.videoEndSec2);
  await db.$disconnect();
}
main().catch(console.error);
