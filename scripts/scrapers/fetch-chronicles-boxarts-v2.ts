/**
 * fetch-chronicles-boxarts-v2.ts
 *
 * Versão corrigida que:
 *   - Usa entry.wikiUrl diretamente (já são URLs completas)
 *   - Suporta Wikipedia (upload.wikimedia.org) e MarioWiki (mario.wiki.gallery)
 *   - Converte thumbnails para imagens em resolução completa
 *   - Salva boxArtUrl no banco (URL externa, não download)
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/scrapers/fetch-chronicles-boxarts-v2.ts
 *   npx tsx --env-file=.env.local scripts/scrapers/fetch-chronicles-boxarts-v2.ts --dry-run
 *   npx tsx --env-file=.env.local scripts/scrapers/fetch-chronicles-boxarts-v2.ts --limit 20
 *   npx tsx --env-file=.env.local scripts/scrapers/fetch-chronicles-boxarts-v2.ts --console "GAME & WATCH"
 */

import * as cheerio from "cheerio";
import { PrismaClient } from "@prisma/client";

const db    = new PrismaClient();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const UA    = "SmashCompendiumBot/1.0 (academic fan project; contact: anderson.crush.link@gmail.com)";

// Args
const args     = process.argv.slice(2);
const DRY_RUN  = args.includes("--dry-run");
const LIMIT    = parseInt(args.find((a) => a.startsWith("--limit="))?.split("=")[1] ?? "0") || 0;
const CONSOLE_FILTER = args.find((a) => a.startsWith("--console="))?.split("=").slice(1).join("=") ?? "";

// ── Extract box art URL from a Wikipedia or MarioWiki page ───────────────────
async function extractBoxArtUrl(pageUrl: string): Promise<string | null> {
  try {
    const res = await fetch(pageUrl, {
      headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" },
      signal:  AbortSignal.timeout(15_000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const $    = cheerio.load(html);

    let imgUrl: string | null = null;

    // Try infobox selectors — iterate ALL imgs in each selector, not just first
    const selectors = [
      ".infobox-image img",
      "table.infobox img",
      ".infobox img",
    ];

    for (const sel of selectors) {
      if (imgUrl) break;
      $(sel).each((_, el) => {
        if (imgUrl) return;
        const raw = $(el).attr("src") ?? $(el).attr("data-src") ?? "";
        if (!raw) return;
        let resolved = raw.startsWith("//") ? `https:${raw}` : raw;
        // Accept images from Wikimedia or MarioWiki CDN (skip license icons/SVGs)
        if (resolved.includes("upload.wikimedia.org") || resolved.includes("wiki.gallery")) {
          if (resolved.match(/cc-by|cc-0|creative.commons|copyright|license|poweredby/i)) return;
          if (resolved.match(/\.svg(?:\.png)?/i)) return;  // SVG badges
          if (resolved.match(/Cscr-|featured|disambig|question_mark|OOjs_UI|search/i)) return;
          imgUrl = resolved;
        }
      });
    }

    if (!imgUrl) {
      // Broader search — any img with wikimedia/mariowiki CDN
      $("img").each((_, el) => {
        if (imgUrl) return;
        const raw = $(el).attr("src") ?? $(el).attr("data-src") ?? "";
        let resolved = raw.startsWith("//") ? `https:${raw}` : raw;
        if (resolved.includes("upload.wikimedia.org") || resolved.includes("mario.wiki.gallery")) {
          // Skip icons/logos/flags/licenses
          if (resolved.match(/\/(Wikidata|Commons|Portal|Book|Flag|Icon|Edit|Lock|Arrow|Wikipedia|Sound|Ambox|folder)/i)) return;
          if (resolved.match(/\.svg(?:\?|$|\.png)/i)) return;
          if (resolved.match(/cc-by|cc-0|creative\.commons|copyright|license|poweredby|mediawiki/i)) return;
          imgUrl = resolved;
        }
      });
    }

    if (!imgUrl) return null;

    // Convert thumbnail URL to full resolution
    // wikipedia: /thumb/a/ab/file.jpg/200px-file.jpg → /a/ab/file.jpg
    // mariowiki: /images/thumb/a/ab/file.jpg/250px-file.jpg → /images/a/ab/file.jpg
    if (imgUrl.includes("/thumb/")) {
      imgUrl = imgUrl.replace("/thumb/", "/").replace(/\/\d+px-[^/]+$/, "");
    }

    return imgUrl;
  } catch {
    return null;
  }
}

async function main() {
  const where: any = {
    boxArtUrl: null,
    wikiUrl:   { not: null },
  };
  if (CONSOLE_FILTER) where.consoleName = CONSOLE_FILTER;

  const entries = await db.chronicleEntry.findMany({
    where,
    orderBy: [{ consoleName: "asc" }, { titleNtsc: "asc" }],
    ...(LIMIT > 0 ? { take: LIMIT } : {}),
  });

  console.log(`\nChronicleEntry: ${entries.length} without boxArt and with wikiUrl${DRY_RUN ? " [DRY RUN]" : ""}\n`);

  let saved = 0, failed = 0;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]!;
    const wikiUrl = entry.wikiUrl!;
    process.stdout.write(`[${i+1}/${entries.length}] ${entry.consoleName} — ${entry.titleNtsc}… `);

    const imgUrl = await extractBoxArtUrl(wikiUrl);

    if (imgUrl) {
      if (!DRY_RUN) {
        await db.chronicleEntry.update({
          where: { id: entry.id },
          data:  { boxArtUrl: imgUrl },
        });
      }
      const fname = imgUrl.split("/").pop()?.substring(0, 45) ?? imgUrl;
      console.log(`✅ ${fname}`);
      saved++;
    } else {
      console.log(`❌ no image`);
      failed++;
    }

    // Polite delay
    await sleep(1300 + Math.random() * 400);
    // Extra pause every 30 requests to avoid rate limiting
    if ((i + 1) % 30 === 0 && i < entries.length - 1) {
      console.log("   [pausing 5s to avoid rate limit]");
      await sleep(5000);
    }
  }

  console.log(`\n✅ Done. Saved: ${saved} | Failed: ${failed} | Total: ${entries.length}`);
}

main().catch(console.error).finally(() => db.$disconnect());
