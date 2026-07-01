import { db } from "../../lib/db";

// Pikachu: 41:45-42:02 = 2505-2522s (VLC confirmado 2026-07-01)
// Jigglypuff: 42:22-42:39 = 2542-2559s (salvo para enriquecimento futuro)

async function main() {
  const bio = await db.fighterBio.findFirst({
    where: { fighter: { name: "Pikachu" }, smashGameVersion: "SSBM" },
    select: { id: true, videoStartSec: true, videoEndSec: true },
  });
  if (bio) {
    await db.fighterBio.update({
      where: { id: bio.id },
      data: { videoStartSec: 2505, videoEndSec: 2522 },
    });
    console.log(`✅ Bio SSBM Pikachu: ${bio.videoStartSec}–${bio.videoEndSec} → 2505–2522 (41:45–42:02)`);
  }

  const trophy = await db.collectible.findFirst({
    where: { name: "Pikachu", smashGameVersion: "SSBM", type: "TROPHY" },
    select: { id: true, videoStartSec: true, videoEndSec: true },
  });
  if (trophy) {
    await db.collectible.update({
      where: { id: trophy.id },
      data: { videoStartSec: 2505, videoEndSec: 2522 },
    });
    console.log(`✅ Trophy "Pikachu" SSBM: ${trophy.videoStartSec}–${trophy.videoEndSec} → 2505–2522`);
  }

  await db.$disconnect();
}
main().catch(console.error);
