import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PATCH /api/admin/collectibles/[id]
// Body: any subset of { name, nameJp, descriptionEn, descriptionPt, descriptionJp, descriptionJpEn, assetRenderUrl }
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
    },
    select: {
      id: true, name: true, nameJp: true,
      descriptionEn: true, descriptionPt: true,
      descriptionJp: true, descriptionJpEn: true,
      assetRenderUrl: true,
    },
  });

  return NextResponse.json(updated);
}
