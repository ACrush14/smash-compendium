import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/chronicles/pending?filter=all|noBoxArt|noWiki|noJp&limit=200
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") ?? "all";
  const limit  = Math.min(parseInt(searchParams.get("limit") ?? "300"), 500);

  const where =
    filter === "noBoxArt" ? { boxArtUrl: null } :
    filter === "noWiki"   ? { wikiUrl:   null } :
    filter === "noJp"     ? { titleJp:   null } :
    // "all" — missing at least one
    {
      OR: [
        { boxArtUrl: null },
        { wikiUrl:   null },
        { titleJp:   null },
      ],
    };

  const entries = await db.chronicleEntry.findMany({
    where,
    select: {
      id:              true,
      consoleName:     true,
      titleNtsc:       true,
      titleJp:         true,
      wikiUrl:         true,
      boxArtUrl:       true,
      releaseDateNtsc: true,
    },
    orderBy: [
      { consoleName: "asc" },
      { titleNtsc:   "asc" },
    ],
    take: limit,
  });

  return NextResponse.json(entries);
}
