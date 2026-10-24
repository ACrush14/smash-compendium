/**
 * Auditoria SOMENTE LEITURA: troféus do Smash 4 (SSB4, SSB4_3DS, SSB4_WIIU) com o mesmo nome, e quão "cheio" é cada um.
 * Mostra, por grupo, o que cada linha tem (descrição, imagem, vídeo, lutador, relações, ligações com Chronicles).
 *
 *   npx tsx --env-file=.env.local scripts/admin/audit-ssb4-duplicates.ts
 */
import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "node:fs";

const db = new PrismaClient();
const norm = (s: string) => s.toLowerCase().replace(/\(\s*\d+\s*\)\s*$/, "").replace(/[^a-z0-9]/g, "");

async function main() {
  const rows = await db.collectible.findMany({
    where: { type: "TROPHY", smashGameVersion: { in: ["SSB4", "SSB4_3DS", "SSB4_WIIU"] } },
    select: {
      id: true, name: true, smashGameVersion: true, fighterId: true,
      descriptionEn: true, descriptionPt: true, descriptionJp: true,
      assetRenderUrl: true, assetRender2Url: true, franchiseId: true, sourceGame: true,
      videoStartSec: true, videoEndSec: true, videoStartSec2: true, videoEndSec2: true,
      posicaoTrofeuSsb4: true, curationStatus: true,
      _count: { select: { relationsFrom: true, relationsTo: true } },
    },
  } as any) as any[];

  const links = await (db as any).$queryRawUnsafe(
    `SELECT "collectibleId" AS id, COUNT(*)::int AS n FROM "CollectibleChronicleLink" GROUP BY "collectibleId"`,
  ) as { id: string; n: number }[];
  const linkMap = new Map(links.map(l => [l.id, l.n]));

  const score = (r: any) => ({
    desc: (r.descriptionEn?.trim()?.length ?? 0) > 0,
    img: !!r.assetRenderUrl,
    video: r.videoStartSec != null || r.videoStartSec2 != null,
    fighter: !!r.fighterId,
    rel: r._count.relationsFrom + r._count.relationsTo,
    chr: linkMap.get(r.id) ?? 0,
    pos: r.posicaoTrofeuSsb4 ?? null,
  });
  const richness = (s: ReturnType<typeof score>) =>
    (s.desc ? 4 : 0) + (s.img ? 2 : 0) + (s.video ? 2 : 0) + (s.fighter ? 1 : 0) + Math.min(s.rel, 3) + Math.min(s.chr, 3);

  const groups = new Map<string, any[]>();
  for (const r of rows) groups.set(norm(r.name), [...(groups.get(norm(r.name)) ?? []), r]);
  const dupGroups = [...groups.entries()].filter(([, g]) => g.length > 1);

  const out: string[] = [`# Duplicados do Smash 4 (${new Date().toISOString().slice(0, 10)})`, "",
    `${rows.length} troféus; ${dupGroups.length} nomes aparecem mais de uma vez.`, ""];
  const candidates: any[] = [];
  for (const [key, g] of dupGroups.sort((a, b) => a[0].localeCompare(b[0]))) {
    out.push(`## ${g[0].name}`);
    for (const r of g) {
      const s = score(r);
      const empty = !s.desc && !s.img && !s.video && s.rel === 0 && s.chr === 0 && !s.fighter;
      out.push(`- \`${r.id}\` [${r.smashGameVersion}] pos=${s.pos ?? "-"} desc=${s.desc ? "sim" : "NÃO"} img=${s.img ? "sim" : "NÃO"} vídeo=${s.video ? "sim" : "NÃO"} lutador=${s.fighter ? "sim" : "NÃO"} relações=${s.rel} chronicles=${s.chr} rico=${richness(s)}${empty ? "  ← VAZIO" : ""}`);
      if (empty) candidates.push(r);
    }
    out.push("");
  }
  writeFileSync("docs/auditoria-duplicados-ssb4.md", out.join("\n") + "\n", "utf8");
  console.log(`grupos duplicados: ${dupGroups.length}; linhas totalmente vazias: ${candidates.length}`);
}
main().finally(() => db.$disconnect());
