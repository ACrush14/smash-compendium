/**
 * import-curated.ts
 *
 * Aplica as edições do curated-data.json de volta ao banco.
 * Só atualiza campos que foram preenchidos (não sobrescreve com null).
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/admin/import-curated.ts
 *   npx tsx --env-file=.env.local scripts/admin/import-curated.ts --dry-run
 *   npx tsx --env-file=.env.local scripts/admin/import-curated.ts --file=meu-arquivo.json
 */

import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const db      = new PrismaClient();
const args    = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const FILE    = args.find(a => a.startsWith("--file="))?.split("=")[1]
                ?? join(process.cwd(), "scripts/admin/curated-data.json");

interface CuratedEntry {
  id:        string;
  wikiUrl:   string | null;
  boxArtUrl: string | null;
}

async function main() {
  const raw:  CuratedEntry[] = JSON.parse(readFileSync(FILE, "utf-8"));
  const entries = raw.filter(e => e.id);

  console.log(`\nImportando ${entries.length} entradas de ${FILE}${DRY_RUN ? " [DRY RUN]" : ""}\n`);

  let updated = 0, skipped = 0;

  for (const e of entries) {
    const data: any = {};
    if (e.wikiUrl   !== undefined) data.wikiUrl   = e.wikiUrl   || null;
    if (e.boxArtUrl !== undefined) data.boxArtUrl = e.boxArtUrl || null;

    if (Object.keys(data).length === 0) { skipped++; continue; }

    if (!DRY_RUN) {
      await db.chronicleEntry.update({ where: { id: e.id }, data });
    }

    const flags = [];
    if (data.wikiUrl)   flags.push("wiki");
    if (data.boxArtUrl) flags.push("art");
    console.log(`  ✅ ${(e as any)._titleNtsc ?? e.id}  [${flags.join(", ")}]`);
    updated++;
  }

  console.log(`\n✅ Atualizados: ${updated} | Ignorados: ${skipped}`);
  await db.$disconnect();
}

main().catch(console.error);
