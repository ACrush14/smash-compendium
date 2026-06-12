import { db } from "../../lib/db";

async function main() {
  const s = await db.collectible.findMany({
    where: { type: "STICKER", assetRenderUrl: { not: null } },
    select: { name: true, assetRenderUrl: true, orderIndex: true },
    take: 5,
    orderBy: { orderIndex: "asc" },
  });
  s.forEach(x =>
    console.log(x.name + " | " + (x.assetRenderUrl ?? "").substring(0, 100) + " | idx=" + x.orderIndex)
  );
}
main().catch(console.error);
