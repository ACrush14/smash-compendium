import { db } from "../lib/db";
async function main() {
  const updated = await db.collectible.update({
    where: { id: "TROPHY-SSB4-RoyKoopa" },
    data: {
      assetRenderUrl: "https://ssb.wiki.gallery/images/5/50/RoyKoopaTrophyWiiU.png",
      assetRender2Url: "https://ssb.wiki.gallery/images/b/ba/RoyKoopaTrophy3DS.png",
    },
  });
  console.log("✅", updated.name, updated.assetRenderUrl, "|", updated.assetRender2Url);
  await db.$disconnect();
}
main().catch(console.error);
