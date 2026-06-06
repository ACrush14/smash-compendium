import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PATCH /api/admin/music/[id] — update a fighter's music data
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { musicYoutubeId, musicTitle, musicArtist, musicStatus } = body;

  const fighter = await db.fighter.update({
    where: { id: params.id },
    data: {
      ...(musicYoutubeId !== undefined && { musicYoutubeId }),
      ...(musicTitle     !== undefined && { musicTitle }),
      ...(musicArtist    !== undefined && { musicArtist }),
      ...(musicStatus    !== undefined && { musicStatus }),
    },
    select: { id: true, name: true, musicYoutubeId: true, musicTitle: true, musicStatus: true },
  });

  return NextResponse.json(fighter);
}
