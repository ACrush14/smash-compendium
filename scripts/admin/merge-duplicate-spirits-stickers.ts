/**
 * Funde duplicados de SPIRITS e STICKERS (os dois lados têm dados; por isso é fusão, não exclusão).
 * Padrão: SIMULAÇÃO (não altera nada) + relatório em docs/fusao-duplicados-simulacao.md.
 * Com --apply: grava backup JSON em scratch/ e executa a fusão (uma transação por grupo).
 *
 * O que é duplicado:
 *   - SPIRIT:  `X-<N>` quando existe `X` com o mesmo nome e posicaoSpiritSsbu == N.
 *   - STICKER: mesmo nome e mesma posição (orderIndex) no mesmo jogo. Mesmo nome com posição diferente NÃO é
 *              duplicado (o Brawl tem vários stickers "Peach" diferentes).
 * Como funde:
 *   - Fica a linha mais completa (descrição, imagem, vídeo, lutador, relações, Chronicles; empate: id mais curto).
 *   - Campos vazios da que fica são preenchidos com os da que sai (nada é sobrescrito; `curationStatus` não muda).
 *   - Relações e ligações com Chronicles que só a que sai tinha são passadas para a que fica (sem repetir nem
 *     criar ligação do item consigo mesmo). Depois a linha que sai é apagada.
 *
 *   npx tsx --env-file=.env.local scripts/admin/merge-duplicate-spirits-stickers.ts          # simulação
 *   npx tsx --env-file=.env.local scripts/admin/merge-duplicate-spirits-stickers.ts --apply  # aplica (com backup)
 */
import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync } from "node:fs";

const APPLY = process.argv.includes("--apply");
const db = new PrismaClient();
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const FILL_FIELDS = [
  "nameJp", "description", "descriptionNa", "descriptionEu", "descriptionEn", "descriptionPt", "descriptionJp", "descriptionJpEn",
  "sourceGame", "assetRenderUrl", "assetRender2Url", "orderIndex",
  "posicaoTrofeuMelee", "posicaoTrofeuBrawl", "posicaoTrofeuSsb4", "posicaoSpiritSsbu",
  "videoStartSec", "videoEndSec", "videoStartSec2", "videoEndSec2",
  "spiritFirstAppearance", "spiritArtworkSource", "spiritMusicTitle", "spiritMusicArtist", "spiritMusicDuration", "spiritCuratorComment",
  "franchiseId", "fighterId",
] as const;
const isEmpty = (v: unknown) => v == null || (typeof v === "string" && v.trim() === "");

