import { db } from '../../lib/db';

async function main() {
  await db.$executeRawUnsafe(`ALTER TABLE "Collectible" ADD COLUMN IF NOT EXISTS "videoStartSec2" INTEGER`);
  await db.$executeRawUnsafe(`ALTER TABLE "Collectible" ADD COLUMN IF NOT EXISTS "videoEndSec2" INTEGER`);
  console.log('✅ Colunas videoStartSec2 / videoEndSec2 adicionadas');
}

main().catch(console.error).finally(() => db.$disconnect());
