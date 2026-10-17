import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function run() {
  const c = await db.chronicleEntry.groupBy({ by: ['consoleName'], _count: true });
  console.log(c.map(x => x.consoleName).join('\n'));
}

run().finally(() => db.$disconnect());
