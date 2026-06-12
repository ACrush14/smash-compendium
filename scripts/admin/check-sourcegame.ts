import { db } from "../../lib/db";

async function main() {
  const count = await db.collectible.count({ where: { type: "STICKER" } });
  console.log("DB OK, stickers:", count);
  try {
    const res = await db.$queryRaw`SELECT "sourceGame" FROM "Collectible" LIMIT 1`;
    console.log("sourceGame column EXISTS:", res);
  } catch (e: any) {
    console.log("sourceGame MISSING:", e.message?.substring(0, 100));
  }
}
main().catch(console.error);
