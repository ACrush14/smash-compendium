import { revalidateSite } from "@/lib/cache";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PATCH /api/admin/collectibles/[id]
// Body: any subset of editable fields, including fighterId (null = unlink)
async function _PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json() as {
    name?:                  string;
    nameJp?:                string | null;
    description?:           string | null;
    descriptionPt?:         string | null;
    descriptionJp?:         string | null;
    descriptionJpEn?:       string | null;
    assetRenderUrl?:        string | null;
    fighterId?:             string | null;
    franchiseId?:           string | null;
    spiritArtworkSource?:   string | null;
    spiritFirstAppearance?: string | null;
    spiritMusicTitle?:      string | null;
    spiritMusicArtist?:     string | null;
    spiritMusicDuration?:   string | null;
    spiritCuratorComment?:  string | null;
  };

  const updated = await db.collectible.update({
    where: { id },
    data: {
      ...(body.name                  !== undefined && { name:                  body.name                  }),
      ...(body.nameJp                !== undefined && { nameJp:                body.nameJp                }),
      ...(body.description           !== undefined && { description:           body.description           }),
      ...(body.descriptionPt         !== undefined && { descriptionPt:         body.descriptionPt         }),
      ...(body.descriptionJp         !== undefined && { descriptionJp:         body.descriptionJp         }),
      ...(body.descriptionJpEn       !== undefined && { descriptionJpEn:       body.descriptionJpEn       }),
      ...(body.assetRenderUrl        !== undefined && { assetRenderUrl:        body.assetRenderUrl        }),
      ...(body.fighterId             !== undefined && { fighterId:             body.fighterId             }),
      ...(body.franchiseId           !== undefined && { franchiseId:           body.franchiseId           }),
      ...(body.spiritArtworkSource   !== undefined && { spiritArtworkSource:   body.spiritArtworkSource   }),
      ...(body.spiritFirstAppearance !== undefined && { spiritFirstAppearance: body.spiritFirstAppearance }),
      ...(body.spiritMusicTitle      !== undefined && { spiritMusicTitle:      body.spiritMusicTitle      }),
      ...(body.spiritMusicArtist     !== undefined && { spiritMusicArtist:     body.spiritMusicArtist     }),
      ...(body.spiritMusicDuration   !== undefined && { spiritMusicDuration:   body.spiritMusicDuration   }),
      ...(body.spiritCuratorComment  !== undefined && { spiritCuratorComment:  body.spiritCuratorComment  }),
    },
    select: {
      id: true, name: true, nameJp: true, fighterId: true, franchiseId: true,
      description: true, descriptionPt: true, descriptionJp: true, descriptionJpEn: true,
      assetRenderUrl: true,
      spiritArtworkSource: true, spiritFirstAppearance: true,
      spiritMusicTitle: true, spiritMusicArtist: true, spiritMusicDuration: true,
      spiritCuratorComment: true,
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/admin/collectibles/[id]
// Permanently deletes the collectible from the database.
async function _DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await db.collectible.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export async function PATCH(...args: Parameters<typeof _PATCH>) {
  const res = await _PATCH(...args);
  revalidateSite(); // mostra a edição no site público sem esperar o cache expirar
  return res;
}

export async function DELETE(...args: Parameters<typeof _DELETE>) {
  const res = await _DELETE(...args);
  revalidateSite(); // mostra a edição no site público sem esperar o cache expirar
  return res;
}
