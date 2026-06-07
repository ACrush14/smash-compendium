import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/chronicles?filter=missing_wiki|missing_art|all&console=X&q=title
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const filter  = searchParams.get("filter") ?? "all";
  const console_ = searchParams.get("console") ?? "";
  const q       = searchParams.get("q") ?? "";
  const page    = parseInt(searchParams.get("page") ?? "1");
  const perPage = 50;

  const where: any = {};
  if (filter === "missing_wiki") where.wikiUrl   = null;
  if (filter === "missing_art")  where.boxArtUrl = null;
  if (console_) where.consoleName = console_;
  if (q) where.titleNtsc = { contains: q, mode: "insensitive" };

  const [total, entries] = await Promise.all([
    db.chronicleEntry.count({ where }),
    db.chronicleEntry.findMany({
      where,
      orderBy: [{ consoleName: "asc" }, { titleNtsc: "asc" }],
      skip:  (page - 1) * perPage,
      take:  perPage,
    }),
  ]);

  return NextResponse.json({ total, page, perPage, entries });
}

// POST /api/admin/chronicles → create a new ChronicleEntry
export async function POST(req: NextRequest) {
  const body = await req.json() as {
    consoleName:      string;
    titleNtsc:        string;
    titlePal?:        string | null;
    titleJp?:         string | null;
    titleJpEn?:       string | null;
    titleJpPt?:       string | null;
    releaseDateNtsc?: string | null;
    releaseDatePal?:  string | null;
    releaseDateJp?:   string | null;
    unlockCriteria?:  string | null;
    wikiUrl?:         string | null;
    boxArtUrl?:       string | null;
  };

  if (!body.consoleName?.trim()) return NextResponse.json({ error: "consoleName is required" }, { status: 400 });
  if (!body.titleNtsc?.trim())   return NextResponse.json({ error: "titleNtsc is required" }, { status: 400 });

  const entry = await db.chronicleEntry.create({
    data: {
      consoleName:      body.consoleName.trim(),
      titleNtsc:        body.titleNtsc.trim(),
      titlePal:         body.titlePal         || null,
      titleJp:          body.titleJp          || null,
      titleJpEn:        body.titleJpEn        || null,
      titleJpPt:        body.titleJpPt        || null,
      releaseDateNtsc:  body.releaseDateNtsc  || null,
      releaseDatePal:   body.releaseDatePal   || null,
      releaseDateJp:    body.releaseDateJp    || null,
      unlockCriteria:   body.unlockCriteria   || null,
      wikiUrl:          body.wikiUrl          || null,
      boxArtUrl:        body.boxArtUrl        || null,
    },
  });

  return NextResponse.json(entry, { status: 201 });
}
