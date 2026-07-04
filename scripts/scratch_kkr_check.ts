import { db } from "../lib/db";

async function main() {
  const f = await db.fighter.findFirst({
    where: { name: { contains: "King K", mode: "insensitive" } },
    include: { bios: true, tips: true, moves: true },
  });
  if (!f) { console.log("NOT FOUND"); return; }
  console.log(`=== ${f.name} (id=${f.id}, roster=${f.rosterNumber}, status=${f.curationStatus}) ===`);
  console.log("--- BIOS ---");
  for (const b of f.bios) {
    console.log(`[${b.smashGameVersion}] video=${b.videoStartSec}-${b.videoEndSec}`);
    console.log(`EN: ${b.contentEn?.slice(0,200)}`);
    console.log(`JP: ${b.contentJp?.slice(0,150)}`);
    console.log(`PT: ${b.contentPt?.slice(0,60)}  JpEn: ${b.contentJpEn?.slice(0,60)}`);
  }
  console.log("--- MOVES ---", f.moves.length);
  console.log("--- TIPS ---", f.tips.length);
  for (const t of f.tips) {
    console.log(`titleEn: ${t.titleEn}`);
    console.log(`  EN: ${t.textEn}`);
  }

  const trophies = await db.collectible.findMany({
    where: { fighterId: f.id, type: "TROPHY" },
    include: { chronicleLinks: { include: { chronicleEntry: true } } },
  });
  console.log("\n--- TROPHIES ---");
  for (const t of trophies) {
    console.log(`[${t.id}] ${t.name} (${t.smashGameVersion}) video=${t.videoStartSec}-${t.videoEndSec} video2=${t.videoStartSec2}-${t.videoEndSec2}`);
    for (const cl of t.chronicleLinks) console.log(`   -> ${cl.chronicleEntry.titleNtsc}`);
  }
  const fcl = await db.fighterChronicleLink.findMany({ where: { fighterId: f.id }, include: { chronicleEntry: true } });
  console.log("FighterChronicleLinks:", fcl.map(l => l.chronicleEntry.titleNtsc).join(", "));
}
main().finally(() => db.$disconnect());
