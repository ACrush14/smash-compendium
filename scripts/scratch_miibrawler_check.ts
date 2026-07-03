import { db } from "../lib/db";
async function main() {
  const fighters = await db.fighter.findMany({
    where: { name: { contains: "Mii" } },
    select: { id: true, name: true, curationStatus: true, rosterNumber: true },
  });
  console.log("Fighters matching 'Mii':", fighters);

  for (const f of fighters) {
    const full = await db.fighter.findFirst({
      where: { id: f.id },
      select: {
        id: true, name: true, curationStatus: true, curatorOverviewEn: true,
        bios: { select: { id: true, smashGameVersion: true, contentEn: true, contentJp: true, contentPt: true, contentJpEn: true, videoStartSec: true, videoEndSec: true } },
        moves: { select: { id: true, smashGameVersion: true, label: true, order: true, descEn: true, descJp: true, descPt: true, descJpEn: true }, orderBy: [{ smashGameVersion: "asc" }, { order: "asc" }] },
        tips: { select: { id: true, titleEn: true, titleJp: true }, orderBy: { id: "asc" } },
      },
    });
    console.log(`\n=== ${full?.name} (${full?.id}) status=${full?.curationStatus} ===`);
    console.log(`Curator EN: ${full?.curatorOverviewEn ? "SET" : "empty"}`);
    console.log(`Bios (${full?.bios.length}):`);
    full?.bios.forEach(b => console.log(`  [${b.smashGameVersion}] en:${!!b.contentEn} pt:${!!b.contentPt} jp:${!!b.contentJp} jpen:${!!b.contentJpEn} vid:${b.videoStartSec}-${b.videoEndSec}`));
    console.log(`Moves (${full?.moves.length}):`);
    full?.moves.forEach(m => console.log(`  [${m.smashGameVersion}] "${m.label}" (${m.order}) en:${!!m.descEn} pt:${!!m.descPt} jp:${!!m.descJp} jpen:${!!m.descJpEn}`));
    console.log(`Tips (${full?.tips.length}):`);
    full?.tips.forEach(t => console.log(`  "${t.titleEn}" jp:${!!t.titleJp}`));
  }

  const ssb4 = await db.collectible.findMany({ where: { name: { contains: "Mii" }, type: "TROPHY", smashGameVersion: { in: ["SSB4", "SSB4_WIIU", "SSB4_3DS"] } }, select: { name: true, smashGameVersion: true, videoStartSec: true, videoEndSec: true, videoStartSec2: true, videoEndSec2: true, posicaoTrofeuSsb4: true, fighterId: true } });
  console.log(`\nSSB4 Trophies with 'Mii' (${ssb4.length}):`);
  ssb4.forEach(t => console.log(`  [${t.smashGameVersion}] pos=${t.posicaoTrofeuSsb4} "${t.name}": ${t.videoStartSec}-${t.videoEndSec} | 2: ${t.videoStartSec2}-${t.videoEndSec2} fighterId:${t.fighterId}`));

  await db.$disconnect();
}
main().catch(console.error);
