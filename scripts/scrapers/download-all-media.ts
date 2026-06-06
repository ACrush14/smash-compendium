import fs from "fs";
import https from "https";
import path from "path";
import { db } from "../../lib/db";
import { log, politeDelay } from "./utils";

const ASSETS_DIR = path.join(process.cwd(), "public", "assets", "collectibles");

const downloadFile = (url: string, dest: string, retryCount = 0): Promise<boolean> => {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        if (!res.headers.location) return resolve(false);
        return downloadFile(res.headers.location, dest, retryCount).then(resolve);
      }
      
      if (res.statusCode !== 200) {
        if (res.statusCode === 429 && retryCount < 3) {
          log.warn(`Rate limit hit for ${url}. Retrying in 3 seconds...`);
          setTimeout(() => {
            downloadFile(url, dest, retryCount + 1).then(resolve);
          }, 3000);
          return;
        }
        log.warn(`Failed to download ${url}: HTTP ${res.statusCode}`);
        return resolve(false);
      }

      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve(true);
      });
    }).on("error", (err) => {
      log.error(`Request error for ${url}: ${err.message}`);
      fs.unlink(dest, () => resolve(false));
    });
  });
};

function getFileExtension(url: string): string {
  const match = url.match(/\.(png|jpg|jpeg|gif|webp)/i);
  return match ? match[1]!.toLowerCase() : "png";
}

async function main() {
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }

  // Pegamos todos os coletáveis que tem uma imagem do ssbwiki (que ainda não foi baixada)
  const items = await db.collectible.findMany({
    where: {
      assetRenderUrl: { startsWith: "https://" }
    }
  });

  log.step(`Iniciando o download de ${items.length} imagens de coletáveis...`);

  let downloadedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item) continue;
    const url = item.assetRenderUrl!;

    // Create safe filename
    const ext = getFileExtension(url);
    const filename = `${item.id}.${ext}`.replace(/[^a-zA-Z0-9.-]/g, "_");
    const destPath = path.join(ASSETS_DIR, filename);
    const relativeUrl = `/assets/collectibles/${filename}`;

    log.step(`[${i+1}/${items.length}] Baixando ${item.name} (${url})`);
    
    // Se o arquivo já existe, pular o download mas atualizar o banco
    let success = fs.existsSync(destPath);
    if (!success) {
      success = await downloadFile(url, destPath);
      await politeDelay(); // Wait a bit between downloads to avoid hitting limits
    }

    if (success) {
      await db.collectible.update({
        where: { id: item.id },
        data: { assetRenderUrl: relativeUrl }
      });
      downloadedCount++;
    } else {
      failedCount++;
    }
  }

  log.ok(`Download massivo concluído! Sucesso: ${downloadedCount} | Falhas: ${failedCount}`);
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
