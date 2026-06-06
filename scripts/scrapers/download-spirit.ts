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
      if (res.statusCode !== 200) return reject(new Error(`Status ${res.statusCode}`));
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
  const dest = path.join(process.cwd(), "public", "assets", "media", "ness", "spirit.png");
  console.log("Downloading Spirit...");
  try {
    await downloadFile("https://ssb.wiki.gallery/images/7/71/SSBU_spirit_Ness.png", dest);
    console.log("Downloaded!");
    
    await db.collectible.update({
      where: { id: "SPIRIT-SSBU-Ness-563" },
      data: { assetRenderUrl: "/assets/media/ness/spirit.png" }
    });
    console.log("DB updated!");
  } catch (e) {
    console.error("Failed:", e);
  }
}

main().finally(() => db.$disconnect());
