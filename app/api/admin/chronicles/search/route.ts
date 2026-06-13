import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/chronicles/search?q=mario
// Returns up to 20 chronicle entries matching the title, formatted as "Title (YYYY)"
export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 1) return NextResponse.json([]);

  const entries = await db.chronicleEntry.findMany({
    where: { titleNtsc: { contains: q, mode: "insensitive" } },
    select: { id: true, titleNtsc: true, releaseDateNtsc: true },
    orderBy: { titleNtsc: "asc" },
    take: 20,
  });

  const results = entries.map(e => {
    const year = e.releaseDateNtsc ? e.releaseDateNtsc.slice(0, 4) : null;
    const label = year ? `${e.titleNtsc} (${year})` : e.titleNtsc;
    return { id: e.id, label };
  });

  return NextResponse.json(results);
}
