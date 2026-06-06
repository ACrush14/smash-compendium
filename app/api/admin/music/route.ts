import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/music — list all fighters with music data
export async function GET() {
  const fighters = await db.fighter.findMany({
    orderBy: { rosterNumber: "asc" },
    select: {
      id:             true,
      name:           true,
      rosterNumber:   true,
      musicYoutubeId: true,
      musicTitle:     true,
      musicArtist:    true,
      musicStatus:    true,
      franchise: { select: { name: true } },
    },
  });

  return NextResponse.json(
    fighters.map((f) => ({
      id:             f.id,
      name:           f.name,
      rosterNumber:   f.rosterNumber,
      franchise:      f.franchise.name,
      musicYoutubeId: f.musicYoutubeId,
      musicTitle:     f.musicTitle,
      musicArtist:    f.musicArtist,
      musicStatus:    f.musicStatus,
    }))
  );
}
