import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const e = await prisma.chronicleEntry.findMany({ where: { titleNtsc: { contains: "JP EXCLUSIVE", mode: "insensitive" } } });
  console.log(JSON.stringify(e, null, 2));
}
main().finally(()=>prisma.$disconnect());
