import fs from "fs";
import https from "https";
import path from "path";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const downloadFile = (url: string, dest: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location!, dest).then(resolve).catch(reject);
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
    }).on("error", (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

async function main() {
  const mediaDir = path.join(process.cwd(), "public", "assets", "media", "ness");
  const franchisesDir = path.join(process.cwd(), "public", "assets", "franchises");
  
  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });
  if (!fs.existsSync(franchisesDir)) fs.mkdirSync(franchisesDir, { recursive: true });

  const downloads = [
    { url: "https://ssb.wiki.gallery/images/d/d5/Ness.png", dest: path.join(mediaDir, "clay.png") },
    { url: "https://ssb.wiki.gallery/images/5/51/EarthboundSymbol.svg", dest: path.join(franchisesDir, "earthbound.svg") },
    { url: "https://ssb.wiki.gallery/images/6/64/Ness_SSBM.jpg", dest: path.join(mediaDir, "melee_art.jpg") },
    { url: "https://ssb.wiki.gallery/images/a/af/Brawl_Sticker_Ness_%28EarthBound%29.png", dest: path.join(mediaDir, "brawl_sticker.png") },
    { url: "https://media.giphy.com/media/uyfVFLCly7fc535IPl/giphy.gif", dest: path.join(mediaDir, "gif1.gif") },
    { url: "https://media.giphy.com/media/yqJOmmqolCJJuQz2kW/giphy.gif", dest: path.join(mediaDir, "gif2.gif") },
    { url: "https://media.giphy.com/media/DrIQWM1MSACFiyuNc1/giphy.gif", dest: path.join(mediaDir, "gif3.gif") }
  ];

  console.log("Downloading files...");
  for (const d of downloads) {
    await downloadFile(d.url, d.dest);
    console.log(`Downloaded ${d.dest}`);
  }

  console.log("Updating DB...");
  const ness = await db.fighter.findUnique({ where: { name: "Ness" } });
  if (!ness) throw new Error("Ness not found");

  // Update Franchise
  await db.franchise.update({
    where: { id: ness.franchiseId },
    data: { svgIconUrl: "/assets/franchises/earthbound.svg" }
  });

  // Add collectibles for media vault
  const items = [
    { id: "MEDIA-Ness-clay", name: "Clay Model", smashGameVersion: "SSBM", type: "CLAY_MODEL", assetRenderUrl: "/assets/media/ness/clay.png" },
    { id: "MEDIA-Ness-meleeart", name: "Melee Artwork", smashGameVersion: "SSBM", type: "ARTWORK", assetRenderUrl: "/assets/media/ness/melee_art.jpg" },
    { id: "MEDIA-Ness-brawlstick", name: "Brawl Sticker", smashGameVersion: "SSBB", type: "ARTWORK", assetRenderUrl: "/assets/media/ness/brawl_sticker.png" },
    { id: "MEDIA-Ness-gif1", name: "GIF - PK Magnet", smashGameVersion: "SSBU", type: "GIF", assetRenderUrl: "/assets/media/ness/gif1.gif" },
    { id: "MEDIA-Ness-gif2", name: "GIF - Yo-Yo", smashGameVersion: "SSBU", type: "GIF", assetRenderUrl: "/assets/media/ness/gif2.gif" },
    { id: "MEDIA-Ness-gif3", name: "GIF - Bat", smashGameVersion: "SSBU", type: "GIF", assetRenderUrl: "/assets/media/ness/gif3.gif" }
  ];

  for (const item of items) {
    await db.collectible.upsert({
      where: { id: item.id },
      update: { assetRenderUrl: item.assetRenderUrl, name: item.name },
      create: {
        id: item.id,
        fighterId: ness.id,
        name: item.name,
        nameJp: null,
        descriptionEn: null,
        smashGameVersion: item.smashGameVersion,
        sourceType: item.type,
        assetRenderUrl: item.assetRenderUrl,
        type: "MEDIA"
      }
    });
  }
  
  console.log("Done!");
}
main().catch(console.error).finally(()=>db.$disconnect());
