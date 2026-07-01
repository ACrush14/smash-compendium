import { db } from "../../lib/db";

// Bio SSBM estava em 4346-4382 (seção SMASH trophies ~72min)
// Correto é 1865-1882 (Kirby trophy ~31min) conforme VLC 31:05-31:22

async function main() {
  // Fix Bio SSBM
  const bio = await db.fighterBio.findFirst({
    where: { fighter: { name: "Kirby" }, smashGameVersion: "SSBM" },
    select: { id: true, videoStartSec: true, videoEndSec: true },
  });
  if (bio) {
    await db.fighterBio.update({
      where: { id: bio.id },
      data: { videoStartSec: 1865, videoEndSec: 1882 },
    });
    console.log(`✅ Bio SSBM: ${bio.videoStartSec}–${bio.videoEndSec} → 1865–1882 (31:05–31:22)`);
  }

  // Fix Trophy "Kirby" SSBM (estava em 1863, correto é 1865)
  const trophy = await db.collectible.findFirst({
    where: { name: "Kirby", smashGameVersion: "SSBM", type: "TROPHY" },
    select: { id: true, videoStartSec: true, videoEndSec: true },
  });
  if (trophy) {
    await db.collectible.update({
      where: { id: trophy.id },
      data: { videoStartSec: 1865, videoEndSec: 1882 },
    });
    console.log(`✅ Trophy "Kirby" SSBM: ${trophy.videoStartSec}–${trophy.videoEndSec} → 1865–1882`);
  }

  await db.$disconnect();
}
main().catch(console.error);
