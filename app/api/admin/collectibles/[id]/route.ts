import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PATCH /api/admin/collectibles/[id]
// Body: any subset of editable fields, including fighterId (null = unlink)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json() as {
    name?:             string;
    nameJp?:           string | null;
    descriptionEn?:    string | null;
    descriptionPt?:    string | null;
    descriptionJp?:    string | null;
    descriptionJpEn?:  string | null;
    assetRenderUrl?:   string | null;
    fighterId?:        string | null;  // null = unlink from fighter
    franchiseId?:      string | null;  // assign/unassign from franchise
  };

  const updated = await db.collectible.update({
    where: { id },
    data: {
      ...(body.name            !== undefined && { name:            body.name            }),
      ...(body.nameJp          !== undefined && { nameJp:          body.nameJp          }),
      ...(body.descriptionEn   !== undefined && { descriptionEn:   body.descriptionEn   }),
      ...(body.descriptionPt   !== undefined && { descriptionPt:   body.descriptionPt   }),
      ...(body.descriptionJp   !== undefined && { descriptionJp:   body.descriptionJp   }),
      ...(body.descriptionJpEn !== undefined && { descriptionJpEn: body.descriptionJpEn }),
      ...(body.assetRenderUrl  !== undefined && { assetRenderUrl:  body.assetRenderUrl  }),
      ...(body.fighterId       !== undefined && { fighterId:       body.fighterId       }),
      ...(body.franchiseId     !== undefined && { franchiseId:     body.franchiseId     }),
    },
    select: {
      id: true, name: true, nameJp: true, fighterId: true, franchiseId: true,
      descriptionEn: true, descriptionPt: true,
      descriptionJp: true, descriptionJpEn: true,
      assetRenderUrl: true,
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/admin/collectibles/[id]
// Permanently deletes the collectible from the database.
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await db.collectible.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
