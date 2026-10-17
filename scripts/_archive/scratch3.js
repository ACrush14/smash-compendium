const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function r() {
  const u = await db.chronicleEntry.findMany({ where: { consoleName: 'Unknown' }, select: { titleNtsc: true } });
  console.log(u.map(x => x.titleNtsc).join('\n'));
}

r().finally(() => process.exit(0));
