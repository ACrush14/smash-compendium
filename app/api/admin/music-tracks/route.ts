import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/music-tracks → list stage music tracks
export async function GET() {
  const tracks = await db.music.findMany({
    orderBy: [{ franchise: { name: "asc" } }, { title: "asc" }],
    include: { franchise: { select: { name: true } } },
  });
  return NextResponse.json(tracks);
}

// POST /api/admin/music-tracks → create stage music track
// Body: { title, franchiseId, arranger?, isRemix? }
export async function POST(req: NextRequest) {
  const body = await req.json() as {
    title:       string;
    franchiseId: string;
    arranger?:   string | null;
    isRemix?:    boolean;
  };

  if (!body.title?.trim())       return NextResponse.json({ error: "title is required" }, { status: 400 });
  if (!body.franchiseId?.trim()) return NextResponse.json({ error: "franchiseId is required" }, { status: 400 });

  const track = await db.music.create({
    data: {
      title:       body.title.trim(),
      franchiseId: body.franchiseId.trim(),
      arranger:    body.arranger || null,
      isRemix:     body.isRemix ?? false,
    },
  });

  return NextResponse.json(track, { status: 201 });
}
