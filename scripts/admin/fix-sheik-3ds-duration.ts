import { db } from "../../lib/db";

// Restaura o start original do vídeo 3DS (estava correto) e limita a duração a 10s
// "Sheik": start=1999 (original, antes de ser nulled) -> end = 1999+10 = 2009
// "Sheik (Alt.)": start=2010 (original) -> end = 2010+10 = 2020

async function main() {
  const main_ = await db.collectible.findFirst({
    where: { name: "Sheik", smashGameVersion: "SSB4", type: "TROPHY" },
    select: { id: true, videoStartSec2: true, videoEndSec2: true },
  });
  if (main_) {
    await db.collectible.update({
      where: { id: main_.id },
      data: { videoStartSec2: 1999, videoEndSec2: 2009 },
    });
    console.log(`✅ "Sheik" SSB4: videoStartSec2=1999, videoEndSec2=2009 (10s)`);
  }

  const alt = await db.collectible.findFirst({
    where: { name: "Sheik (Alt.)", smashGameVersion: "SSB4", type: "TROPHY" },
    select: { id: true, videoStartSec2: true, videoEndSec2: true },
  });
  if (alt) {
    await db.collectible.update({
      where: { id: alt.id },
      data: { videoStartSec2: 2010, videoEndSec2: 2020 },
    });
    console.log(`✅ "Sheik (Alt.)" SSB4: videoStartSec2=2010, videoEndSec2=2020 (10s)`);
  }

  await db.$disconnect();
}
main().catch(console.error);
