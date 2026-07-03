import { db } from "../lib/db";
async function main() {
  const r = await db.fighter.updateMany({
    where: { name: { in: ["Mii Brawler", "Mii Swordfighter", "Mii Gunner"] } },
    data: { curationStatus: "approved" },
  });
  console.log(`✅ ${r.count} Mii Fighters approved`);
  await db.$disconnect();
}
main().catch(console.error);
