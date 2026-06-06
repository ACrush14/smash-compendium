import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  const client = new Anthropic({ apiKey });
  const { texts, direction = "EN_TO_PT" } = (await req.json()) as { texts: Record<string, string>; direction?: string };

  const keys = Object.keys(texts);
  if (keys.length === 0) return NextResponse.json({ translated: {} });

  let prompt = "";
  if (direction === "JP_TO_EN") {
    prompt = `Translate the following texts from Japanese to English. Make it a VERY LITERAL and faithful translation. For example, if the Japanese text says 'MOTHER2 ギーグの逆襲' (MOTHER2 Giygas Strikes Back), translate it exactly as 'MOTHER2 Giygas Strikes Back' rather than localized titles like 'EarthBound'. Preserve the narrative style, tone, and proper nouns literally. Return ONLY a valid JSON object with the exact same keys but translated values — no markdown, no explanation.

${JSON.stringify(texts, null, 2)}`;
  } else {
    prompt = `Translate the following texts from English to Brazilian Portuguese (PT-BR). Preserve the narrative style, tone, and any proper nouns (character names, game titles, move names). Return ONLY a valid JSON object with the exact same keys but translated values — no markdown, no explanation.

${JSON.stringify(texts, null, 2)}`;
  }

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (message.content[0] as { type: "text"; text: string }).text.trim();
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
