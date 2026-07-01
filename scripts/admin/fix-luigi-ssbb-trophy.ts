import { db } from "../../lib/db";

// Luigi SSBB: 29:58-30:15 = 1798-1815s (VLC confirmado 2026-07-01)

async function main() {
  const trophy = await db.collectible.findFirst({
    where: { name: "Luigi", smashGameVersion: "SSBB", type: "TROPHY" },
    select: { id: true, videoStartSec: true, videoEndSec: true },
  });
  if (trophy) {
    await db.collectible.update({
      where: { id: trophy.id },
      data: { videoStartSec: 1798, videoEndSec: 1815 },
    });
    console.log(`✅ SSBB Trophy Luigi: ${trophy.videoStartSec}–${trophy.videoEndSec} → 1798–1815 (29:58–30:15)`);
  }
  await db.$disconnect();
}
main().catch(console.error);
