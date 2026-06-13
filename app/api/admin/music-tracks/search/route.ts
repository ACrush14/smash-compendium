import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/music-tracks/search?q=mario
// Returns up to 20 music tracks matching the title, with arranger and duration
export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 1) return NextResponse.json([]);

  const tracks = await db.music.findMany({
    where: { title: { contains: q, mode: "insensitive" } },
    select: { id: true, title: true, arranger: true, duration: true },
    orderBy: { title: "asc" },
    take: 20,
  });

  return NextResponse.json(tracks);
}
