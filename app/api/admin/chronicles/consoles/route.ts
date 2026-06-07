import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/chronicles/consoles — lista de consoles distintos
export async function GET() {
  const rows = await db.chronicleEntry.findMany({
    distinct: ["consoleName"],
    select: { consoleName: true },
    orderBy: { consoleName: "asc" },
  });
  return NextResponse.json(rows.map(r => r.consoleName));
}
