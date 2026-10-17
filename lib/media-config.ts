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

/**
 * Miniatura WebP (≤128px) gerada por scripts/admin/optimize-images.ts para imagens locais de
 * /assets/collectibles. Use nas listas e carrosséis (32–44px). Outras URLs passam sem mudança.
 */
export function thumbUrl(url: string | null | undefined): string {
  if (!url) return "";
  const m = url.match(/^\/assets\/collectibles\/([^/]+)\.(?:png|jpe?g)$/i);
  return m ? `/assets/collectibles/thumbs/${m[1]}.webp` : url;
}
