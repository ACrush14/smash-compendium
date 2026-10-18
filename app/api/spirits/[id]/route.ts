import { NextResponse } from "next/server";
import { getSpiritDetail } from "@/lib/spirits";

// GET /api/spirits/[id] — detalhe completo de um spirit (usado pelo SpiritViewer ao abrir/navegar).
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Os ids reais têm espaços e pontuação (ex.: "SPIRIT-SSBU-Builder Mario"); a validação de verdade é
  // getSpiritDetail() só aceitar ids que existem na lista. Aqui só limita o tamanho.
  if (id.length === 0 || id.length > 160) {
    return NextResponse.json({ error: "id inválido" }, { status: 400 });
  }
  const detail = await getSpiritDetail(id);
  if (!detail) return NextResponse.json({ error: "não encontrado" }, { status: 404 });
  return NextResponse.json(detail, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
