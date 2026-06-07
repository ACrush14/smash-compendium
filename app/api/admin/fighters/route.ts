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
