import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/franchise/[name]
// Returns franchise data with fighters, collectibles, stages, music
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const franchise = await db.franchise.findFirst({
    where: { name: { equals: decodedName, mode: "insensitive" } },
    include: {
      fighters: {
        orderBy: { rosterNumber: "asc" },
        select: {
          id: true,
          name: true,
          rosterNumber: true,
          imageUrl: true,
          curationStatus: true,
        },
      },
      stages: {
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          smashDebutVersion: true,
          description: true,
        },
      },
      musicTracks: {
        orderBy: { title: "asc" },
        select: {
          id: true,
          title: true,
          arranger: true,
          isRemix: true,
        },
      },
    },
  });

  if (!franchise) return NextResponse.json({ error: "Franchise not found" }, { status: 404 });

  // Get all collectibles for this franchise:
  //   1. Collectibles explicitly assigned to this franchise (franchiseId set)
  //   2. Fallback: collectibles from fighters of this franchise that have no franchiseId yet
  //      (pre-migration scenario)
  const collectibles = await db.collectible.findMany({
    where: {
      OR: [
        { franchiseId: franchise.id },
        {
          franchiseId: null,
          fighter: { franchiseId: franchise.id },
        },
      ],
    },
    include: {
      fighter: { select: { name: true, rosterNumber: true } },
    },
    orderBy: [
      { type: "asc" },
      { smashGameVersion: "asc" },
      { name: "asc" },
    ],
  });

  return NextResponse.json({
    ...franchise,
    collectibles,
  });
}
