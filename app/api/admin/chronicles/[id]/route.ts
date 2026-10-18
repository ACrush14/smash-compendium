import { revalidateSite } from "@/lib/cache";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PATCH /api/admin/chronicles/[id]
async function _PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id }   = await params;
    const body     = await req.json();
    const { wikiUrl, boxArtUrl, consoleName, titleJp } = body;

    const data: Record<string, string | null> = {};
    if (wikiUrl     !== undefined) data.wikiUrl     = wikiUrl     || null;
    if (boxArtUrl   !== undefined) data.boxArtUrl   = boxArtUrl   || null;
    if (consoleName !== undefined) data.consoleName = consoleName || null;
    if (titleJp     !== undefined) data.titleJp     = titleJp     || null;

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
async function _DELETE(
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
