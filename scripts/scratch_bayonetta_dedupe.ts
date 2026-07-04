import { db } from "../lib/db";
async function main() {
  const keep = "cmqbe9wto001si2wmy5j3jjaq";
  const dup = "cmqeecwi3000lwa1jhjaua429";

  await db.chronicleEntry.delete({ where: { id: dup } });
  console.log(`✅ ChronicleEntry duplicado "${dup}" removido (FighterChronicleLink associado removido em cascata)`);

  const trophy = await db.collectible.findFirst({ where: { name: "Bayonetta (Original)", type: "TROPHY", smashGameVersion: "SSB4" }, select: { id: true } });
  if (trophy) {
    await db.collectibleChronicleLink.upsert({
      where: { collectibleId_chronicleEntryId: { collectibleId: trophy.id, chronicleEntryId: keep } },
      update: {},
      create: { collectibleId: trophy.id, chronicleEntryId: keep },
    });
    console.log(`✅ Trophy "Bayonetta (Original)" [SSB4]: linkado ao ChronicleEntry "Bayonetta" (PS3, 2009)`);
  }
  await db.$disconnect();
}
main().catch(console.error);
