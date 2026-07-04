import { db } from "../lib/db";
async function main() {
  const updated = await db.chronicleEntry.update({
    where: { id: "cmqbe96ha001bi2wmrn5054e0" },
    data: { consoleName: "Arcade" },
  });
  console.log("✅", updated.titleNtsc, "->", updated.consoleName, updated.releaseDateNtsc);
  await db.$disconnect();
}
main().catch(console.error);
