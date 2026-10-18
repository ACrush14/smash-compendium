import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://smashcompendium.com";

// Regenerado a cada 24 h; lutadores e franquias vêm do banco.
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [fighters, franchises] = await Promise.all([
    db.fighter.findMany({ select: { name: true } }),
    db.franchise.findMany({ select: { name: true } }),
  ]);

  const fixed = [
    "/", "/fighters", "/collectibles", "/collectibles?type=SPIRIT", "/collectibles?type=STICKER&game=SSBB",
    "/collectibles?type=TROPHY&game=SSBM", "/collectibles?type=TROPHY&game=SSBB", "/collectibles?type=TROPHY&game=SSB4",
    "/chronicles", "/franchise", "/music",
  ].map(path => ({ url: `${SITE}${path}`, changeFrequency: "weekly" as const, priority: path === "/" ? 1 : 0.7 }));

  return [
    ...fixed,
    ...fighters.map(f => ({ url: `${SITE}/fighters/${encodeURIComponent(f.name)}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...franchises.map(f => ({ url: `${SITE}/franchise/${encodeURIComponent(f.name)}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
