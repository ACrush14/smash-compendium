import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  const cf = await db.fighter.findFirst({
    where: { name: "Captain Falcon" },
    include: {
      franchise: true,
      bios: { orderBy: { smashGameVersion: "asc" } },
      works: { include: { game: true } },
      tips: true,
    },
  });
  if (!cf) { console.log("NOT FOUND"); return; }

  console.log("=== CAPTAIN FALCON ===");
  console.log("Franchise:", cf.franchise.name);
  console.log("ImageUrl:", cf.imageUrl?.substring(0, 80));
  console.log("Works:", cf.works.map(w => w.game.titleEn));
  console.log("Bios:", cf.bios.map(b => ({
    ver: b.smashGameVersion,
    hasEn: !!b.contentEn,
    enSnippet: b.contentEn?.substring(0, 60),
    hasJp: !!b.contentJp,
  })));
  console.log("Tips:", cf.tips.length);

  const trophies = await db.collectible.findMany({
    where: { fighter: { name: "Captain Falcon" }, type: "TROPHY" },
    select: { name: true, smashGameVersion: true, assetRenderUrl: true, description: true },
    orderBy: [{ smashGameVersion: "asc" }, { name: "asc" }],
  });
  console.log("\n=== TROPHIES ===");
  trophies.forEach(t => console.log(
    ` [${t.smashGameVersion}] ${t.name} | img:${!!t.assetRenderUrl} | desc:${t.description?.substring(0, 70)}`
  ));

  const spirit = await db.collectible.findFirst({
    where: { fighter: { name: "Captain Falcon" }, type: "SPIRIT" },
  });
  console.log("\n=== SPIRIT ===");
  console.log(spirit ? `${spirit.name} | desc:${spirit.description?.substring(0, 100)}` : "NONE");

  const sprites = await db.collectible.findMany({
    where: { fighter: { name: "Captain Falcon" }, type: { in: ["SPRITE","MEDIA"] } },
    select: { name: true, type: true, assetRenderUrl: true },
  });
  console.log("\n=== SPRITES/MEDIA ===");
  sprites.forEach(s => console.log(` [${s.type}] ${s.name} | ${s.assetRenderUrl?.substring(0, 80)}`));
}

main().catch(console.error).finally(() => db.$disconnect());
