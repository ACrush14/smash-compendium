import { db } from "../../lib/db";

// SSB4 WiiU: 35:48-35:58 = 2148-2158s (VLC confirmado 2026-07-01)

async function main() {
  const trophy = await db.collectible.findFirst({
    where: { name: "Ganondorf", smashGameVersion: "SSB4", type: "TROPHY" },
    select: { id: true, videoStartSec: true, videoEndSec: true },
  });
  if (trophy) {
    await db.collectible.update({
      where: { id: trophy.id },
      data: { videoStartSec: 2148, videoEndSec: 2158 },
    });
    console.log(`✅ SSB4 Trophy Ganondorf (WiiU): ${trophy.videoStartSec}-${trophy.videoEndSec} → 2148-2158 (35:48-35:58)`);
  }
  await db.$disconnect();
}
main().catch(console.error);
