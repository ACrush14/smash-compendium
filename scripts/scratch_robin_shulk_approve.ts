import { db } from "../lib/db";
async function main() {
  const r = await db.fighter.updateMany({
    where: { name: { in: ["Robin", "Shulk"] } },
    data: { curationStatus: "approved" },
  });
  console.log(`✅ ${r.count} fighters approved`);
  await db.$disconnect();
}
main().catch(console.error);
