/**
 * fetch-batch-boxarts.ts
 *
 * Busca capas automaticamente para todas as entradas do curated-data.json
 * que têm wikiUrl mas não têm boxArtUrl. Útil após editar as wikiUrls manualmente.
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/admin/fetch-batch-boxarts.ts
 *   npx tsx --env-file=.env.local scripts/admin/fetch-batch-boxarts.ts --dry-run
 *   npx tsx --env-file=.env.local scripts/admin/fetch-batch-boxarts.ts --file=meu-arquivo.json
 *
 * O script atualiza o JSON com as boxArtUrls encontradas e salva no banco.
 */

import * as cheerio from "cheerio";
import { PrismaClient } from "@prisma/client";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const db      = new PrismaClient();
const sleep   = (ms: number) => new Promise(r => setTimeout(r, ms));
const UA      = "SmashCompendiumBot/1.0 (academic; contact: anderson.crush.link@gmail.com)";
const args    = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const FILE    = args.find(a => a.startsWith("--file="))?.split("=")[1]
                ?? join(process.cwd(), "scripts/admin/curated-data.json");

async function extractBoxArtUrl(pageUrl: string): Promise<string | null> {
  try {
    const res = await fetch(pageUrl, {
      headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" },
      signal:  AbortSignal.timeout(12_000),
    });
    if (!res.ok) return null;
    const $ = cheerio.load(await res.text());
    let imgUrl: string | null = null;

    for (const sel of [".infobox-image img", "table.infobox img", ".infobox img"]) {
      if (imgUrl) break;
      $(sel).each((_, el) => {
        if (imgUrl) return;
        const raw = $(el).attr("src") ?? $(el).attr("data-src") ?? "";
        let resolved = raw.startsWith("//") ? `https:${raw}` : raw;
        if (!resolved.includes("upload.wikimedia.org") && !resolved.includes("wiki.gallery")) return;
        if (resolved.match(/cc-by|cc-0|poweredby|license|88x31/i)) return;
        if (resolved.match(/\.svg(?:\.png)?/i)) return;
        if (resolved.match(/Cscr-|featured|disambig|logo/i)) return;
        if (resolved.includes("/thumb/")) {
          resolved = resolved.replace("/thumb/", "/").replace(/\/\d+px-[^/]+$/, "");
        }
        imgUrl = resolved;
      });
    }
    return imgUrl;
  } catch {
    return null;
  }
}

async function main() {
  const entries: any[] = JSON.parse(readFileSync(FILE, "utf-8"));
  const toProcess = entries.filter(e => e.wikiUrl && !e.boxArtUrl);

  console.log(`\nProcessando ${toProcess.length} entradas com wikiUrl mas sem boxArtUrl${DRY_RUN ? " [DRY RUN]" : ""}\n`);

  let saved = 0, failed = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const e = toProcess[i]!;
    process.stdout.write(`[${i+1}/${toProcess.length}] ${e._consoleName ?? e.consoleName} — ${e._titleNtsc ?? e.titleNtsc}… `);

    const imgUrl = await extractBoxArtUrl(e.wikiUrl);

    if (imgUrl) {
      e.boxArtUrl = imgUrl;
      console.log(`✅ ${imgUrl.split("/").pop()?.substring(0, 50)}`);
      if (!DRY_RUN) {
        await db.chronicleEntry.update({ where: { id: e.id }, data: { boxArtUrl: imgUrl } });
      }
      saved++;
    } else {
      console.log(`❌ não encontrado`);
      failed++;
    }

    await sleep(1200 + Math.random() * 400);
    if ((i + 1) % 30 === 0 && i < toProcess.length - 1) {
      console.log("   [pausa 5s]");
      await sleep(5000);
    }
  }

  // Salva JSON atualizado
  writeFileSync(FILE, JSON.stringify(entries, null, 2), "utf-8");
  console.log(`\n✅ Salvos: ${saved} | Falhas: ${failed}`);
  console.log(`   JSON atualizado em: ${FILE}`);

  await db.$disconnect();
}

main().catch(console.error);
