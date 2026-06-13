import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PATCH /api/admin/chronicles/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id }   = await params;
    const body     = await req.json();
    const { wikiUrl, boxArtUrl, consoleName } = body;

    const data: Record<string, string | null> = {};
    if (wikiUrl     !== undefined) data.wikiUrl     = wikiUrl     || null;
    if (boxArtUrl   !== undefined) data.boxArtUrl   = boxArtUrl   || null;
    if (consoleName !== undefined) data.consoleName = consoleName || null;

    const updated = await db.chronicleEntry.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error("PATCH /chronicles/[id]:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
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
