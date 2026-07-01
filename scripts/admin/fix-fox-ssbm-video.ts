import { db } from "../../lib/db";

// Fox: 25:19-25:39 = 1519-1539s (VLC confirmado 2026-07-01)
// Falco: 25:39-25:58 = 1539-1558s (salvo para enriquecimento futuro)

async function main() {
  // Fix Bio SSBM Fox
  const bio = await db.fighterBio.findFirst({
    where: { fighter: { name: "Fox" }, smashGameVersion: "SSBM" },
    select: { id: true, videoStartSec: true, videoEndSec: true },
  });
  if (bio) {
    await db.fighterBio.update({
      where: { id: bio.id },
      data: { videoStartSec: 1519, videoEndSec: 1539 },
    });
    console.log(`✅ Bio SSBM Fox: ${bio.videoStartSec}–${bio.videoEndSec} → 1519–1539 (25:19–25:39)`);
  }

  // Fix Trophy "Fox McCloud" SSBM
  const trophy = await db.collectible.findFirst({
    where: { name: "Fox McCloud", smashGameVersion: "SSBM", type: "TROPHY" },
    select: { id: true, videoStartSec: true, videoEndSec: true },
  });
  if (trophy) {
    await db.collectible.update({
      where: { id: trophy.id },
      data: { videoStartSec: 1519, videoEndSec: 1539 },
    });
    console.log(`✅ Trophy "Fox McCloud" SSBM: ${trophy.videoStartSec}–${trophy.videoEndSec} → 1519–1539`);
  }

  await db.$disconnect();
}
main().catch(console.error);
