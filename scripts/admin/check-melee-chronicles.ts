import { db } from "../../lib/db";

async function main() {
  // Melee trophies totals
  const total        = await db.collectible.count({ where: { type: "TROPHY", smashGameVersion: "SSBM" } });
  const withLinks    = await db.collectible.count({ where: { type: "TROPHY", smashGameVersion: "SSBM", chronicleLinks: { some: {} } } });
  const withoutLinks = await db.collectible.count({ where: { type: "TROPHY", smashGameVersion: "SSBM", chronicleLinks: { none: {} } } });

  console.log("=== MELEE TROPHIES ===");
  console.log(`Total trophies    : ${total}`);
  console.log(`Com ChronicleLink : ${withLinks}`);
  console.log(`Sem ChronicleLink : ${withoutLinks}`);

  // For entries linked to Melee trophies — check boxArtUrl coverage
  const linkedEntries = await db.chronicleEntry.findMany({
    where: { collectibleLinks: { some: { collectible: { smashGameVersion: "SSBM" } } } },
    select: { id: true, titleNtsc: true, consoleName: true, boxArtUrl: true, wikiUrl: true, releaseDateNtsc: true },
    orderBy: { consoleName: "asc" },
  });
  const withArt  = linkedEntries.filter(e => e.boxArtUrl).length;
  const withWiki = linkedEntries.filter(e => e.wikiUrl).length;

  console.log(`\n=== ChronicleEntries linkadas a Melee trophies ===`);
  console.log(`Total entradas    : ${linkedEntries.length}`);
  console.log(`Com boxArtUrl     : ${withArt}`);
  console.log(`Sem boxArtUrl     : ${linkedEntries.length - withArt}`);
  console.log(`Com wikiUrl       : ${withWiki}`);
  console.log(`Sem wikiUrl       : ${linkedEntries.length - withWiki}`);

  // Sample of entries without box art
  const noArt = linkedEntries.filter(e => !e.boxArtUrl).slice(0, 20);
  console.log(`\n=== Sem boxArt (primeiros 20) ===`);
  noArt.forEach(e => console.log(`  [${e.consoleName.padEnd(35)}] ${e.titleNtsc}`));

  // Trophies with no chronicle link at all — show first 20 with sourceGame
  const unlinked = await db.collectible.findMany({
    where: { type: "TROPHY", smashGameVersion: "SSBM", chronicleLinks: { none: {} } },
    select: { name: true, sourceGame: true },
    orderBy: { name: "asc" },
    take: 20,
  });
  console.log(`\n=== Trophies sem nenhum ChronicleLink (primeiros 20) ===`);
  unlinked.forEach(t => console.log(`  ${t.name.padEnd(30)} sourceGame: ${t.sourceGame ?? "null"}`));

  await db.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
