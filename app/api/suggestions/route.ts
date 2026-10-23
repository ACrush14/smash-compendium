import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const MAX_NAME    = 80;
const MAX_MESSAGE = 1000;
const MAX_ID      = 100;
const MAX_SECTION = 60;

export async function POST(req: NextRequest) {
  try {
    // Freio contra spam: 5 sugestões por IP a cada 10 minutos.
    const limit = rateLimit(`suggestions:${clientIp(req.headers)}`, 5, 10 * 60_000);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Muitas sugestões em pouco tempo. Tente de novo mais tarde." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
      );
    }

    const body = await req.json().catch(() => null);
    const { fighterId, section, authorName, message } = body ?? {};

    // Só texto: objetos/arrays no corpo quebrariam o .trim() ou o Prisma.
    if (![fighterId, section, authorName, message].every(v => typeof v === "string")) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
    }
    const name = authorName.trim();
    const text = message.trim();
    const sec  = section.trim();

    if (!fighterId || !sec || !name || !text) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
    }
    if (fighterId.length > MAX_ID || sec.length > MAX_SECTION) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }
    if (name.length > MAX_NAME) {
      return NextResponse.json({ error: `Nome muito longo (máx. ${MAX_NAME} chars).` }, { status: 400 });
    }
    if (text.length > MAX_MESSAGE) {
      return NextResponse.json({ error: `Mensagem muito longa (máx. ${MAX_MESSAGE} chars).` }, { status: 400 });
    }

    // Confirm fighter exists
    const fighter = await db.fighter.findUnique({ where: { id: fighterId }, select: { id: true } });
    if (!fighter) {
      return NextResponse.json({ error: "Lutador não encontrado." }, { status: 404 });
    }

    const suggestion = await db.fighterSuggestion.create({
      data: {
        fighterId,
        section:    sec,
        authorName: name,
        message:    text,
      },
      select: { id: true, authorName: true, message: true, createdAt: true },
    });

    return NextResponse.json(suggestion, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fighterId = searchParams.get("fighterId");
  const section   = searchParams.get("section");

  if (!fighterId || !section) {
    return NextResponse.json({ error: "fighterId e section são obrigatórios." }, { status: 400 });
  }

  const suggestions = await db.fighterSuggestion.findMany({
    where:   { fighterId, section, approved: true },
    orderBy: { createdAt: "desc" },
    take:    50,
    select:  { id: true, authorName: true, message: true, createdAt: true },
  });

  return NextResponse.json(suggestions);
}
