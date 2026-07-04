import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const f = await prisma.fighter.findFirst({ where: { name: { contains: "Ridley", mode: "insensitive" } } });
  console.log("curatorOverviewEn:", f?.curatorOverviewEn);
  console.log("curatorOverviewJp:", f?.curatorOverviewJp);
  console.log("curatorOverviewPt:", f?.curatorOverviewPt);
  console.log("curatorOverviewJpEn:", f?.curatorOverviewJpEn);
  console.log("rosterNumber:", f?.rosterNumber);

  // Chronicle entries for Metroid
  const entries = await prisma.chronicleEntry.findMany({ where: { titleNtsc: { contains: "Metroid", mode: "insensitive" } } });
  for (const e of entries) console.log("ChronicleEntry:", e.id, e.titleNtsc, e.releaseDateNtsc, e.consoleName);

  const fighter = await prisma.fighter.findFirst({ where: { name: { contains: "Ridley", mode: "insensitive" } } });
  const fcl = await prisma.fighterChronicleLink.findMany({ where: { fighterId: fighter!.id }, include: { chronicleEntry: true } });
  console.log("\nFighterChronicleLinks:");
  for (const l of fcl) console.log("-", l.chronicleEntry.titleNtsc, l.chronicleEntry.consoleName);

  const trophies = await prisma.collectible.findMany({ where: { fighterId: fighter!.id, type: "TROPHY" }, include: { chronicleLinks: { include: { chronicleEntry: true } } } });
  console.log("\nTrophy chronicle links:");
  for (const t of trophies) {
    console.log(`- ${t.name}:`, t.chronicleLinks.map(cl => cl.chronicleEntry.titleNtsc));
  }
}
main().finally(()=>prisma.$disconnect());
