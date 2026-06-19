import { db } from '../../lib/db';
async function main() {
  const t = await db.collectible.findFirst({
    where: { type: 'TROPHY', smashGameVersion: 'SSBM', assetRender2Url: { not: null } },
    select: { name: true, assetRender2Url: true },
  });
  console.log(t?.name, '|', t?.assetRender2Url);
}
main().catch(console.error).finally(() => db.$disconnect());
