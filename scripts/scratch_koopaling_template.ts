import { db } from "../lib/db";
async function main() {
  const larry = await db.collectible.findFirst({ where: { name: "Larry", type: "TROPHY", smashGameVersion: "SSB4" } });
  console.log(JSON.stringify(larry, null, 2));
  await db.$disconnect();
}
main().catch(console.error);
