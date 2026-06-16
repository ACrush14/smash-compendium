import { db } from "../../lib/db";

async function main() {
  const total  = await db.chronicleEntry.count();
  const noDate = await db.chronicleEntry.count({ where: { releaseDateNtsc: null } });
  const noArt  = await db.chronicleEntry.count({ where: { boxArtUrl: null } });
  const noWiki = await db.chronicleEntry.count({ where: { wikiUrl: null } });
  const noJp   = await db.chronicleEntry.count({ where: { titleJp: null } });

  console.log(`Total entries    : ${total}`);
  console.log(`Sem releaseDate  : ${noDate} (${((noDate/total)*100).toFixed(1)}%)`);
  console.log(`Sem boxArtUrl    : ${noArt} (${((noArt/total)*100).toFixed(1)}%)`);
  console.log(`Sem wikiUrl      : ${noWiki} (${((noWiki/total)*100).toFixed(1)}%)`);
  console.log(`Sem titleJp      : ${noJp} (${((noJp/total)*100).toFixed(1)}%)`);

  // Check if scraping job has started filling fields
  const withDate = await db.chronicleEntry.count({ where: { releaseDateNtsc: { not: null } } });
  const withArt  = await db.chronicleEntry.count({ where: { boxArtUrl: { not: null } } });
  const withWiki = await db.chronicleEntry.count({ where: { wikiUrl: { not: null } } });
  const withJp   = await db.chronicleEntry.count({ where: { titleJp: { not: null } } });

  console.log(`\nPreenchidos:`);
  console.log(`Com releaseDate  : ${withDate}`);
  console.log(`Com boxArtUrl    : ${withArt}`);
  console.log(`Com wikiUrl      : ${withWiki}`);
  console.log(`Com titleJp      : ${withJp}`);

  await db.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
