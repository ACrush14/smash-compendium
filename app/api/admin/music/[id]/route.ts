import { revalidateSite } from "@/lib/cache";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PATCH /api/admin/music/[id] — update a fighter's music data
async function _PATCH(
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

export async function PATCH(...args: Parameters<typeof _PATCH>) {
  const res = await _PATCH(...args);
  revalidateSite(); // mostra a edição no site público sem esperar o cache expirar
  return res;
}
