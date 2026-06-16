import { db } from "../../lib/db";
(async () => {
  // Deletar PAL EXCLUSIVE sem titleJp
  const pal = await db.chronicleEntry.findFirst({
    where: { consoleName: "Game & Watch", titleNtsc: "PAL EXCLUSIVE", titleJp: null },
    include: { collectibleLinks: true, fighterLinks: true },
  });
  if (pal) {
    const links = pal.collectibleLinks.length + pal.fighterLinks.length;
    if (links === 0) {
      await db.chronicleEntry.delete({ where: { id: pal.id } });
      console.log("DELETE PAL EXCLUSIVE (sem titleJp)");
    } else console.log("SKIP PAL EXCLUSIVE — tem links:", links);
  } else console.log("PAL EXCLUSIVE (sem titleJp) não encontrado");

  // Corrigir consoles errados
  const fixes: Array<{ prefix: string; consoleName: string }> = [
    { prefix: "New Super Mario Bros.",  consoleName: "Nintendo DS" },
    { prefix: "Sonic Advance 2",        consoleName: "Game Boy Advance" },
    { prefix: "Super Mario Bros. 3",    consoleName: "NES" },
    { prefix: "Super Mario Sunshine",   consoleName: "Nintendo GameCube" },
  ];
  for (const f of fixes) {
    const e = await db.chronicleEntry.findFirst({
      where: { consoleName: "Game & Watch", titleNtsc: { startsWith: f.prefix } },
    });
    if (!e) { console.log("MISS", f.prefix); continue; }
    await db.chronicleEntry.update({ where: { id: e.id }, data: { consoleName: f.consoleName } });
    console.log("FIX", e.titleNtsc, "→", f.consoleName);
  }

  const total = await db.chronicleEntry.count({ where: { consoleName: "Game & Watch" } });
  console.log("Total G&W final:", total);
  await db.$disconnect();
})().catch(e => { console.error(e); process.exit(1); });
