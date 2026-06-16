import { db } from "../../lib/db";
(async () => {
  const peach = await db.fighter.findFirst({ where: { name: { contains: "Peach" } } });
  console.log("Peach:", peach?.name ?? "NOT FOUND");

  const kh = await db.chronicleEntry.findMany({
    where: { titleNtsc: { contains: "Kingdom Hearts", mode: "insensitive" } },
    select: { id: true, titleNtsc: true, consoleName: true },
  });
  console.log("\nKH no DB:", kh.length);
  kh.forEach(e => console.log(" ", e.titleNtsc, "[" + e.consoleName + "]"));

  const xd = await db.chronicleEntry.findMany({
    where: { titleNtsc: { contains: "Pokémon XD", mode: "insensitive" } },
    select: { titleNtsc: true },
  });
  console.log("\nPokémon XD entries:", xd.map(e => e.titleNtsc).join(", "));
  await db.$disconnect();
})().catch(e => { console.error(e); process.exit(1); });
