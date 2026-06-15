import { db } from "../../lib/db";

async function main() {
  const entry = await db.chronicleEntry.findFirst({ where: { titleNtsc: "Future Release" }, select: { id: true } });
  if (!entry) { console.log("NOT FOUND"); process.exit(1); }
  await db.chronicleEntry.update({
    where: { id: entry.id },
    data: {
      titleNtsc: "Cubivore: Survival of the Fittest",
      consoleName: "Nintendo GameCube",
      releaseDateNtsc: "11/11/2002",
    },
  });
  console.log("OK — Cubivore: Survival of the Fittest [Nintendo GameCube] 11/11/2002");
  await db.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
