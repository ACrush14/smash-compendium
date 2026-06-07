/**
 * export-missing.ts
 *
 * Exporta entradas do Chronicles que precisam de atenção para um JSON editável.
 * Após editar o JSON, use `import-curated.ts` para aplicar de volta ao banco.
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/admin/export-missing.ts
 *   npx tsx --env-file=.env.local scripts/admin/export-missing.ts --filter=missing_wiki
 *   npx tsx --env-file=.env.local scripts/admin/export-missing.ts --filter=missing_art
 *   npx tsx --env-file=.env.local scripts/admin/export-missing.ts --console="GAME BOY"
 *
 * Output: scripts/admin/curated-data.json
 */

import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "fs";
import { join } from "path";

const db = new PrismaClient();

const args        = process.argv.slice(2);
const filter      = args.find(a => a.startsWith("--filter="))?.split("=")[1] ?? "missing_art";
const consoleArg  = args.find(a => a.startsWith("--console="))?.split("=").slice(1).join("=") ?? "";
const OUTPUT      = join(process.cwd(), "scripts/admin/curated-data.json");

async function main() {
  const where: any = {};
  if (filter === "missing_wiki")       where.wikiUrl   = null;
  if (filter === "missing_art")        where.boxArtUrl = null;
  if (filter === "missing_wiki_or_art") where.OR = [{ wikiUrl: null }, { boxArtUrl: null }];
  if (consoleArg) where.consoleName = consoleArg;

  const entries = await db.chronicleEntry.findMany({
    where,
    orderBy: [{ consoleName: "asc" }, { titleNtsc: "asc" }],
    select: {
      id: true, consoleName: true, titleNtsc: true, titlePal: true, titleJp: true,
      releaseDateNtsc: true, wikiUrl: true, boxArtUrl: true,
    },
  });

  // Sugestão automática de URL Wikipedia
  const withSuggestion = entries.map(e => ({
    ...e,
    // Edite estes campos:
    wikiUrl:        e.wikiUrl   ?? suggestWikiUrl(e.titleNtsc),
    boxArtUrl:      e.boxArtUrl ?? null,
    // Metadados somente-leitura:
    _console:       e.consoleName,
    _titleNtsc:     e.titleNtsc,
    _titlePal:      e.titlePal,
    _titleJp:       e.titleJp,
    _releaseDate:   e.releaseDateNtsc,
  }));

  writeFileSync(OUTPUT, JSON.stringify(withSuggestion, null, 2), "utf-8");
  console.log(`\n✅ Exportados ${entries.length} entradas para:\n   ${OUTPUT}\n`);
  console.log("📝 Edite o arquivo, depois rode:");
  console.log("   npx tsx --env-file=.env.local scripts/admin/import-curated.ts\n");

  await db.$disconnect();
}

function suggestWikiUrl(title: string): string {
  // Gera URL Wikipedia EN baseada no título NTSC
  const cleaned = title
    .replace(/\s*\(.*?\)\s*/g, "")   // remove parênteses
    .replace(/[^\w\s'-]/g, "")
    .trim()
    .replace(/\s+/g, "_");
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(cleaned)}`;
}

main().catch(console.error);
