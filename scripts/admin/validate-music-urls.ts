/**
 * validate-music-urls.ts
 * Verifica quais faixas de música têm vídeos YouTube ainda acessíveis.
 * Usa o oEmbed API (sem API key necessária):
 *   200 = playável ✅  |  401 = restrito/age-gate ⚠️  |  404 = morto ❌
 *
 * Saída: relatório no console + arquivo JSON com resultados
 * Uso: npx tsx --env-file=.env.local scripts/admin/validate-music-urls.ts
 */

import { db } from "../../lib/db";
import * as fs from "fs";
import * as path from "path";

const CONCURRENCY = 5;
const DELAY_MS    = 250; // delay entre batches

type CheckResult = {
  source:    "music" | "fighter";
  id:        string;
  title:     string;
  youtubeId: string;
  status:    200 | 401 | 404 | number;
  label:     "ok" | "restricted" | "dead" | "error";
};

async function checkVideo(youtubeId: string): Promise<{ status: number }> {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    return { status: res.status };
  } catch {
    return { status: 0 };
  }
}

function label(status: number): "ok" | "restricted" | "dead" | "error" {
  if (status === 200) return "ok";
  if (status === 401) return "restricted";
  if (status === 404) return "dead";
  return "error";
}

async function processBatch(items: Array<() => Promise<CheckResult>>): Promise<CheckResult[]> {
  return Promise.all(items.map(fn => fn()));
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log("Carregando faixas do banco...");

  const [musicTracks, fighters] = await Promise.all([
    db.music.findMany({
      where:  { youtubeId: { not: null } },
      select: { id: true, title: true, youtubeId: true },
    }),
    db.fighter.findMany({
      where:  { musicYoutubeId: { not: null } },
      select: { id: true, name: true, musicYoutubeId: true, musicTitle: true },
    }),
  ]);

  console.log(`Music tracks: ${musicTracks.length}`);
  console.log(`Fighters com musicYoutubeId: ${fighters.length}`);
  console.log(`Total a verificar: ${musicTracks.length + fighters.length}`);
  console.log("");

  const tasks: Array<() => Promise<CheckResult>> = [
    ...musicTracks.map(m => async (): Promise<CheckResult> => {
      const { status } = await checkVideo(m.youtubeId!);
      return { source: "music", id: m.id, title: m.title, youtubeId: m.youtubeId!, status, label: label(status) };
    }),
    ...fighters.map(f => async (): Promise<CheckResult> => {
      const { status } = await checkVideo(f.musicYoutubeId!);
      return {
        source: "fighter", id: f.id,
        title:  f.musicTitle ?? f.name,
        youtubeId: f.musicYoutubeId!,
        status, label: label(status),
      };
    }),
  ];

  const results: CheckResult[] = [];
  let processed = 0;
  const total = tasks.length;

  for (let i = 0; i < tasks.length; i += CONCURRENCY) {
    const batch = tasks.slice(i, i + CONCURRENCY);
    const batchResults = await processBatch(batch);
    results.push(...batchResults);
    processed += batchResults.length;

    // progresso
    const pct = Math.round((processed / total) * 100);
    const dead = results.filter(r => r.label === "dead").length;
    const restricted = results.filter(r => r.label === "restricted").length;
    process.stdout.write(`\r[${pct}%] ${processed}/${total} — mortos: ${dead}, restritos: ${restricted}   `);

    if (i + CONCURRENCY < tasks.length) {
      await sleep(DELAY_MS);
    }
  }

  console.log("\n");

  // Sumário
  const ok         = results.filter(r => r.label === "ok");
  const restricted = results.filter(r => r.label === "restricted");
  const dead       = results.filter(r => r.label === "dead");
  const errors     = results.filter(r => r.label === "error");

  console.log("=== RESULTADOS ===");
  console.log(`✅ OK (200):         ${ok.length}`);
  console.log(`⚠️  Restritos (401): ${restricted.length}`);
  console.log(`❌ Mortos (404):     ${dead.length}`);
  console.log(`🔧 Erros (rede):     ${errors.length}`);
  console.log("");

  if (dead.length > 0) {
    console.log("=== VÍDEOS MORTOS (❌ 404) ===");
    for (const r of dead) {
      console.log(`  [${r.source}] ${r.title.substring(0, 60).padEnd(60)} https://youtu.be/${r.youtubeId}`);
    }
    console.log("");
  }

  if (restricted.length > 0) {
    console.log("=== VÍDEOS RESTRITOS (⚠️ 401) ===");
    for (const r of restricted) {
      console.log(`  [${r.source}] ${r.title.substring(0, 60).padEnd(60)} https://youtu.be/${r.youtubeId}`);
    }
    console.log("");
  }

  // Salvar relatório JSON
  const outPath = path.join("scripts", "admin", "music-validation-report.json");
  const report = {
    generatedAt: new Date().toISOString(),
    summary: { ok: ok.length, restricted: restricted.length, dead: dead.length, errors: errors.length },
    dead:       dead.map(r => ({ source: r.source, id: r.id, title: r.title, youtubeId: r.youtubeId })),
    restricted: restricted.map(r => ({ source: r.source, id: r.id, title: r.title, youtubeId: r.youtubeId })),
    errors:     errors.map(r => ({ source: r.source, id: r.id, title: r.title, youtubeId: r.youtubeId, status: r.status })),
  };
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf-8");
  console.log(`Relatório salvo em: ${outPath}`);

  await db.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
