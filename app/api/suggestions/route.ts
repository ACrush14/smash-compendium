import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const MAX_NAME    = 80;
const MAX_MESSAGE = 1000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fighterId, section, authorName, message } = body ?? {};

    if (!fighterId || !section || !authorName?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
    }
    if (authorName.trim().length > MAX_NAME) {
      return NextResponse.json({ error: `Nome muito longo (máx. ${MAX_NAME} chars).` }, { status: 400 });
    }
    if (message.trim().length > MAX_MESSAGE) {
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
        section:    section.trim(),
        authorName: authorName.trim(),
        message:    message.trim(),
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
