/**
 * Auditoria só de leitura de troféus:
 *  1) troféus sem trecho de vídeo (videoStartSec/videoEndSec) por jogo, com o link da página no site;
 *  2) troféus com `fighterId` suspeito (ID "flat" ou nome do lutador ausente do id/nome do troféu).
 * Gera docs/auditoria-trofeus.md. Não altera o banco.
 *
 *   npx tsx --env-file=.env.local scripts/admin/audit-trophy-gaps.ts
 */
import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "node:fs";

const db = new PrismaClient();
const SITE = "https://smashcompendium.com";
const GAME_PARAM: Record<string, string> = { SSBM: "SSBM", SSBB: "SSBB", SSB4: "SSB4", SSB4_3DS: "SSB4", SSB4_WIIU: "SSB4" };
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const link = (id: string, version: string) =>
  `${SITE}/collectibles?type=TROPHY&game=${GAME_PARAM[version] ?? version}&trophy=${encodeURIComponent(id)}`;

async function main() {
  const trophies = await db.collectible.findMany({
    where: { type: "TROPHY" },
    select: {
      id: true, name: true, smashGameVersion: true, fighterId: true,
      videoStartSec: true, videoEndSec: true, videoStartSec2: true, videoEndSec2: true,
      posicaoTrofeuMelee: true, posicaoTrofeuBrawl: true, posicaoTrofeuSsb4: true,
      fighter: { select: { name: true } },
    },
  } as any) as any[];

  const pos = (t: any) => t.posicaoTrofeuMelee ?? t.posicaoTrofeuBrawl ?? t.posicaoTrofeuSsb4 ?? 9999;
  const out: string[] = [`# Auditoria de troféus (${new Date().toISOString().slice(0, 10)})`, ""];

  // 1) sem trecho
  const missing = trophies.filter(t => ["SSBM", "SSBB", "SSB4", "SSB4_3DS", "SSB4_WIIU"].includes(t.smashGameVersion)
    && (t.videoStartSec == null || t.videoEndSec == null));
  const byGame = new Map<string, any[]>();
  for (const t of missing) byGame.set(t.smashGameVersion, [...(byGame.get(t.smashGameVersion) ?? []), t]);
  out.push("## 1. Troféus sem trecho de vídeo", "");
  for (const [game, list] of [...byGame.entries()].sort()) {
    out.push(`### ${game} — ${list.length}`, "");
    for (const t of list.sort((a, b) => pos(a) - pos(b))) out.push(`- #${pos(t)} ${t.name} — ${link(t.id, t.smashGameVersion)}`);
    out.push("");
  }

  // 2) fighterId suspeito
  out.push("## 2. Troféus com `fighterId` suspeito", "");
  const sus = trophies.filter(t => {
    if (!t.fighter) return false;
    const fn = norm(t.fighter.name);
    return !norm(t.id).includes(fn) && !norm(t.name).includes(fn);
  });
  out.push(`${sus.length} de ${trophies.filter(t => t.fighterId).length} troféus ligados a lutador não trazem o nome do lutador no id nem no nome.`, "");
  for (const t of sus.sort((a, b) => a.fighter.name.localeCompare(b.fighter.name))) {
    const hasVideo = t.videoStartSec != null ? `vídeo ${t.videoStartSec}–${t.videoEndSec}s` : "sem vídeo";
    out.push(`- **${t.name}** (${t.smashGameVersion}, ${hasVideo}) está ligado a **${t.fighter.name}** — troféu: ${link(t.id, t.smashGameVersion)} · lutador: ${SITE}/fighters/${encodeURIComponent(t.fighter.name)}`);
  }
  writeFileSync("docs/auditoria-trofeus.md", out.join("\n") + "\n", "utf8");
  console.log(`sem trecho: ${missing.length} (` + [...byGame.entries()].map(([g, l]) => `${g}=${l.length}`).join(", ") + `)`);
  console.log(`suspeitos: ${sus.length}`);
}
main().finally(() => db.$disconnect());
