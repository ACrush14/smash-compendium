import fs from "fs";
import path from "path";
import { db } from "../../lib/db";

// Uso: npx tsx --env-file=.env.local scripts/admin/export-collectibles-need-pt.ts TROPHY <outDir> <chunkSize>
async function main() {
  const type = (process.argv[2] || "TROPHY") as "TROPHY" | "SPIRIT" | "STICKER";
  const outDir = process.argv[3] || "./pt_batches";
  const chunkSize = parseInt(process.argv[4] || "250", 10);

  const items = await db.collectible.findMany({
    where: { type, descriptionEn: { not: null }, descriptionPt: null },
    select: { id: true, name: true, descriptionEn: true },
    orderBy: { id: "asc" },
  });

  fs.mkdirSync(outDir, { recursive: true });

  let chunkIndex = 0;
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const filePath = path.join(outDir, `${type.toLowerCase()}_chunk_${chunkIndex}.json`);
    fs.writeFileSync(filePath, JSON.stringify(chunk, null, 2), "utf-8");
    console.log(`Wrote ${filePath} (${chunk.length} items)`);
    chunkIndex++;
  }
  console.log(`✅ Total ${items.length} items in ${chunkIndex} chunks for ${type}`);
  await db.$disconnect();
}
main().catch(console.error);
