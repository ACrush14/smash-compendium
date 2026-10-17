import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const f = await prisma.fighter.findFirst({ where: { name: { contains: "Ridley", mode: "insensitive" } }, include: { tips: true, bios: true } });
  for (const t of f!.tips) {
    console.log("=== " + t.titleEn + " ===");
    console.log(t.textEn);
    console.log();
  }
  console.log("\n\n=== BIOS FULL ===");
  for (const b of f!.bios) {
    console.log(`--- ${b.smashGameVersion} ---`);
    console.log(b.contentEn);
    console.log();
  }
}
main().finally(()=>prisma.$disconnect());
