/**
 * Auditoria SOMENTE LEITURA de duplicados em todo o catálogo (troféus, stickers, spirits e lutadores).
 * Agrupa por (tipo, jogo) e procura:
 *   1) mesmo nome normalizado (o sufixo "(2)" conta como outro nome: variantes legítimas ficam de fora);
 *   2) mesmo nome sem o sufixo "(n)" (candidatos a cópia);
 *   3) mesma posição/ordem no mesmo jogo (ex.: dois troféus no #12 do Melee), que também indica cópia.
 * Marca quem está "vazio" (sem descrição, vídeo, relações, Chronicles nem lutador) e quem tem par preenchido.
 * Gera docs/auditoria-duplicados-geral.md. Não altera nada.
 *
 *   npx tsx --env-file=.env.local scripts/admin/audit-all-duplicates.ts
 */
import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "node:fs";

const db = new PrismaClient();
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const base = (s: string) => norm(s.replace(/\(\s*\d+\s*\)\s*$/, ""));

async function main() {
  const rows = await db.collectible.findMany({
    include: { _count: { select: { relationsFrom: true, relationsTo: true } } },
  } as any) as any[];
  const links = await (db as any).$queryRawUnsafe(
    `SELECT "collectibleId" AS id, COUNT(*)::int AS n FROM "CollectibleChronicleLink" GROUP BY "collectibleId"`,
  ) as { id: string; n: number }[];
  const chr = new Map(links.map(l => [l.id, l.n]));

  const info = (r: any) => {
    const desc = (r.descriptionEn?.trim()?.length ?? 0) > 0;
    const video = r.videoStartSec != null || r.videoStartSec2 != null;
    const rel = r._count.relationsFrom + r._count.relationsTo;
    const c = chr.get(r.id) ?? 0;
    const fighter = !!r.fighterId;
    const img = !!r.assetRenderUrl;
    const empty = !desc && !video && rel === 0 && c === 0 && !fighter;
    const pos = r.posicaoTrofeuMelee ?? r.posicaoTrofeuBrawl ?? r.posicaoTrofeuSsb4 ?? r.posicaoSpiritSsbu ?? r.orderIndex ?? null;
    return { desc, video, rel, c, fighter, img, empty, pos };
  };
  const line = (r: any) => {
    const i = info(r);
    return `  - \`${r.id}\` "${r.name}" pos=${i.pos ?? "-"} desc=${i.desc ? "sim" : "NÃO"} img=${i.img ? "sim" : "NÃO"} vídeo=${i.video ? "sim" : "NÃO"} lutador=${i.fighter ? "sim" : "NÃO"} rel=${i.rel} chr=${i.c}${i.empty ? "  ← VAZIO" : ""}`;
  };

  const out: string[] = [`# Duplicados em todo o catálogo (${new Date().toISOString().slice(0, 10)})`, ""];
  const summary: string[] = [];
  const groups = new Map<string, any[]>();
  for (const r of rows) {
    const k = `${r.type} / ${r.smashGameVersion}`;
    groups.set(k, [...(groups.get(k) ?? []), r]);
  }

  for (const [key, list] of [...groups.entries()].sort()) {
    const exact = new Map<string, any[]>(), byBase = new Map<string, any[]>(), byPos = new Map<string, any[]>();
    for (const r of list) {
      exact.set(norm(r.name), [...(exact.get(norm(r.name)) ?? []), r]);
      byBase.set(base(r.name), [...(byBase.get(base(r.name)) ?? []), r]);
      const p = info(r).pos;
      if (p != null) byPos.set(String(p), [...(byPos.get(String(p)) ?? []), r]);
    }
    const dExact = [...exact.values()].filter(g => g.length > 1);
    const dBase = [...byBase.values()].filter(g => g.length > 1 && !dExact.some(e => e.some(x => g.includes(x))));
    const dPos = [...byPos.entries()].filter(([, g]) => g.length > 1);
    const emptyInDup = new Set<string>();
    for (const g of [...dExact, ...dBase, ...dPos.map(([, g]) => g)]) {
      if (g.some(x => !info(x).empty)) for (const x of g) if (info(x).empty) emptyInDup.add(x.id);
    }
    summary.push(`- **${key}**: ${list.length} itens | mesmo nome: ${dExact.length} | só muda o "(n)": ${dBase.length} | mesma posição: ${dPos.length} | vazios com par preenchido: ${emptyInDup.size}`);
    if (!dExact.length && !dBase.length && !dPos.length) continue;
    out.push(`## ${key} (${list.length} itens)`, "");
    if (dExact.length) { out.push("### Mesmo nome", ""); for (const g of dExact) { out.push(`- ${g[0].name}`); g.forEach(x => out.push(line(x))); } out.push(""); }
    if (dBase.length)  { out.push('### Mesmo nome sem o "(n)"', ""); for (const g of dBase) { out.push(`- ${base(g[0].name)}`); g.forEach(x => out.push(line(x))); } out.push(""); }
    if (dPos.length)   { out.push("### Mesma posição", ""); for (const [p, g] of dPos) { out.push(`- posição ${p}`); g.forEach(x => out.push(line(x))); } out.push(""); }
  }

  // Lutadores: nome repetido
  const fighters = await db.fighter.findMany({ select: { id: true, name: true, rosterNumber: true } } as any) as any[];
  const fNames = new Map<string, any[]>();
  for (const f of fighters) fNames.set(norm(f.name), [...(fNames.get(norm(f.name)) ?? []), f]);
  const fDup = [...fNames.values()].filter(g => g.length > 1);
  summary.push(`- **FIGHTER**: ${fighters.length} lutadores | nomes repetidos: ${fDup.length}`);
  if (fDup.length) { out.push("## Lutadores com nome repetido", ""); fDup.forEach(g => out.push(`- ${g.map(f => `${f.name} (#${f.rosterNumber}, ${f.id})`).join(" | ")}`)); out.push(""); }

  const text = [...out.slice(0, 2), "## Resumo", "", ...summary, "", ...out.slice(2)].join("\n") + "\n";
  writeFileSync("docs/auditoria-duplicados-geral.md", text, "utf8");
  console.log(summary.join("\n"));
}
main().finally(() => db.$disconnect());
