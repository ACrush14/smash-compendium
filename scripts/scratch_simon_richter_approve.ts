import { db } from "../lib/db";

async function main() {
  const simon = await db.fighter.update({ where: { id: (await db.fighter.findFirstOrThrow({ where: { name: "Simon" } })).id }, data: { curationStatus: "approved" } });
  console.log("✅ Simon aprovado");
  const richter = await db.fighter.update({ where: { id: (await db.fighter.findFirstOrThrow({ where: { name: "Richter" } })).id }, data: { curationStatus: "approved" } });
  console.log("✅ Richter aprovado");
  await db.$disconnect();
}
main().catch(console.error);
