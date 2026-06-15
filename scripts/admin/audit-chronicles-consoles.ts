import { db } from "../../lib/db";

async function main() {
  const consoles = [
    "Nintendo GameCube",
    "Nintendo 64",
    "Super Nintendo Entertainment System",
    "Nintendo Entertainment System",
    "Wii",
    "Wii U",
    "Nintendo Switch",
    "GAME BOY ADVANCE",
    "GAME BOY",
    "Nintendo DS",
    "Nintendo 3DS",
  ];

  for (const con of consoles) {
    const entries = await db.chronicleEntry.findMany({
      where: { consoleName: con },
      select: { titleNtsc: true, titleJp: true, releaseDateNtsc: true },
      orderBy: { titleNtsc: "asc" },
    });
    console.log(`\n=== ${con} (${entries.length}) ===`);
    for (const e of entries) {
      const title = e.titleNtsc ?? e.titleJp ?? "?";
      const date  = e.releaseDateNtsc ?? "no date";
      console.log(`  ${title.padEnd(50)} ${date}`);
    }
  }

  await db.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
