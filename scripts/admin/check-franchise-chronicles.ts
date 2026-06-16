import { db } from "../../lib/db";

// Verifica quais ChronicleEntries existem por série
const SERIES = [
  "Kingdom Hearts", "Star Fox", "Starwing", "Lylat Wars",
  "Kirby", "Kid Icarus", "Donkey Kong Country", "Donkey Kong 64",
  "Donkey Kong Land", "Fire Emblem", "Metroid", "Xenoblade",
  "Bayonetta", "Persona", "Mega Man", "Mega Man X", "Street Fighter",
  "Castlevania", "Pac-Man", "Sonic", "Dragon Quest", "Final Fantasy",
  "Banjo", "Animal Crossing", "F-Zero", "Pikmin", "EarthBound",
  "Mother", "WarioWare", "Wario Land", "Ice Climber", "Game & Watch",
  "Punch-Out", "Duck Hunt", "R.O.B", "Mii",
];

(async () => {
  for (const keyword of SERIES) {
    const entries = await db.chronicleEntry.findMany({
      where: { titleNtsc: { contains: keyword, mode: "insensitive" } },
      select: { titleNtsc: true, consoleName: true },
      orderBy: { releaseDateNtsc: "asc" },
    });
    if (entries.length === 0) continue;
    console.log(`\n── ${keyword} (${entries.length}) ──`);
    entries.forEach(e => console.log(`  ${e.titleNtsc} [${e.consoleName}]`));
  }
  await db.$disconnect();
})().catch(e => { console.error(e); process.exit(1); });
