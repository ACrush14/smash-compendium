import { db } from "../lib/db";
async function main() {
  const r1 = await db.collectible.updateMany({ where: { name: "Mii Swordfighter Mii Sword Fighter", type: "TROPHY", smashGameVersion: "SSB4" }, data: { name: "Mii Swordfighter" } });
  const r2 = await db.collectible.updateMany({ where: { name: "Mii Swordfighter (Alt.) Mii Sword Fighter (Alt.)", type: "TROPHY", smashGameVersion: "SSB4" }, data: { name: "Mii Swordfighter (Alt.)" } });
  console.log(`Renamed: main=${r1.count}, alt=${r2.count}`);
  await db.$disconnect();
}
main().catch(console.error);
