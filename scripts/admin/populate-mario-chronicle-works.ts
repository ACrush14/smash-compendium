/**
 * populate-mario-chronicle-works.ts
 * Liga os works de origem do Mario DIRETAMENTE ao Chronicles (FighterChronicleLink).
 * Fonte única de verdade = ChronicleEntry. NÃO altera curationStatus.
 *
 * Também: cria a entrada arcade "Donkey Kong" (origem real, falta no Chronicles)
 * e corrige o console do "Super Mario 3D Land" (estava "Wii", é "Nintendo 3DS").
 *
 * Run: npx tsx --env-file=.env.local scripts/admin/populate-mario-chronicle-works.ts
 */
import { db } from "../../lib/db";

// titleNtsc, console preferido (para desambiguar), ordem, debut
type Target = { title: string; console?: string; order: number; isDebut?: boolean };
const TARGETS: Target[] = [
  { title: "Donkey Kong",         console: "Arcade",                              order: 1, isDebut: true },
  { title: "Super Mario Bros.",   console: "Nintendo Entertainment System",       order: 2 },
  { title: "Super Mario Bros. 3", console: "Nintendo Entertainment System",       order: 3 },
  { title: "Super Mario World",   console: "Super Nintendo Entertainment System", order: 4 },
  { title: "Super Mario 64",      console: "Nintendo 64",                         order: 5 },
  { title: "Super Mario Sunshine",console: "Nintendo GameCube",                   order: 6 },
  { title: "Super Mario Galaxy",  console: "Wii",                                 order: 7 },
  { title: "Super Mario 3D Land", console: "Nintendo 3DS",                        order: 8 },
  { title: "Super Mario 3D World",console: "Wii U",                               order: 9 },
  { title: "Super Mario Odyssey", console: "Nintendo Switch",                     order: 10 },
];

async function main() {
  const fighter = await db.fighter.findFirst({ where: { name: "Mario" } });
  if (!fighter) { console.log("Mario não encontrado"); return; }

  // 1. Garante entrada arcade do Donkey Kong (origem do Mario como "Jumpman")
  let dkArcade = await db.chronicleEntry.findFirst({
    where: { titleNtsc: "Donkey Kong", consoleName: "Arcade" },
  });
  if (!dkArcade) {
    dkArcade = await db.chronicleEntry.create({
      data: {
        titleNtsc: "Donkey Kong", consoleName: "Arcade",
        releaseDateNtsc: "1981/07", releaseDateJp: "1981/07",
        boxArtUrl: "/assets/games/DONKEY_KONG_ARC_BOX.jpg",
        wikiUrl: "https://en.wikipedia.org/wiki/Donkey_Kong_(1981_video_game)",
        wikiUrlJp: "https://ja.wikipedia.org/wiki/ドンキーコング_(ゲーム)",
      },
    });
    console.log("✨ ChronicleEntry criada: Donkey Kong (Arcade)");
  }

  // 2. Corrige console do 3D Land (Wii → Nintendo 3DS)
  const fix3d = await db.chronicleEntry.updateMany({
    where: { titleNtsc: "Super Mario 3D Land", consoleName: { not: "Nintendo 3DS" } },
    data: { consoleName: "Nintendo 3DS" },
  });
  if (fix3d.count) console.log(`↻ Super Mario 3D Land console corrigido (${fix3d.count})`);

  // 3. Cria os links
  let linked = 0;
  for (const t of TARGETS) {
    const entry = await db.chronicleEntry.findFirst({
      where: { titleNtsc: { equals: t.title, mode: "insensitive" }, ...(t.console ? { consoleName: t.console } : {}) },
      select: { id: true, consoleName: true },
    });
    if (!entry) { console.log(`  ✗ "${t.title}" [${t.console}] não encontrado`); continue; }
    await db.fighterChronicleLink.upsert({
      where: { fighterId_chronicleEntryId: { fighterId: fighter.id, chronicleEntryId: entry.id } },
      create: { fighterId: fighter.id, chronicleEntryId: entry.id, isDebut: t.isDebut ?? false, displayOrder: t.order },
      update: { isDebut: t.isDebut ?? false, displayOrder: t.order },
    });
    console.log(`  ✓ ${t.order}. ${t.title} [${entry.consoleName}]`);
    linked++;
  }
  console.log(`\n✅ Links Fighter↔Chronicle: ${linked}/${TARGETS.length}`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
