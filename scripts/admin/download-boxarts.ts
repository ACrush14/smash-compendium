/**
 * Baixa as capas de jogos do Chronicles (ChronicleEntry.boxArtUrl — hosts variados, média 235 KB, até ~1 MB)
 * e gera WebP leves:
 *   public/assets/boxarts/<hash>.webp     (≤360px — cartões do Chronicles)
 *   public/assets/boxarts/sm/<hash>.webp  (≤160px — capas pequenas nos viewers)
 * <hash> = urlKey(url) (lib/media-config.ts). O site usa boxArtLocalUrl() com fallback para a URL original.
 * Não altera o banco. Retoma de onde parou. Educado com cada servidor (≥1,2 s entre pedidos ao mesmo host).
 *
 *   npx tsx --env-file=.env.local scripts/admin/download-boxarts.ts
 */
import sharp from "sharp";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { db } from "../../lib/db";
import { urlKey } from "../../lib/media-config";

const OUT = path.join(process.cwd(), "public", "assets", "boxarts");
const FAILED = path.join(process.cwd(), "data", "boxarts-failed.json");
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const WORKERS = 6;
const HOST_GAP_MS = 1200;
// Hosts que limitam pedidos (429 com 1,2 s): a Wikimedia pede ritmo baixo e User-Agent identificável.
const SLOW_HOSTS: Record<string, number> = { "upload.wikimedia.org": 4000 };
const UA = "SmashCompendium/1.0 (https://github.com/ACrush14/smash-compendium; projeto academico fan-made) node-fetch";

async function fetchBuffer(url: string): Promise<Buffer> {
  for (let attempt = 1; ; attempt++) {
    // Alguns hosts (ex.: Wikia) exigem Referer da própria origem; é inofensivo nos demais.
    const res = await fetch(url, { headers: { "User-Agent": UA, Referer: new URL(url).origin + "/" }, signal: AbortSignal.timeout(30000) });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    if ((res.status === 429 || res.status >= 500) && attempt < 5) {
      const ra = Number(res.headers.get("retry-after"));
      await sleep(Number.isFinite(ra) && ra > 0 ? Math.min(ra, 60) * 1000 : 5000 * 2 ** attempt);
      continue;
    }
    throw new Error(`HTTP ${res.status}`);
  }
}

async function main() {
  mkdirSync(path.join(OUT, "sm"), { recursive: true });
  const rows = await db.chronicleEntry.findMany({ where: { boxArtUrl: { not: null } }, select: { boxArtUrl: true } });
  const all = [...new Set(rows.map(r => r.boxArtUrl!).filter(u => /^https?:\/\//i.test(u)))];
  const todo = all.filter(u => { const k = urlKey(u); return !existsSync(path.join(OUT, `${k}.webp`)) || !existsSync(path.join(OUT, "sm", `${k}.webp`)); });
  console.log(`${all.length} capas únicas; ${todo.length} a baixar.`);

  const lastByHost = new Map<string, number>();
  const failed: { url: string; error: string }[] = [];
  let ok = 0, bytesIn = 0, bytesOut = 0, next = 0;

  const worker = async () => {
    for (;;) {
      const url = todo[next++];
      if (!url) return;
      let host = "x"; try { host = new URL(url).host; } catch { /* ignora */ }
      const gap = SLOW_HOSTS[host] ?? HOST_GAP_MS;
      const wait = (lastByHost.get(host) ?? 0) + gap - Date.now();
      lastByHost.set(host, Math.max(Date.now(), (lastByHost.get(host) ?? 0) + gap));
      if (wait > 0) await sleep(wait);
      try {
        const buf = await fetchBuffer(url);
        bytesIn += buf.length;
        const base = sharp(buf, { limitInputPixels: false });
        const md = await base.clone().resize({ width: 360, height: 360, fit: "inside", withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toBuffer();
        const sm = await base.clone().resize({ width: 160, height: 160, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
        const k = urlKey(url);
        writeFileSync(path.join(OUT, `${k}.webp`), md);
        writeFileSync(path.join(OUT, "sm", `${k}.webp`), sm);
        bytesOut += md.length + sm.length; ok++;
      } catch (e) {
        failed.push({ url, error: String(e).slice(0, 120) });
      }
      const n = ok + failed.length;
      if (n % 50 === 0) console.log(`${n}/${todo.length}  ${(bytesIn / 1048576).toFixed(0)} MB → ${(bytesOut / 1048576).toFixed(1)} MB  (${failed.length} falhas)`);
    }
  };
  await Promise.all(Array.from({ length: WORKERS }, worker));
  if (failed.length) writeFileSync(FAILED, JSON.stringify(failed, null, 2));
  console.log(`Concluído: ${ok} ok, ${failed.length} falhas. ${(bytesIn / 1048576).toFixed(0)} MB → ${(bytesOut / 1048576).toFixed(1)} MB`);
  process.exit(0);
}

main();
