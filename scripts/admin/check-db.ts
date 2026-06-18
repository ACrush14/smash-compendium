import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
async function run() {
  const media = await db.collectible.findMany({ where: { type: 'MEDIA', smashGameVersion: 'SSBM' } });
  console.log(media);
}
run().finally(() => db.$disconnect());
