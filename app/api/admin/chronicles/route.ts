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
