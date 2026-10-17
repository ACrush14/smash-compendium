import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const trophy = await prisma.collectible.findUnique({ where: { id: "TROPHY-SSBB-Ridley-Ridley" }, include: { chronicleLinks: { include: { chronicleEntry: true } } } });
  console.log(JSON.stringify(trophy?.chronicleLinks.map(l => ({ id: l.chronicleEntryId, title: l.chronicleEntry.titleNtsc, console: l.chronicleEntry.consoleName, releaseDate: l.chronicleEntry.releaseDateNtsc })), null, 2));

  const metroidEntry = await prisma.chronicleEntry.findFirst({ where: { titleJpEn: "Metroid" } });
  console.log("Metroid (NES) entry:", metroidEntry?.id, metroidEntry?.titleNtsc, metroidEntry?.consoleName);
}
main().finally(()=>prisma.$disconnect());
