import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/franchises → all franchises ordered by name
export async function GET() {
  const franchises = await db.franchise.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, svgIconUrl: true },
  });
  return NextResponse.json(franchises);
}

// POST /api/admin/franchises → create franchise
// Body: { name, svgIconUrl? }
export async function POST(req: NextRequest) {
  const { name, svgIconUrl } = await req.json() as {
    name: string;
    svgIconUrl?: string | null;
  };

  if (!name?.trim()) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const franchise = await db.franchise.create({
    data: {
      name:       name.trim(),
      svgIconUrl: svgIconUrl || null,
    },
  });

  return NextResponse.json(franchise, { status: 201 });
}
