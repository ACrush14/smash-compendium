import { db } from "../../lib/db";

async function main() {
  const sora = await db.fighter.findFirst({ where: { name: { contains: "Sora", mode: "insensitive" } } });
  const kazuya = await db.fighter.findFirst({ where: { name: { contains: "Kazuya", mode: "insensitive" } } });
  const mythra = await db.fighter.findFirst({ where: { name: { contains: "Mythra", mode: "insensitive" } } });
  if (!sora || !kazuya || !mythra) { console.log("Missing fighter(s)", { sora: !!sora, kazuya: !!kazuya, mythra: !!mythra }); return; }

  // Highest first to avoid transient collisions.
  await db.fighter.update({ where: { id: sora.id }, data: { rosterNumber: "82" } });
  await db.fighter.update({ where: { id: kazuya.id }, data: { rosterNumber: "81" } });
  await db.fighter.update({ where: { id: mythra.id }, data: { rosterNumber: "80" } });

  console.log("✅ Sora 81->82, Kazuya 80->81, Mythra 79e->80 (Pyra/Mythra are separate fighters, not Echo Fighters)");
  await db.$disconnect();
}
main().catch(console.error);
