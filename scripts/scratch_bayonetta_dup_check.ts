import { db } from "../lib/db";
async function main() {
  for (const id of ["cmqeecwi3000lwa1jhjaua429", "cmqbe9wto001si2wmy5j3jjaq"]) {
    const fLinks = await db.fighterChronicleLink.count({ where: { chronicleEntryId: id } });
    const cLinks = await db.collectibleChronicleLink.count({ where: { chronicleEntryId: id } });
    console.log(`${id}: FighterChronicleLink=${fLinks}, CollectibleChronicleLink=${cLinks}`);
  }
  await db.$disconnect();
}
main().catch(console.error);
