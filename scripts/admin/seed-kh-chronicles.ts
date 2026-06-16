/** Adiciona jogos Kingdom Hearts faltantes e remove duplicata KH1 */
import { db } from "../../lib/db";
(async () => {
  // Remove duplicate KH1 (keep the one with more links)
  const kh1entries = await db.chronicleEntry.findMany({
    where: { titleNtsc: "Kingdom Hearts", consoleName: "PlayStation 2" },
    include: { collectibleLinks: true, fighterLinks: true },
  });
  console.log("KH1 duplicates:", kh1entries.length);
  if (kh1entries.length === 2) {
    const keep = kh1entries.reduce((a, b) =>
      (a.collectibleLinks.length + a.fighterLinks.length) >= (b.collectibleLinks.length + b.fighterLinks.length) ? a : b
    );
    const del = kh1entries.find(e => e.id !== keep.id)!;
    await db.chronicleEntry.delete({ where: { id: del.id } });
    console.log("DELETE duplicate KH1 [" + del.id.slice(-6) + "]");
  }

  // Add missing KH games
  const toAdd = [
    { titleNtsc: "Kingdom Hearts: Chain of Memories", consoleName: "Game Boy Advance",   releaseDateNtsc: "11/11/2004", titleJp: "キングダム ハーツ チェイン オブ メモリーズ" },
    { titleNtsc: "Kingdom Hearts II",                  consoleName: "PlayStation 2",      releaseDateNtsc: "03/28/2006", titleJp: "キングダム ハーツ II" },
    { titleNtsc: "Kingdom Hearts Birth by Sleep",      consoleName: "PlayStation Portable", releaseDateNtsc: "09/07/2010", titleJp: "キングダム ハーツ バース バイ スリープ" },
    { titleNtsc: "Kingdom Hearts 3D: Dream Drop Distance", consoleName: "Nintendo 3DS",   releaseDateNtsc: "07/31/2012", titleJp: "キングダム ハーツ 3D ドリーム ドロップ ディスタンス" },
    { titleNtsc: "Kingdom Hearts 0.2: Birth by Sleep - A Fragmentary Passage", consoleName: "PlayStation 4", releaseDateNtsc: "01/12/2017", titleJp: "キングダム ハーツ 0.2 バース バイ スリープ" },
  ];

  for (const g of toAdd) {
    const existing = await db.chronicleEntry.findFirst({
      where: { titleNtsc: { contains: g.titleNtsc.split(":")[0]!, mode: "insensitive" }, consoleName: g.consoleName },
    });
    if (existing) { console.log("SKIP (já existe):", g.titleNtsc); continue; }
    await db.chronicleEntry.create({ data: g });
    console.log("CREATE:", g.titleNtsc);
  }

  const total = await db.chronicleEntry.count({ where: { titleNtsc: { contains: "Kingdom Hearts", mode: "insensitive" } } });
  console.log("Total KH no DB:", total);
  await db.$disconnect();
})().catch(e => { console.error(e); process.exit(1); });
