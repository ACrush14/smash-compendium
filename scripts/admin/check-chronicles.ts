import { db } from "../../lib/db";

async function main() {
  const total    = await db.chronicleEntry.count();
  const unknown  = await db.chronicleEntry.count({ where: { consoleName: "Unknown" } });
  const noDate   = await db.chronicleEntry.count({ where: { releaseDateNtsc: null, releaseDateJp: null } });
  const noArt    = await db.chronicleEntry.count({ where: { boxArtUrl: null } });
  const noWiki   = await db.chronicleEntry.count({ where: { wikiUrl: null } });
  const noTitleJp = await db.chronicleEntry.count({ where: { titleJp: null } });

  const consoles = await db.chronicleEntry.groupBy({
    by: ["consoleName"],
    _count: true,
    orderBy: { _count: { consoleName: "desc" } },
  });

  console.log("=== CHRONICLES HEALTH ===");
  console.log(`Total entries     : ${total}`);
  console.log(`consoleName=Unknown: ${unknown}`);
  console.log(`Sem data (ntsc+jp): ${noDate}`);
  console.log(`Sem boxArtUrl     : ${noArt}`);
  console.log(`Sem wikiUrl       : ${noWiki}`);
  console.log(`Sem titleJp       : ${noTitleJp}`);

  console.log("\n=== CONSOLES ===");
  for (const c of consoles) {
    console.log(`  ${String(c._count).padStart(4)}  ${c.consoleName}`);
  }

  // Mostrar as 30 entradas Unknown
  if (unknown > 0) {
    const unknownEntries = await db.chronicleEntry.findMany({
      where: { consoleName: "Unknown" },
      select: { id: true, titleNtsc: true, titleJp: true, releaseDateNtsc: true },
      orderBy: { titleNtsc: "asc" },
    });
    console.log(`\n=== ENTRIES com consoleName="Unknown" (${unknown}) ===`);
    for (const e of unknownEntries) {
      console.log(`  [${e.id.slice(-6)}] ${e.titleNtsc ?? e.titleJp ?? "?"}  date=${e.releaseDateNtsc ?? "null"}`);
    }
  }

  // Consoles suspeitos (valores estranhos)
  const suspicious = consoles.filter(c =>
    c.consoleName !== "Unknown" &&
    !["Nintendo Entertainment System","Super Nintendo Entertainment System","Nintendo 64",
      "Nintendo GameCube","Wii","Nintendo DS","Nintendo 3DS","Wii U","Nintendo Switch",
      "Game Boy","Game Boy Color","Game Boy Advance","Arcade","PC","Virtual Boy",
      "Nintendo 64DD","Satellaview","Game & Watch","Nintendo Switch 2"].includes(c.consoleName)
  );
  if (suspicious.length) {
    console.log(`\n=== CONSOLES SUSPEITOS (${suspicious.length}) ===`);
    for (const c of suspicious) {
      console.log(`  ${String(c._count).padStart(4)}  "${c.consoleName}"`);
    }
  }

  await db.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
