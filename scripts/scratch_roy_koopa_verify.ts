import { db } from "../lib/db";
async function main() {
  const r = await db.collectible.findFirst({ where: { id: "TROPHY-SSB4-RoyKoopa" } });
  console.log(JSON.stringify(r, null, 2));
  await db.$disconnect();
}
main().catch(console.error);
