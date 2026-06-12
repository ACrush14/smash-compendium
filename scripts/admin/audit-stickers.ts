import { db } from "../../lib/db";

async function main() {
  const stickers = await db.collectible.findMany({
    where: { type: "STICKER" },
    select: { id: true, name: true, orderIndex: true },
    orderBy: { orderIndex: "asc" },
  });

  const byIndex = new Map<number, typeof stickers>();
  for (const s of stickers) {
    if (!s.orderIndex) continue;
    const arr = byIndex.get(s.orderIndex) ?? [];
    arr.push(s);
    byIndex.set(s.orderIndex, arr);
  }

  const dups = [...byIndex.entries()].filter(([, arr]) => arr.length > 1);
  console.log(`Duplicated orderIndex: ${dups.length} cases`);

  const indices = [...byIndex.keys()].sort((a, b) => a - b);
  const max = indices[indices.length - 1] ?? 0;
  const missing: number[] = [];
  for (let i = 1; i <= max; i++) {
    if (!byIndex.has(i)) missing.push(i);
  }
  console.log(`Missing numbers: ${missing.length} (out of 1–${max})`);
  console.log(`Missing: ${missing.slice(0, 30).join(", ")}`);
  console.log(`Total DB stickers: ${stickers.length}`);
  console.log(`Unique indices: ${byIndex.size}`);
}
main().catch(console.error);
