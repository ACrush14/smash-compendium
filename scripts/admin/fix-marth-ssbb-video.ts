import { db } from "../../lib/db";

// Brawl: 2:00:55-2:01:11 = 7255-7271s (VLC confirmado 2026-07-01)
// videoEndSec estava corrompido (7249-7251, só 2s de duração)

async function main() {
  const trophy = await db.collectible.findFirst({
    where: { name: "Marth", smashGameVersion: "SSBB", type: "TROPHY" },
    select: { id: true, videoStartSec: true, videoEndSec: true },
  });
  if (trophy) {
    await db.collectible.update({
      where: { id: trophy.id },
      data: { videoStartSec: 7255, videoEndSec: 7271 },
    });
    console.log(`✅ SSBB Trophy Marth: ${trophy.videoStartSec}-${trophy.videoEndSec} → 7255-7271 (2:00:55-2:01:11)`);
  } else {
    console.log("⚠️ Trophy Marth SSBB não encontrado");
  }
  await db.$disconnect();
}
main().catch(console.error);
