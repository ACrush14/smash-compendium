import { db } from "../lib/db";

async function main() {
  const ridley = await db.fighter.findFirst({ where: { name: "Ridley" }, select: { id: true, bios: { select: { id: true, smashGameVersion: true } } } });
  if (!ridley) { console.log("not found"); return; }

  const ssb4Bio = ridley.bios.find(b => b.smashGameVersion === "SSB4");
  if (ssb4Bio) {
    await db.fighterBio.update({ where: { id: ssb4Bio.id }, data: { videoStartSec: 2729, videoEndSec: 2739 } });
    console.log("✅ Vídeo SSB4 bio (WiiU) aplicado: 2729-2739");
  }

  await db.fighter.update({ where: { id: ridley.id }, data: { curationStatus: "approved" } });
  console.log("✅ Ridley aprovado");

  await db.$disconnect();
}
main().catch(console.error);
