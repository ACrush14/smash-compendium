import { db } from "../../lib/db";

// Timestamps extraídos do full_video_brawl.mp4 em 2026-06-30
// Yoshi        #254/544 → 1:13:48 = 4428s
// Super Dragon #255/544 → 1:14:05 = 4445s

const FIXES = [
  { name: "Yoshi",        videoStartSec: 4428 },
  { name: "Super Dragon", videoStartSec: 4445 },
];

async function main() {
  for (const fix of FIXES) {
    const c = await db.collectible.findFirst({
      where: { name: fix.name, smashGameVersion: "SSBB" },
      select: { id: true, videoStartSec: true },
    });
    if (!c) { console.log(`⚠️  Não encontrado: ${fix.name} SSBB`); continue; }

    await db.collectible.update({
      where: { id: c.id },
      data: { videoStartSec: fix.videoStartSec },
    });
    console.log(`✅ ${fix.name} SSBB: ${c.videoStartSec ?? "null"} → ${fix.videoStartSec}s`);
  }

  await db.$disconnect();
}
main().catch(console.error);
