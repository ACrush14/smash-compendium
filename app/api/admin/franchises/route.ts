import { revalidateSite } from "@/lib/cache";
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
async function _POST(req: NextRequest) {
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

export async function POST(...args: Parameters<typeof _POST>) {
  const res = await _POST(...args);
  revalidateSite(); // mostra a edição no site público sem esperar o cache expirar
  return res;
}
