import { db } from "../lib/db";
async function main() {
  const trophies = await db.collectible.findMany({
    where: { fighter: { name: "Ryu" }, type: "TROPHY", smashGameVersion: "SSB4" },
    select: {
      id: true, name: true,
      chronicleLinks: { select: { chronicleEntry: { select: { id: true, titleNtsc: true, consoleName: true, releaseDateNtsc: true } } } },
    },
  });
  trophies.forEach(t => {
    console.log(`Trophy "${t.name}" (${t.id}) chronicleLinks:`);
    t.chronicleLinks.forEach(cl => console.log(`  -> "${cl.chronicleEntry.titleNtsc}" [${cl.chronicleEntry.consoleName}] ${cl.chronicleEntry.releaseDateNtsc}`));
  });
  await db.$disconnect();
}
main().catch(console.error);
