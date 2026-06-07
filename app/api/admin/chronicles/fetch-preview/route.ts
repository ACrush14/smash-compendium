import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

const UA = "SmashCompendiumBot/1.0 (academic; contact: anderson.crush.link@gmail.com)";

// POST /api/admin/chronicles/fetch-preview
// Body: { url: string }
// Returns: { imgUrl: string | null, candidates: string[] }
export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) return NextResponse.json({ imgUrl: null, candidates: [] });

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return NextResponse.json({ imgUrl: null, candidates: [], error: `HTTP ${res.status}` });

    const html = await res.text();
    const $ = cheerio.load(html);

    const candidates: string[] = [];

    // Coleta todas as imagens dos infoboxes
    const selectors = [".infobox-image img", "table.infobox img", ".infobox img", "img"];
    for (const sel of selectors) {
      $(sel).each((_, el) => {
        const raw = $(el).attr("src") ?? $(el).attr("data-src") ?? "";
        if (!raw) return;
        let resolved = raw.startsWith("//") ? `https:${raw}` : raw;
        if (!resolved.includes("upload.wikimedia.org") && !resolved.includes("wiki.gallery")) return;
        // Filtrar ícones e badges
        if (resolved.match(/cc-by|cc-0|poweredby|license|88x31/i)) return;
        if (resolved.match(/\.svg(?:\.png)?/i)) return;
        if (resolved.match(/Cscr-|featured|disambig|question_mark|OOjs_UI|logo/i)) return;
        // Full-res
        if (resolved.includes("/thumb/")) {
          resolved = resolved.replace("/thumb/", "/").replace(/\/\d+px-[^/]+$/, "");
        }
        if (!candidates.includes(resolved)) candidates.push(resolved);
      });
    }

    const imgUrl = candidates[0] ?? null;
    return NextResponse.json({ imgUrl, candidates: candidates.slice(0, 6) });
  } catch (e: any) {
    return NextResponse.json({ imgUrl: null, candidates: [], error: e.message });
  }
}
