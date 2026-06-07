import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PATCH /api/admin/chronicles/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id }   = await params;
  const body     = await req.json();
  const { wikiUrl, boxArtUrl } = body;

  const data: any = {};
  if (wikiUrl    !== undefined) data.wikiUrl    = wikiUrl    || null;
  if (boxArtUrl  !== undefined) data.boxArtUrl  = boxArtUrl  || null;

  const updated = await db.chronicleEntry.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}

// DELETE /api/admin/chronicles/[id]/boxart  — limpa só o boxArtUrl
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updated = await db.chronicleEntry.update({
    where: { id },
    data: { boxArtUrl: null },
  });
  return NextResponse.json(updated);
}
