import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const f = await prisma.fighter.findFirst({ where: { name: { contains: "Inkling", mode: "insensitive" } }, include: { moves: true, tips: true } });
  console.log("Inkling moves count:", f?.moves.length);
  console.log("Inkling tips count:", f?.tips.length);

  // Check curator overview field name on Fighter
  const cols = await prisma.$queryRawUnsafe(`SELECT column_name FROM information_schema.columns WHERE table_name = 'Fighter'`);
  console.log(cols);
}
main().finally(()=>prisma.$disconnect());
