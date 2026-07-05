import fs from "fs";
import path from "path";
import { db } from "../../lib/db";

// Uso: npx tsx --env-file=.env.local scripts/admin/apply-collectible-pt-translations.ts <dir>
// Aplica todos os arquivos *.pt.json de <dir> (shape: [{id, descriptionPt}]) via updateMany em lote.
async function main() {
  const dir = process.argv[2];
  if (!dir) { console.log("Uso: apply-collectible-pt-translations.ts <dir>"); return; }

  const files = fs.readdirSync(dir).filter(f => f.endsWith(".pt.json"));
  console.log(`Encontrados ${files.length} arquivos .pt.json`);

  let totalUpdated = 0;
  let totalSkippedEmpty = 0;
  const seenIds = new Set<string>();

  for (const file of files) {
    const full = path.join(dir, file);
    const items: { id: string; descriptionPt: string }[] = JSON.parse(fs.readFileSync(full, "utf-8"));
    let fileUpdated = 0;
    for (const item of items) {
      if (seenIds.has(item.id)) continue; // evita duplicar update se um id aparecer em 2 arquivos
      seenIds.add(item.id);
      if (!item.descriptionPt || !item.descriptionPt.trim()) { totalSkippedEmpty++; continue; }
      await db.collectible.update({
        where: { id: item.id },
        data: { descriptionPt: item.descriptionPt },
      });
      fileUpdated++;
    }
    console.log(`  ${file}: ${fileUpdated}/${items.length} aplicados`);
    totalUpdated += fileUpdated;
  }

  console.log(`\n✅ Total aplicado: ${totalUpdated} | pulados (vazio): ${totalSkippedEmpty}`);
  await db.$disconnect();
}
main().catch(console.error);
