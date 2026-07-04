import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const e = await prisma.chronicleEntry.findUnique({ where: { id: "cmq2etg20005a147kpwjbc6xb" } });
  console.log(JSON.stringify(e, null, 2));
}
main().finally(()=>prisma.$disconnect());
