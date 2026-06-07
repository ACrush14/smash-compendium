import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/fighters/[id]/collectibles?type=TROPHY
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "TROPHY";

  const items = await db.collectible.findMany({
    where: { fighterId: id, type },
    orderBy: [{ smashGameVersion: "asc" }, { name: "asc" }],
    select: {
      id: true,
      type: true,
      smashGameVersion: true,
      name: true,
      nameJp: true,
      description: true,        // EN — campo principal
      descriptionPt: true,
      descriptionJp: true,
      descriptionJpEn: true,
      assetRenderUrl: true,
      orderIndex: true,
    },
  });

  return NextResponse.json(items);
}
