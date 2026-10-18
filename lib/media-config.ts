/**
 * CDN/media URL configuration.
 *
 * Set NEXT_PUBLIC_CDN_BASE_URL in .env.local (and Vercel env) to a CDN origin
 * (e.g. https://pub-xxx.r2.dev) to serve large video/asset files from the CDN.
 * When the variable is absent, paths fall back to localhost (for dev only).
 *
 * Files in gitignore (public/videos/, public/assets/media/) must be hosted on
 * an external CDN for production. See docs/ARCHITECTURE.md § Media Assets.
 */

const CDN = process.env.NEXT_PUBLIC_CDN_BASE_URL ?? "";

/**
 * Resolves a local public path to a CDN URL when CDN_BASE is set.
 * Absolute URLs (http/https) pass through unchanged.
 */
export function cdnUrl(localPath: string): string {
  if (!localPath || !CDN || localPath.startsWith("http")) return localPath;
  return `${CDN}${localPath}`;
}

/**
 * Full-length showcase videos em WebM 720p sem áudio (gerados por scripts/admin/convert-videos-webm.ts;
 * os MP4 originais continuam em public/videos/ para os scripts de timestamp). Nunca vão para o git.
 * These are referenced by timestamp (videoStartSec/videoEndSec) from the DB.
 *
 * Upload path: split per fighter with scripts/admin/split-fighters-video.ts,
 * then upload clips to CDN and update Bio.videoStartSec = 0 per fighter.
 * OR upload full videos to a CDN with ≥ 3 GB free (Cloudflare R2 paid).
 */
export const FULL_VIDEOS: Record<string, string> = {
  SSBM:      cdnUrl("/videos/full_video_Zoomzike_720p.webm"),
  SSBB:      cdnUrl("/videos/full_video_brawl_720p.webm"),
  SSB4:      cdnUrl("/videos/full_video_ssb4_wiiu_720p.webm"),
  SSB4_WIIU: cdnUrl("/videos/full_video_ssb4_wiiu_720p.webm"),
  SSB4_3DS:  cdnUrl("/videos/full_video_ssb4_3ds_720p.webm"),
  SSB64:     cdnUrl("/videos/full_SSB64_video_720p.webm"),
};

const WIKI_IMG = /^https:\/\/ssb\.wiki\.gallery\/images\/[0-9a-f]\/[0-9a-f]{2}\/([^/?#]+)\.png$/i;

/** Nome de arquivo local (sem extensão) de uma imagem do ssb.wiki.gallery, ou null se a URL não for dessas. */
export function wikiImageKey(url: string): string | null {
  const m = url.match(WIKI_IMG);
  if (!m || !m[1]) return null;
  let name = m[1];
  try { name = decodeURIComponent(name); } catch { /* mantém */ }
  return name.replace(/[^A-Za-z0-9._-]+/g, "_");
}

const isTrophyKey = (k: string) => /trophy/i.test(k);
const isRenderKey = (k: string) => /_SSBU$/i.test(k); // renders dos lutadores (ex.: Ness_SSBU)

export type ImageTier = "thumb" | "md" | "full";

/**
 * Versão local leve de uma imagem, por tamanho:
 *  - thumb  (≤128px)  listas e carrosséis
 *  - md     (≤400px)  cartões de grade (só renders de lutador; troféus não têm md)
 *  - full   (≤512px troféus / ≤1024px renders)
 * Origens tratadas:
 *  - /assets/collectibles/X.(png|jpg)         -> /assets/collectibles/thumbs/X.webp (só thumb; o original já é ≤600px)
 *  - ssb.wiki.gallery ... Nome(Trophy...).png -> /assets/trophies/[thumbs/]Nome.webp
 *  - ssb.wiki.gallery ... Nome_SSBU.png       -> /assets/renders/[thumbs/|md/]Nome_SSBU.webp
 * Geradas por scripts/admin/optimize-images.ts, download-trophy-images.ts e download-fighter-renders.ts.
 * Outras URLs passam sem mudança. Use com fallback para a URL original (o SkeletonImage já faz isso).
 */
export function localImageUrl(url: string | null | undefined, tier: ImageTier): string {
  if (!url) return "";
  if (tier === "thumb") {
    const m = url.match(/^\/assets\/collectibles\/([^/]+)\.(?:png|jpe?g)$/i);
    if (m) return `/assets/collectibles/thumbs/${m[1]}.webp`;
  }
  const key = wikiImageKey(url);
  if (!key) return url;
  if (isTrophyKey(key)) return `/assets/trophies/${tier === "thumb" ? "thumbs/" : ""}${key}.webp`;
  if (isRenderKey(key)) return `/assets/renders/${tier === "full" ? "" : tier === "md" ? "md/" : "thumbs/"}${key}.webp`;
  return url;
}

export const thumbUrl = (url: string | null | undefined) => localImageUrl(url, "thumb");
export const fullImageUrl = (url: string | null | undefined) => localImageUrl(url, "full");
export const mdImageUrl = (url: string | null | undefined) => localImageUrl(url, "md");
