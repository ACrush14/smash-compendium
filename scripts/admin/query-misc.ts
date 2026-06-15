import { db } from "../../lib/db";

async function main() {
  const others = await db.chronicleEntry.findMany({ where: { consoleName: "Others" }, select: { id: true, titleNtsc: true, titleJp: true } });
  console.log("=== Others (4) ===");
  others.forEach(e => console.log("  " + (e.titleNtsc ?? e.titleJp)));

  const tcg = await db.chronicleEntry.findMany({ where: { consoleName: "TCG" }, select: { id: true, titleNtsc: true, titleJp: true } });
  console.log("\n=== TCG (2) ===");
  tcg.forEach(e => console.log("  " + (e.titleNtsc ?? e.titleJp)));

  const ps = await db.chronicleEntry.findMany({ where: { consoleName: "PlayStation" }, select: { id: true, titleNtsc: true, titleJp: true } });
  console.log("\n=== PlayStation (2) (vs PlayStation 1 = 10) ===");
  ps.forEach(e => console.log("  " + (e.titleNtsc ?? e.titleJp)));

  const ps1 = await db.chronicleEntry.findMany({ where: { consoleName: "PlayStation 1" }, select: { titleNtsc: true } });
  console.log("\n=== PlayStation 1 (10) ===");
  ps1.forEach(e => console.log("  " + e.titleNtsc));

  await db.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
