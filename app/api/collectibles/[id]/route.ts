import { NextResponse } from "next/server";
import { getCollectibleDetail } from "@/lib/collectible-items";

// GET /api/collectibles/[id] — detalhe completo de um troféu ou sticker (usado pelos viewers ao abrir/navegar).
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id.length === 0 || id.length > 160) return NextResponse.json({ error: "id inválido" }, { status: 400 });
  const detail = await getCollectibleDetail(id);
  if (!detail) return NextResponse.json({ error: "não encontrado" }, { status: 404 });
  return NextResponse.json(detail, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
}
