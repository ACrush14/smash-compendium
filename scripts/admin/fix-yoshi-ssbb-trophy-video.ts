import { db } from "../../lib/db";

// Timestamps extraídos do full_video_brawl.mp4 em 2026-06-30
// Yoshi        #254/544 → 1:13:48–1:14:05 = 4428–4445s
// Super Dragon #255/544 → 1:14:05–1:14:22 = 4445–4462s (fim estimado)

const FIXES = [
  { name: "Yoshi",        videoStartSec: 4428, videoEndSec: 4445 },
  { name: "Super Dragon", videoStartSec: 4445, videoEndSec: 4462 },
];

async function main() {
  for (const fix of FIXES) {
    const c = await db.collectible.findFirst({
      where: { name: fix.name, smashGameVersion: "SSBB", type: "TROPHY" },
      select: { id: true, videoStartSec: true, videoEndSec: true },
    });
    if (!c) { console.log(`⚠️  Não encontrado: TROPHY ${fix.name} SSBB`); continue; }

    await db.collectible.update({
      where: { id: c.id },
      data: { videoStartSec: fix.videoStartSec, videoEndSec: fix.videoEndSec },
    });
    console.log(`✅ TROPHY ${fix.name} SSBB: ${c.videoStartSec}–${c.videoEndSec} → ${fix.videoStartSec}–${fix.videoEndSec}s`);
  }

  await db.$disconnect();
}
main().catch(console.error);
