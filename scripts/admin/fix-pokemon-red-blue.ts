import { db } from "../../lib/db";

async function main() {
  const entry = await db.chronicleEntry.findFirst({ where: { titleNtsc: "Pokémon Red & Pokémon Blue" } });
  if (!entry) { console.log("NOT FOUND"); process.exit(1); }
  console.log("Found:", entry.id, entry.consoleName);
  await db.chronicleEntry.update({
    where: { id: entry.id },
    data: { consoleName: "Game Boy", releaseDateNtsc: "09/28/1998" },
  });
  console.log("OK → Game Boy, 09/28/1998");
  await db.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
