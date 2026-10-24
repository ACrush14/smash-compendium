/**
 * Remove troféus do Smash 4 que são cópias VAZIAS de um troféu que já existe preenchido.
 * Padrão: simulação (não apaga nada). Com --apply: grava um backup JSON em scratch/ e apaga.
 *
 * Regras (as duas só valem se a linha a apagar não tem vídeo, relações, ligações com Chronicles nem lutador):
 *   A) `<id>_2` sem descrição, quando `<id>` existe e tem descrição  → cópia vazia da lista do Wii U/3DS
 *   B) id "solto" (`TROPHY-SSB4-<Nome>`, só com descrição e sem imagem), quando existe `TROPHY-SSB4-3DS-<Nome>` ou
 *      `TROPHY-SSB4-WIIU-<Nome>` preenchido com o mesmo nome  → cópia antiga do scraper
 *   C) Mii Swordfighter / Mii Swordfighter (Alt.): as duas cópias `..._2` vazias (pedido do usuário)
 *
 *   npx tsx --env-file=.env.local scripts/admin/remove-empty-ssb4-duplicates.ts          # simulação
 *   npx tsx --env-file=.env.local scripts/admin/remove-empty-ssb4-duplicates.ts --apply  # apaga (com backup)
 */
import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync } from "node:fs";

const APPLY = process.argv.includes("--apply");
const db = new PrismaClient();
const norm = (s: string) => s.toLowerCase().replace(/\(\s*\d+\s*\)\s*$/, "").replace(/[^a-z0-9]/g, "");

async function main() {
  const rows = await db.collectible.findMany({
    where: { type: "TROPHY", smashGameVersion: { in: ["SSB4", "SSB4_3DS", "SSB4_WIIU"] } },
    include: { _count: { select: { relationsFrom: true, relationsTo: true } } },
  } as any) as any[];
  const links = await (db as any).$queryRawUnsafe(
    `SELECT "collectibleId" AS id, COUNT(*)::int AS n FROM "CollectibleChronicleLink" GROUP BY "collectibleId"`,
  ) as { id: string; n: number }[];
  const chr = new Map(links.map(l => [l.id, l.n]));
  const byId = new Map(rows.map(r => [r.id, r]));

  const hasDesc = (r: any) => (r.descriptionEn?.trim()?.length ?? 0) > 0;
  const hasVideo = (r: any) => r.videoStartSec != null || r.videoStartSec2 != null;
  const noLinks = (r: any) => r._count.relationsFrom + r._count.relationsTo === 0 && (chr.get(r.id) ?? 0) === 0 && !r.fighterId && !hasVideo(r);

  const picks = new Map<string, { row: any; rule: string; keeper: string }>();

  for (const r of rows) {
    // A) X_2 vazio, com X preenchido
    if (/_2$/.test(r.id) && !hasDesc(r) && noLinks(r)) {
      const keeper = byId.get(r.id.replace(/_2$/, ""));
      if (keeper && hasDesc(keeper)) picks.set(r.id, { row: r, rule: "A (_2 vazio)", keeper: keeper.id });
    }
    // B) id solto com só descrição
    if (/^TROPHY-SSB4-[^_]/.test(r.id) && !/^TROPHY-SSB4-(3DS|WIIU)-/.test(r.id) && hasDesc(r) && !r.assetRenderUrl && noLinks(r)) {
      const n = norm(r.name);
      const ok = (k: any) => k.id !== r.id && /^TROPHY-SSB4-(3DS|WIIU)-/.test(k.id) && hasDesc(k) && k.assetRenderUrl;
      // nome igual; se não houver, um irmão do 3DS/Wii U cujo nome COMEÇA com o nome do solto (ex.: "Michaela" → "Michaela Evie")
      const keeper = rows.find(k => ok(k) && norm(k.name) === n) ?? (n.length >= 6 ? rows.find(k => ok(k) && norm(k.name).startsWith(n)) : undefined);
      if (keeper) picks.set(r.id, { row: r, rule: "B (solto só com descrição)", keeper: keeper.id });
    }
  }
  // C) Mii Swordfighter e Alt.
  for (const r of rows) {
    if (/Mii[_ ]Sword/i.test(r.id) && /_2$/.test(r.id) && !hasDesc(r) && noLinks(r)) {
      picks.set(r.id, { row: r, rule: "C (Mii Swordfighter)", keeper: "(o outro troféu Mii Swordfighter)" });
    }
  }

  console.log(`\nMii (todas as linhas do Smash 4 com "Mii Sword" no id):`);
  for (const r of rows.filter(x => /Mii[_ ]Sword/i.test(x.id))) {
    console.log(`  ${r.id} [${r.smashGameVersion}] pos=${r.posicaoTrofeuSsb4} desc=${hasDesc(r)} vídeo=${hasVideo(r)} rel=${r._count.relationsFrom + r._count.relationsTo} chr=${chr.get(r.id) ?? 0} lutador=${!!r.fighterId}${picks.has(r.id) ? "  ← APAGAR" : ""}`);
  }

  // Soltos só com descrição que NÃO foram marcados: mostra possíveis irmãos de nome parecido para decisão manual
  console.log(`\nSoltos só com descrição sem par exato (não serão apagados; veja se há irmão com nome parecido):`);
  for (const r of rows) {
    if (picks.has(r.id)) continue;
    if (!(/^TROPHY-SSB4-[^_]/.test(r.id) && !/^TROPHY-SSB4-(3DS|WIIU)-/.test(r.id) && hasDesc(r) && !r.assetRenderUrl && noLinks(r))) continue;
    const n = norm(r.name);
    const first = n.slice(0, 7);
    const sibs = rows.filter(k => k.id !== r.id && (norm(k.name).includes(n) || n.includes(norm(k.name)) || (first.length >= 5 && norm(k.name).startsWith(first))));
    console.log(`  ${r.id} "${r.name}" pos=${r.posicaoTrofeuSsb4}  →  parecidos: ${sibs.slice(0, 4).map(k => `${k.id} [${k.smashGameVersion}] desc=${hasDesc(k)} img=${!!k.assetRenderUrl}`).join(" | ") || "nenhum"}`);
  }

  console.log(`\n${picks.size} candidatos a apagar:`);
  for (const [id, p] of [...picks.entries()].sort()) console.log(`  [${p.rule}] ${id}   (fica: ${p.keeper})`);

  if (!APPLY) { console.log("\nSimulação: nada foi apagado. Rode com --apply para apagar (cria backup em scratch/)."); return; }

  mkdirSync("scratch", { recursive: true });
  const file = `scratch/backup-troféus-removidos-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  writeFileSync(file, JSON.stringify([...picks.values()].map(p => p.row), null, 2), "utf8");
  console.log(`\nBackup gravado em ${file}`);

  let ok = 0, fail = 0;
  for (const id of picks.keys()) {
    try { await db.collectible.delete({ where: { id } }); ok++; }
    catch (e) { fail++; console.log(`  ! não apagou ${id}: ${(e as Error).message.split("\n").pop()}`); }
  }
  console.log(`Apagados: ${ok}. Falhas: ${fail}.`);
}
main().finally(() => db.$disconnect());
