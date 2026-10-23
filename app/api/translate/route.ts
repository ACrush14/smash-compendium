import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  // O middleware já exige a sessão de admin; aqui limitamos tamanho e frequência para proteger a cota.
  const limit = rateLimit(`translate:${clientIp(req.headers)}`, 20, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Muitas requisições" }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } });
  }

  const body = (await req.json().catch(() => null)) as { texts?: unknown; direction?: unknown } | null;
  const direction = body?.direction === "JP_TO_EN" ? "JP_TO_EN" : "EN_TO_PT";
  const raw0 = body?.texts;
  if (!raw0 || typeof raw0 !== "object" || Array.isArray(raw0)) {
    return NextResponse.json({ error: "texts inválido" }, { status: 400 });
  }
  const texts: Record<string, string> = {};
  let total = 0;
  for (const [k, v] of Object.entries(raw0 as Record<string, unknown>)) {
    if (typeof v !== "string") return NextResponse.json({ error: "texts deve conter só strings" }, { status: 400 });
    total += k.length + v.length;
    texts[k] = v;
  }
  const keys = Object.keys(texts);
  if (keys.length === 0) return NextResponse.json({ translated: {} });
  if (keys.length > 50 || total > 20_000) {
    return NextResponse.json({ error: "Texto grande demais (máx. 50 itens e 20.000 caracteres)" }, { status: 413 });
  }

  const client = new Anthropic({ apiKey });

  let prompt = "";
  if (direction === "JP_TO_EN") {
    prompt = `Translate the following texts from Japanese to English. Make it a VERY LITERAL and faithful translation. For example, if the Japanese text says 'MOTHER2 ギーグの逆襲' (MOTHER2 Giygas Strikes Back), translate it exactly as 'MOTHER2 Giygas Strikes Back' rather than localized titles like 'EarthBound'. Preserve the narrative style, tone, and proper nouns literally. Return ONLY a valid JSON object with the exact same keys but translated values — no markdown, no explanation.

${JSON.stringify(texts, null, 2)}`;
  } else {
    prompt = `Translate the following texts from English to Brazilian Portuguese (PT-BR). Preserve the narrative style, tone, and any proper nouns (character names, game titles, move names). Return ONLY a valid JSON object with the exact same keys but translated values — no markdown, no explanation.

${JSON.stringify(texts, null, 2)}`;
  }

  let message;
  try {
    message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });
  } catch {
    return NextResponse.json({ error: "Falha ao traduzir" }, { status: 502 });
  }

  const first = message.content[0];
  const raw = (first && first.type === "text" ? first.text : "").trim();
  const json = raw.startsWith("```")
    ? raw.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "")
    : raw;

  try {
    const translated = JSON.parse(json) as Record<string, string>;
    return NextResponse.json({ translated });
  } catch {
    return NextResponse.json({ error: "parse_error" }, { status: 500 });
  }
}
