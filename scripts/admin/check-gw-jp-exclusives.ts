import { db } from "../../lib/db";

async function main() {
  // All JP EXCLUSIVE entries on Game & Watch
  const jpEntries = await db.chronicleEntry.findMany({
    where: {
      consoleName: "Game & Watch",
      OR: [
        { titleNtsc: "JP EXCLUSIVE" },
        { titleNtsc: "PAL EXCLUSIVE" },
      ],
    },
    select: {
      id: true,
      titleNtsc: true,
      titleJp: true,
      releaseDateJp: true,
      collectibleLinks: {
        select: {
          collectible: { select: { name: true, type: true, smashGameVersion: true } },
        },
        take: 3,
      },
      fighterLinks: {
        select: {
          fighter: { select: { name: true } },
        },
        take: 3,
      },
    },
    orderBy: { titleJp: "asc" },
  });

  console.log(`JP/PAL EXCLUSIVE no Game & Watch: ${jpEntries.length}\n`);

  // Which ones have a western counterpart already?
  const westernTitles = await db.chronicleEntry.findMany({
    where: {
      consoleName: "Game & Watch",
      titleNtsc: { not: { in: ["JP EXCLUSIVE", "PAL EXCLUSIVE"] } },
    },
    select: { titleNtsc: true },
  });
  const westernSet = new Set(westernTitles.map(e => e.titleNtsc));

  for (const e of jpEntries) {
    const collectibles = e.collectibleLinks.map(l => l.collectible.name).join(", ");
    const fighters = e.fighterLinks.map(l => l.fighter.name).join(", ");

    // Try to guess the game from titleJp
    const jpName = e.titleJp ?? "?";

    // Check if the JP title matches any western entry (normalized)
    const hasDuplicate = [...westernSet].some(w =>
      w?.toLowerCase().includes(jpName.toLowerCase().slice(0, 5))
    );

    console.log(
      `[${e.id.slice(-6)}] titleJp=${jpName.padEnd(30)} dateJp=${e.releaseDateJp ?? "?"}`
    );
    if (collectibles) console.log(`         collectibles: ${collectibles}`);
    if (fighters)    console.log(`         fighters: ${fighters}`);
  }

  await db.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
