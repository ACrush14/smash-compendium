import { db } from "../lib/db";
async function main() {
  const f = await db.fighter.update({ where: { name: "Bayonetta" }, data: { curationStatus: "approved" } });
  console.log(`✅ ${f.name}: curationStatus=${f.curationStatus}`);
  await db.$disconnect();
}
main().catch(console.error);
