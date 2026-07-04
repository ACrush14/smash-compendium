import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const fighter = await prisma.fighter.findFirst({
    where: { name: { contains: "Ridley", mode: "insensitive" } },
    include: {
      bios: true,
      moves: { orderBy: { order: "asc" } },
      tips: true,
    },
  });
  if (!fighter) {
    console.log("Fighter not found");
    return;
  }
  console.log("=== FIGHTER ===");
  console.log(fighter.id, fighter.name, fighter.slug, fighter.curationStatus);
  console.log("\n=== BIOS ===");
  for (const b of fighter.bios) {
    console.log(`--- ${b.smashGameVersion} ---`);
    console.log("EN:", b.contentEn?.slice(0, 300));
    console.log("JP:", b.contentJp?.slice(0, 300));
    console.log("PT:", b.contentPt?.slice(0, 300));
    console.log("JpEn:", b.contentJpEn?.slice(0, 300));
    console.log("video:", b.videoStartSec, b.videoEndSec);
  }
  console.log("\n=== MOVES ===");
  for (const m of fighter.moves) {
    console.log(`[${m.smashGameVersion} order=${m.order}] label=${m.label}`);
    console.log("  EN:", m.descEn?.slice(0, 200));
    console.log("  JP:", m.descJp?.slice(0, 200));
  }
  console.log("\n=== TIPS ===");
  for (const t of fighter.tips) {
    console.log(`title EN: ${t.titleEn}`);
    console.log(`  EN: ${t.textEn?.slice(0, 200)}`);
    console.log(`  JP: ${t.textJp?.slice(0, 150)}`);
  }

  console.log("\n=== TROPHIES/COLLECTIBLES ===");
  const trophies = await prisma.collectible.findMany({
    where: { fighterId: fighter.id, type: "TROPHY" },
    include: { chronicleLinks: { include: { chronicleEntry: true } } },
  });
  for (const t of trophies) {
    console.log(`- [${t.id}] ${t.name} (${t.smashGameVersion}) videoStart=${t.videoStartSec} videoEnd=${t.videoEndSec} videoStart2=${t.videoStartSec2} videoEnd2=${t.videoEndSec2}`);
    console.log(`  desc: ${t.descriptionEn?.slice(0,150)}`);
    console.log(`  descJp: ${t.descriptionJp?.slice(0,150)}`);
    for (const cl of t.chronicleLinks) {
      console.log(`    -> chronicle: ${cl.chronicleEntry?.title}`);
    }
  }

  console.log("\n=== CHRONICLE LINKS (fighter-level) ===");
  const fcl = await prisma.fighterChronicleLink.findMany({
    where: { fighterId: fighter.id },
    include: { chronicleEntry: true },
  });
  for (const l of fcl) {
    console.log(`- ${l.chronicleEntry?.title}`);
  }
}

main().finally(() => prisma.$disconnect());
