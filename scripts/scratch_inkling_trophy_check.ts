import { db } from "../lib/db";
async function main() {
  const trophies = await db.collectible.findMany({ where: { fighter: { name: "Inkling" } }, select: { id: true, name: true, type: true, smashGameVersion: true, videoStartSec: true, videoEndSec: true, videoStartSec2: true, videoEndSec2: true } });
  trophies.forEach(t => console.log(t));
  await db.$disconnect();
}
main().catch(console.error);
