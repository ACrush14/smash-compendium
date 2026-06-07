import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PATCH /api/admin/fighters/[id]
// Accepts any subset of fighter scalar fields.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json() as {
    curationStatus?:      string;
    curationNotes?:       string | null;
    imageUrl?:            string | null;
    curatorOverviewEn?:   string | null;
    curatorOverviewPt?:   string | null;
    curatorOverviewJp?:   string | null;
    curatorOverviewJpEn?: string | null;
    musicYoutubeId?:      string | null;
    musicTitle?:          string | null;
    musicArtist?:         string | null;
    musicStatus?:         string;
  };

  const updated = await db.fighter.update({
    where: { id },
    data: {
      ...(body.curationStatus      !== undefined && { curationStatus:      body.curationStatus      }),
      ...(body.curationNotes       !== undefined && { curationNotes:       body.curationNotes       }),
      ...(body.imageUrl            !== undefined && { imageUrl:            body.imageUrl            }),
      ...(body.curatorOverviewEn   !== undefined && { curatorOverviewEn:   body.curatorOverviewEn   }),
      ...(body.curatorOverviewPt   !== undefined && { curatorOverviewPt:   body.curatorOverviewPt   }),
      ...(body.curatorOverviewJp   !== undefined && { curatorOverviewJp:   body.curatorOverviewJp   }),
      ...(body.curatorOverviewJpEn !== undefined && { curatorOverviewJpEn: body.curatorOverviewJpEn }),
      ...(body.musicYoutubeId      !== undefined && { musicYoutubeId:      body.musicYoutubeId      }),
      ...(body.musicTitle          !== undefined && { musicTitle:          body.musicTitle          }),
      ...(body.musicArtist         !== undefined && { musicArtist:         body.musicArtist         }),
      ...(body.musicStatus         !== undefined && { musicStatus:         body.musicStatus         }),
    },
    select: { id: true, curationStatus: true, curationNotes: true },
  });

  return NextResponse.json(updated);
}
