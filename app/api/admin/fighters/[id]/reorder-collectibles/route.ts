import { revalidateSite } from "@/lib/cache";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const GAME_TO_FIELD: Record<string, string> = {
  SSBM: "posicaoTrofeuMelee",
  SSBB: "posicaoTrofeuBrawl",
  SSB4: "posicaoTrofeuSsb4",
  SSBU: "posicaoSpiritSsbu",
};

// POST /api/admin/fighters/[id]/reorder-collectibles
// Body: { game: "SSBM"|"SSBB"|"SSB4"|"SSBU", ids: string[] }
// Saves the position of each collectible ID based on its array index.
async function _POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await params; // fighterId not needed for update, collectibles are already scoped by ids
  const { game, ids } = (await req.json()) as { game: string; ids: string[] };

  const field = GAME_TO_FIELD[game];
  if (!field) return NextResponse.json({ error: "Invalid game" }, { status: 400 });
  if (!Array.isArray(ids) || ids.length === 0) return NextResponse.json({ ok: true });

  await db.$transaction(
    ids.map((id, index) =>
      db.collectible.update({
        where: { id },
        data: { [field]: index + 1 },
        select: { id: true },
      })
    )
  );

  return NextResponse.json({ ok: true, updated: ids.length });
}

export async function POST(...args: Parameters<typeof _POST>) {
  const res = await _POST(...args);
  revalidateSite(); // mostra a edição no site público sem esperar o cache expirar
  return res;
}
