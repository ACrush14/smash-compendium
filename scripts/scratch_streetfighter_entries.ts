import { db } from "../lib/db";
async function main() {
  const entries = await db.chronicleEntry.findMany({ where: { titleNtsc: { contains: "Street Fighter" } }, select: { id: true, titleNtsc: true, consoleName: true, releaseDateNtsc: true, releaseDateJp: true } });
  entries.forEach(e => console.log(e));
  await db.$disconnect();
}
main().catch(console.error);
