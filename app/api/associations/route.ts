import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const currentId = searchParams.get("currentId");
  const name = searchParams.get("name");
  const franchiseId = searchParams.get("franchiseId");

  if (!name || !franchiseId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const baseName = name.replace(/\s*\(.*?\)/g, "").trim();

  // Search Collectibles
  const relatedCollectibles = await db.collectible.findMany({
    where: {
      franchiseId,
      name: { contains: baseName, mode: "insensitive" },
      ...(currentId && { id: { not: currentId } }),
    },
    take: 8,
    select: {
      id: true,
      name: true,
      type: true,
      smashGameVersion: true,
      assetRenderUrl: true,
    },
    orderBy: {
      smashGameVersion: "desc",
    },
  });

  // Search Fighters
  const relatedFighters = await db.fighter.findMany({
    where: {
      franchiseId,
      name: { contains: baseName, mode: "insensitive" },
      ...(currentId && { id: { not: currentId } }),
    },
    take: 8,
    select: {
      id: true,
      name: true,
      imageUrl: true,
    },
  });

  const TYPE_LABELS: Record<string, string> = {
    TROPHY: "Troféu",
    STICKER: "Sticker",
    SPIRIT: "Spirit",
    SPRITE: "Sprite",
  };

  const GAME_LABELS: Record<string, string> = {
    SSB64: "64",
    SSBM: "Melee",
    SSBB: "Brawl",
    SSB4: "Smash 4",
    SSBU: "Ultimate",
  };

  type AssocItem = {
    id: string;
    name: string;
    typeLabel: string;
    gameLabel: string;
    url: string | null;
    href: string;
  };

  const combined: AssocItem[] = [];

  for (const f of relatedFighters) {
    if (combined.length >= 8) break;
    combined.push({
      id: f.id,
      name: f.name,
      typeLabel: "Fighter",
      gameLabel: "Smash",
      url: f.imageUrl,
      href: `/fighters/${encodeURIComponent(f.name)}`,
    });
  }

  for (const c of relatedCollectibles) {
    if (combined.length >= 8) break;
    if (c.type === "MEDIA") continue; // Skip media
    combined.push({
      id: c.id,
      name: c.name,
      typeLabel: TYPE_LABELS[c.type] || c.type,
      gameLabel: GAME_LABELS[c.smashGameVersion] || c.smashGameVersion,
      url: c.assetRenderUrl,
      href: `/collectibles?type=${c.type}&game=${c.smashGameVersion}&trophy=${c.id}`,
    });
  }

  return NextResponse.json(combined);
}
