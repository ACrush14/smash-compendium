import { db } from "../lib/db";
async function main() {
  const f = await db.fighter.findFirst({
    where: { name: "Inkling" },
    select: {
      id: true, name: true, curationStatus: true, rosterNumber: true,
      curatorOverviewEn: true,
      bios: { select: { id: true, smashGameVersion: true, contentEn: true, contentJp: true, contentPt: true, contentJpEn: true, videoStartSec: true, videoEndSec: true }, orderBy: { smashGameVersion: "asc" } },
      moves: { select: { id: true, smashGameVersion: true, label: true, order: true, descEn: true, descJp: true, descPt: true, descJpEn: true }, orderBy: [{ smashGameVersion: "asc" }, { order: "asc" }] },
      tips: { select: { id: true, titleEn: true, titleJp: true }, orderBy: { id: "asc" } },
    },
  });
  if (!f) { console.log("Inkling not found"); return; }
  console.log(`=== ${f.name} (${f.id}) status=${f.curationStatus} roster=${f.rosterNumber} ===`);
  console.log(`Curator EN: ${f.curatorOverviewEn ? "SET" : "empty"}`);
  console.log(`\nBios (${f.bios.length}):`);
  for (const b of f.bios) console.log(`  [${b.smashGameVersion}] en:${!!b.contentEn} pt:${!!b.contentPt} jp:${!!b.contentJp} jpen:${!!b.contentJpEn} vid:${b.videoStartSec}-${b.videoEndSec}`);
  console.log(`\nMoves (${f.moves.length}):`);
  for (const m of f.moves) console.log(`  [${m.smashGameVersion}] "${m.label}" (${m.order}) en:${!!m.descEn} pt:${!!m.descPt} jp:${!!m.descJp} jpen:${!!m.descJpEn}`);
  console.log(`\nTips (${f.tips.length}):`);
  for (const t of f.tips) console.log(`  "${t.titleEn}" jp:${!!t.titleJp}`);
  await db.$disconnect();
}
main().catch(console.error);
