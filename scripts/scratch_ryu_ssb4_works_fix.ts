import { db } from "../lib/db";
async function main() {
  const trophy = await db.collectible.findFirst({ where: { name: "Ryu", type: "TROPHY", smashGameVersion: "SSB4" }, select: { id: true } });
  if (!trophy) { console.log("Ryu SSB4 trophy not found"); return; }

  const streetFighter1 = await db.chronicleEntry.findFirst({ where: { titleNtsc: "Street Fighter" }, select: { id: true, titleNtsc: true, consoleName: true, releaseDateNtsc: true } });
  if (!streetFighter1) { console.log("Street Fighter (1987) ChronicleEntry not found"); return; }
  console.log("Found ChronicleEntry:", streetFighter1);

  const link = await db.collectibleChronicleLink.upsert({
    where: { collectibleId_chronicleEntryId: { collectibleId: trophy.id, chronicleEntryId: streetFighter1.id } },
    update: {},
    create: { collectibleId: trophy.id, chronicleEntryId: streetFighter1.id },
  });
  console.log("✅ Link criado/confirmado:", link);
  await db.$disconnect();
}
main().catch(console.error);
