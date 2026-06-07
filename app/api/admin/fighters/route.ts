import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const q      = searchParams.get("q");

  const fighters = await db.fighter.findMany({
    where: {
      ...(status && { curationStatus: status }),
      ...(q     && { name: { contains: q, mode: "insensitive" } }),
    },
    select: {
      id:                true,
      name:              true,
      rosterNumber:      true,
      imageUrl:          true,
      curationStatus:    true,
      curationNotes:     true,
      musicStatus:       true,
      curatorOverviewEn: true,
      franchise:         { select: { name: true } },
      bios:              { select: { smashGameVersion: true } },
      works:             { select: { gameId: true } },
      collectibles:      {
        where:  { type: { in: ["TROPHY", "SPIRIT", "STICKER"] } },
        select: { type: true },
      },
    },
    orderBy: { rosterNumber: "asc" },
  });

  const result = fighters.map((f) => {
    const trophyCount  = f.collectibles.filter((c) => c.type === "TROPHY").length;
    const spiritCount  = f.collectibles.filter((c) => c.type === "SPIRIT").length;
    const stickerCount = f.collectibles.filter((c) => c.type === "STICKER").length;
    const { collectibles, curatorOverviewEn, ...rest } = f;
    return {
      ...rest,
      franchise:      f.franchise.name,
      hasCuratorText: !!curatorOverviewEn,
      biosCount:      f.bios.length,
      worksCount:     f.works.length,
      trophyCount,
      spiritCount,
      stickerCount,
    };
  });

  return NextResponse.json(result);
}

// POST /api/admin/fighters → create a new fighter (+ optional FighterWork entries)
// Body: { name, rosterNumber, franchiseId, imageUrl?, musicYoutubeId?, musicTitle?, musicArtist?,
//          works?: { gameId: string; isDebut?: boolean }[] }
export async function POST(req: NextRequest) {
  const body = await req.json() as {
    name:           string;
    rosterNumber:   string;
    franchiseId:    string;
    imageUrl?:      string | null;
    musicYoutubeId?: string | null;
    musicTitle?:     string | null;
    musicArtist?:    string | null;
    works?:          { gameId: string; isDebut?: boolean }[];
  };

  if (!body.name?.trim())         return NextResponse.json({ error: "name is required" }, { status: 400 });
  if (!body.rosterNumber?.trim()) return NextResponse.json({ error: "rosterNumber is required" }, { status: 400 });
  if (!body.franchiseId?.trim())  return NextResponse.json({ error: "franchiseId is required" }, { status: 400 });

  const fighter = await db.fighter.create({
    data: {
      name:           body.name.trim(),
      rosterNumber:   body.rosterNumber.trim(),
      franchiseId:    body.franchiseId.trim(),
      imageUrl:       body.imageUrl        || null,
      musicYoutubeId: body.musicYoutubeId  || null,
      musicTitle:     body.musicTitle      || null,
      musicArtist:    body.musicArtist     || null,
      // Create FighterWork entries if provided
      works: body.works?.length
        ? {
            create: body.works.map(w => ({
              gameId:  w.gameId,
              isDebut: w.isDebut ?? false,
            })),
          }
        : undefined,
    },
    include: {
      franchise: { select: { name: true } },
      works:     { select: { gameId: true, isDebut: true } },
    },
  });

  return NextResponse.json({
    ...fighter,
    franchise: fighter.franchise.name,
  }, { status: 201 });
}
