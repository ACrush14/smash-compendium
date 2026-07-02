import { db } from "../../lib/db";

// Brawl: 55:34-56:06 = 3334-3366s (VLC confirmado 2026-07-01)
// videoStartSec já estava correto (3334); videoEndSec estava corrompido (201060) e foi nulled

async function main() {
  const trophy = await db.collectible.findFirst({
    where: { name: "Zelda", smashGameVersion: "SSBB", type: "TROPHY" },
    select: { id: true, videoStartSec: true, videoEndSec: true },
  });
  if (trophy) {
    await db.collectible.update({
      where: { id: trophy.id },
      data: { videoStartSec: 3334, videoEndSec: 3366 },
    });
    console.log(`✅ SSBB Trophy Zelda: ${trophy.videoStartSec}-${trophy.videoEndSec} → 3334-3366 (55:34-56:06)`);
  } else {
    console.log("⚠️ Trophy Zelda SSBB não encontrado");
  }
  await db.$disconnect();
}
main().catch(console.error);
