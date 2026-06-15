import { db } from "../../lib/db";

async function main() {
  const total = await db.fighterBio.count();
  const withEn = total; // contentEn é NOT NULL no schema
  // Para campos String? nullable no PostgreSQL, usamos "not: null" via raw
  const withJp   = (await db.$queryRaw<[{c:bigint}]>`SELECT COUNT(*) as c FROM "FighterBio" WHERE "contentJp" IS NOT NULL`)[0]!.c;
  const withPt   = (await db.$queryRaw<[{c:bigint}]>`SELECT COUNT(*) as c FROM "FighterBio" WHERE "contentPt" IS NOT NULL`)[0]!.c;
  const withJpEn = (await db.$queryRaw<[{c:bigint}]>`SELECT COUNT(*) as c FROM "FighterBio" WHERE "contentJpEn" IS NOT NULL`)[0]!.c;

  console.log("=== FighterBio coverage ===");
  console.log(`Total bios:      ${total}`);
  console.log(`com contentEn:   ${withEn}  | sem: ${total - withEn}`);
  console.log(`com contentJp:   ${withJp}`);
  console.log(`com contentPt:   ${withPt}  (traduzidos PT)`);
  console.log(`com contentJpEn: ${withJpEn}`);

  console.log("\n=== Fighters with 0 bios ===");
  const fighters = await db.fighter.findMany({
    orderBy: { rosterNumber: "asc" },
    include: { bios: { select: { smashGameVersion: true, contentEn: true, contentJp: true } } },
  });
  const noBios = fighters.filter(f => f.bios.length === 0);
  if (noBios.length === 0) {
    console.log("Nenhum — todos têm bios!");
  } else {
    for (const f of noBios) console.log(`  ${f.name}`);
  }

  console.log("\n=== Amostra (primeiros 8) ===");
  for (const f of fighters.slice(0, 8)) {
    const eras = f.bios.map(b =>
      `${b.smashGameVersion}${b.contentEn ? "(EN)" : ""}${b.contentJp ? "(JP)" : ""}`
    ).join(" | ");
    console.log(`  ${f.name.padEnd(22)}: ${eras || "—"}`);
  }

  await db.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
