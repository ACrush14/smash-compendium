import { db } from "../../lib/db";

async function main() {
  const cols = await (db as any).$queryRawUnsafe(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'Collectible' AND column_name IN ('assetRender2Url')
  `);
  const tbls = await (db as any).$queryRawUnsafe(`
    SELECT table_name FROM information_schema.tables
    WHERE table_name = 'CollectibleRelation'
  `);
  console.log("assetRender2Url column:", JSON.stringify(cols));
  console.log("CollectibleRelation table:", JSON.stringify(tbls));
  await db.$disconnect();
}
main().catch(console.error);
