/**
 * replace-dead-music-urls.ts
 * Busca substitutos embeddáveis no YouTube para faixas com oEmbed 404.
 *
 * Quota: cada search = 100 unidades. Default: 95 buscas/run (~9.500 un/dia).
 * Progresso salvo em scripts/admin/replace-progress.json — rode novamente para continuar.
 *
 * Uso: npx tsx --env-file=.env.local scripts/admin/replace-dead-music-urls.ts
 */

import { db } from "../../lib/db";
import * as fs from "fs";
import * as path from "path";

const API_KEY      = process.env.YOUTUBE_API_KEY!;
const MAX_PER_RUN  = 95;   // ~9.500 quota units (cada search = 100)
const DELAY_MS     = 300;  // delay entre chamadas à API
const REPORT_PATH  = path.join("scripts", "admin", "music-validation-report.json");
const PROGRESS_PATH = path.join("scripts", "admin", "replace-progress.json");
const CHANGES_PATH = path.join("scripts", "admin", "replace-changes.json");

if (!API_KEY) {
  console.error("YOUTUBE_API_KEY não definida no .env.local");
  process.exit(1);
}

type DeadEntry = { source: "music" | "fighter"; id: string; title: string; youtubeId: string };
type Progress  = { processed: Set<string> };
type Change    = { source: string; id: string; title: string; oldId: string; newId: string; newTitle: string };

function loadProgress(): Set<string> {
  if (fs.existsSync(PROGRESS_PATH)) {
    const data = JSON.parse(fs.readFileSync(PROGRESS_PATH, "utf-8")) as { processed: string[] };
    return new Set(data.processed);
  }
  return new Set();
}

function saveProgress(processed: Set<string>) {
  fs.writeFileSync(PROGRESS_PATH, JSON.stringify({ processed: [...processed] }, null, 2));
}

function loadChanges(): Change[] {
  if (fs.existsSync(CHANGES_PATH)) {
    return JSON.parse(fs.readFileSync(CHANGES_PATH, "utf-8")) as Change[];
  }
  return [];
}

function saveChanges(changes: Change[]) {
  fs.writeFileSync(CHANGES_PATH, JSON.stringify(changes, null, 2));
}

async function searchYouTube(query: string): Promise<{ videoId: string; videoTitle: string } | null> {
  const params = new URLSearchParams({
    part:            "snippet",
    q:               query,
    type:            "video",
    videoEmbeddable: "true",
    maxResults:      "1",
    key:             API_KEY,
  });
  const url = `https://www.googleapis.com/youtube/v3/search?${params}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(12_000) });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`YouTube API ${res.status}: ${body.substring(0, 200)}`);
  }
  const data = await res.json() as { items?: Array<{ id: { videoId: string }; snippet: { title: string } }> };
  const item = data.items?.[0];
  if (!item) return null;
  return { videoId: item.id.videoId, videoTitle: item.snippet.title };
}

async function verifyEmbeddable(videoId: string): Promise<boolean> {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8_000) });
    return res.status === 200;
  } catch {
    return false;
  }
}

function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

async function main() {
  if (!fs.existsSync(REPORT_PATH)) {
    console.error(`Relatório não encontrado: ${REPORT_PATH}`);
    console.error("Rode primeiro: npx tsx --env-file=.env.local scripts/admin/validate-music-urls.ts");
    process.exit(1);
  }

  const report = JSON.parse(fs.readFileSync(REPORT_PATH, "utf-8")) as {
    dead: DeadEntry[];
    errors: DeadEntry[];
  };

  const allDead: DeadEntry[] = [...report.dead, ...report.errors];
  const processed = loadProgress();
  const changes   = loadChanges();

  const pending = allDead.filter(e => !processed.has(e.id));

  console.log(`Total mortos/erros: ${allDead.length}`);
  console.log(`Já processados:     ${processed.size}`);
  console.log(`Pendentes:          ${pending.length}`);
  console.log(`Buscas neste run:   até ${MAX_PER_RUN}`);
  console.log("");

  const toProcess = pending.slice(0, MAX_PER_RUN);
  let found = 0, notFound = 0, dbUpdated = 0, errors = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const entry = toProcess[i]!;
    const pct   = Math.round(((i + 1) / toProcess.length) * 100);
    process.stdout.write(`\r[${pct}%] ${i + 1}/${toProcess.length} | ✅${found} ❌${notFound} err${errors}   `);

    try {
      // Busca com query específica
      const query = `${entry.title} Super Smash Bros Ultimate`;
      const result = await searchYouTube(query);

      if (!result) {
        notFound++;
        processed.add(entry.id);
        if ((i + 1) % 10 === 0) saveProgress(processed);
        await sleep(DELAY_MS);
        continue;
      }

      // Verificação secundária com oEmbed
      const embeddable = await verifyEmbeddable(result.videoId);
      if (!embeddable) {
        // Tenta busca mais ampla
        const result2 = await searchYouTube(`${entry.title} SSBU Nintendo`);
        if (!result2 || !(await verifyEmbeddable(result2.videoId))) {
          notFound++;
          processed.add(entry.id);
          await sleep(DELAY_MS);
          continue;
        }
        // Usa resultado da segunda busca
        Object.assign(result, result2);
      }

      // Atualiza no banco
      if (entry.source === "music") {
        await db.music.update({ where: { id: entry.id }, data: { youtubeId: result.videoId } });
      } else {
        await db.fighter.update({ where: { id: entry.id }, data: { musicYoutubeId: result.videoId } });
      }

      changes.push({
        source: entry.source, id: entry.id, title: entry.title,
        oldId: entry.youtubeId, newId: result.videoId, newTitle: result.videoTitle,
      });
      found++;
      dbUpdated++;

      // Marca como processado após sucesso
      processed.add(entry.id);

    } catch (e) {
      errors++;
      const errMsg = e instanceof Error ? e.message : String(e);
      // Quota esgotada (429) ou chave inválida (403) — NÃO marca como processado,
      // para que seja retentado no próximo run (amanhã, quando a quota recriar).
      if (errMsg.includes("429") || errMsg.includes("403")) {
        console.error(`\nQuota esgotada (${errMsg.includes("429") ? "429" : "403"}). Parando — rode novamente amanhã.`);
        saveProgress(processed);
        saveChanges(changes);
        break;
      }
      // Outros erros (rede, etc.) — marca como processado para não bloquear
      console.error(`\nErro em "${entry.title}": ${errMsg.substring(0, 80)}`);
      processed.add(entry.id);
    }
    if ((i + 1) % 10 === 0) {
      saveProgress(processed);
      saveChanges(changes);
    }
    await sleep(DELAY_MS);
  }

  // Salva estado final
  saveProgress(processed);
  saveChanges(changes);
  await db.$disconnect();

  const remaining = allDead.length - processed.size;
  console.log("\n");
  console.log("=== RESULTADO DO RUN ===");
  console.log(`✅ Substitutos encontrados e salvos: ${found}`);
  console.log(`❌ Sem substituto:                  ${notFound}`);
  console.log(`🔧 Erros:                           ${errors}`);
  console.log(`📦 Atualizações no banco:           ${dbUpdated}`);
  console.log(`📋 Restam para próximos runs:        ${remaining}`);
  console.log("");
  if (remaining > 0) {
    const runsLeft = Math.ceil(remaining / MAX_PER_RUN);
    console.log(`▶ Rode novamente (${runsLeft}x) para processar os restantes.`);
  } else {
    console.log("🎉 Todos os tracks foram processados!");
  }
  console.log(`Log de mudanças: ${CHANGES_PATH}`);
}

main().catch(e => { console.error(e); process.exit(1); });