async function main() {
  const rows = await db.collectible.findMany({ where: { type: { in: ["SPIRIT", "STICKER"] } } }) as any[];
  const rels = await db.collectibleRelation.findMany({ where: { OR: [{ from: { type: { in: ["SPIRIT", "STICKER"] } } }, { to: { type: { in: ["SPIRIT", "STICKER"] } } }] } });
  const chrLinks = await db.collectibleChronicleLink.findMany({ where: { collectible: { type: { in: ["SPIRIT", "STICKER"] } } } });

  const relBy = new Map<string, typeof rels>();
  for (const r of rels) { for (const id of [r.fromId, r.toId]) relBy.set(id, [...(relBy.get(id) ?? []), r]); }
  const chrBy = new Map<string, typeof chrLinks>();
  for (const l of chrLinks) chrBy.set(l.collectibleId, [...(chrBy.get(l.collectibleId) ?? []), l]);

  const pos = (r: any) => r.posicaoTrofeuMelee ?? r.posicaoTrofeuBrawl ?? r.posicaoTrofeuSsb4 ?? r.posicaoSpiritSsbu ?? r.orderIndex ?? null;
  const rich = (r: any) =>
    (!isEmpty(r.descriptionEn) ? 4 : 0) + (r.assetRenderUrl ? 2 : 0) + (r.videoStartSec != null ? 2 : 0) + (r.fighterId ? 1 : 0) +
    Math.min((relBy.get(r.id) ?? []).length, 50) / 50 * 3 + Math.min((chrBy.get(r.id) ?? []).length, 3);

  // ── Agrupar duplicados ───────────────────────────────────────────────
  const groups: any[][] = [];
  const byId = new Map(rows.map(r => [r.id, r]));
  const byLowerId = new Map(rows.map(r => [r.id.toLowerCase(), r]));
  const used = new Set<string>();

  for (const r of rows.filter(x => x.type === "SPIRIT")) {
    const m = r.id.match(/^(.*)-(\d+)$/);
    if (!m) continue;
    const base = byId.get(m[1]!) ?? byLowerId.get(m[1]!.toLowerCase()); // "PAC-MAN" × "Pac-Man-946"
    if (base && base.type === "SPIRIT" && norm(base.name) === norm(r.name) && base.posicaoSpiritSsbu === Number(m[2])) {
      groups.push([base, r]); used.add(base.id); used.add(r.id);
    }
  }
  const stickerKey = new Map<string, any[]>();
  for (const r of rows.filter(x => x.type === "STICKER")) {
    const p = pos(r);
    if (p == null) continue;
    const k = `${r.smashGameVersion}|${norm(r.name)}|${p}`;
    stickerKey.set(k, [...(stickerKey.get(k) ?? []), r]);
  }
  for (const g of stickerKey.values()) if (g.length > 1) groups.push(g);

  // ── Planejar cada grupo ──────────────────────────────────────────────
  type Plan = { keeper: any; losers: any[]; fills: Record<string, unknown>; moveRels: any[]; dropRels: number; moveLinks: any[] };
  const plans: Plan[] = [];
  for (const g of groups) {
    const sorted = [...g].sort((a, b) => rich(b) - rich(a) || a.id.length - b.id.length);
    const keeper = sorted[0]!, losers = sorted.slice(1);
    const loserIds = new Set(losers.map(l => l.id));
    const fills: Record<string, unknown> = {};
    for (const l of losers) for (const f of FILL_FIELDS) if (isEmpty(keeper[f]) && isEmpty(fills[f]) && !isEmpty(l[f])) fills[f] = l[f];

    const have = new Set((relBy.get(keeper.id) ?? []).map(r => `${r.fromId}>${r.toId}`));
    const moveRels: any[] = []; let dropRels = 0;
    for (const l of losers) for (const r of relBy.get(l.id) ?? []) {
      const from = loserIds.has(r.fromId) ? keeper.id : r.fromId;
      const to = loserIds.has(r.toId) ? keeper.id : r.toId;
      const key = `${from}>${to}`;
      if (from === to || have.has(key)) { dropRels++; continue; }
      have.add(key); moveRels.push({ id: r.id, from, to, relationType: r.relationType });
    }
    const haveLinks = new Set((chrBy.get(keeper.id) ?? []).map(x => x.chronicleEntryId));
    const moveLinks: any[] = [];
    for (const l of losers) for (const x of chrBy.get(l.id) ?? []) if (!haveLinks.has(x.chronicleEntryId)) { haveLinks.add(x.chronicleEntryId); moveLinks.push({ chronicleEntryId: x.chronicleEntryId }); }
    plans.push({ keeper, losers, fills, moveRels, dropRels, moveLinks });
  }

  // ── Relatório ────────────────────────────────────────────────────────
  const md: string[] = [`# Fusão de duplicados — Spirits e Stickers (${new Date().toISOString().slice(0, 10)})`, "",
    `${plans.length} grupos (${plans.filter(p => p.keeper.type === "SPIRIT").length} spirits, ${plans.filter(p => p.keeper.type === "STICKER").length} stickers); ${plans.reduce((s, p) => s + p.losers.length, 0)} linhas seriam removidas.`, "",
    "Cada item mostra a linha que FICA, a que SAI, os campos que a que fica recebe e quantas relações/ligações são aproveitadas.", ""];
  for (const t of ["SPIRIT", "STICKER"]) {
    md.push(`## ${t === "SPIRIT" ? "Spirits" : "Stickers"}`, "");
    for (const p of plans.filter(x => x.keeper.type === t).sort((a, b) => a.keeper.name.localeCompare(b.keeper.name))) {
      md.push(`- **${p.keeper.name}** (pos ${pos(p.keeper) ?? pos(p.losers[0]) ?? "-"}) — FICA \`${p.keeper.id}\` · SAI ${p.losers.map(l => `\`${l.id}\``).join(", ")}`);
      const fl = Object.keys(p.fills);
      md.push(`  - recebe: ${fl.length ? fl.join(", ") : "nada (a que fica já tem tudo)"} | relações aproveitadas: ${p.moveRels.length}, repetidas descartadas: ${p.dropRels} | ligações Chronicles aproveitadas: ${p.moveLinks.length}`);
    }
    md.push("");
  }
  writeFileSync("docs/fusao-duplicados-simulacao.md", md.join("\n") + "\n", "utf8");

  const sp = plans.filter(p => p.keeper.type === "SPIRIT").length, st = plans.length - sp;
  console.log(`Grupos: ${plans.length} (spirits ${sp}, stickers ${st}); linhas a remover: ${plans.reduce((s, p) => s + p.losers.length, 0)}`);
  console.log(`Campos a preencher: ${plans.reduce((s, p) => s + Object.keys(p.fills).length, 0)}; relações a mover: ${plans.reduce((s, p) => s + p.moveRels.length, 0)}; ligações Chronicles a mover: ${plans.reduce((s, p) => s + p.moveLinks.length, 0)}`);

  if (!APPLY) { console.log("\nSimulação: nada foi alterado. Relatório em docs/fusao-duplicados-simulacao.md"); return; }

  // ── Aplicar (com backup) ─────────────────────────────────────────────
  mkdirSync("scratch", { recursive: true });
  const file = `scratch/backup-fusao-spirits-stickers-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  const affected = new Set(plans.flatMap(p => [p.keeper.id, ...p.losers.map(l => l.id)]));
  writeFileSync(file, JSON.stringify({
    collectibles: rows.filter(r => affected.has(r.id)),
    relations: rels.filter(r => affected.has(r.fromId) || affected.has(r.toId)),
    chronicleLinks: chrLinks.filter(l => affected.has(l.collectibleId)),
  }, null, 2), "utf8");
  console.log(`Backup gravado em ${file}`);

  let ok = 0, fail = 0;
  for (const p of plans) {
    try {
      await db.$transaction(async tx => {
        if (Object.keys(p.fills).length) await tx.collectible.update({ where: { id: p.keeper.id }, data: p.fills as any });
        for (const r of p.moveRels) await tx.collectibleRelation.update({ where: { id: r.id }, data: { fromId: r.from, toId: r.to } });
        for (const l of p.moveLinks) await tx.collectibleChronicleLink.create({ data: { collectibleId: p.keeper.id, chronicleEntryId: l.chronicleEntryId } });
        await tx.collectible.deleteMany({ where: { id: { in: p.losers.map(l => l.id) } } });
      });
      ok++;
    } catch (e) { fail++; console.log(`  ! grupo "${p.keeper.name}" não foi fundido: ${(e as Error).message.split("\n").pop()}`); }
  }
  console.log(`Fundidos: ${ok}. Falhas: ${fail}.`);
}
main().finally(() => db.$disconnect());
