import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/stages → list all stages
export async function GET() {
  const stages = await db.stage.findMany({
    orderBy: [{ smashDebutVersion: "asc" }, { name: "asc" }],
    include: { franchise: { select: { name: true } } },
  });
  return NextResponse.json(stages);
}

// POST /api/admin/stages → create stage
// Body: { name, franchiseId, smashDebutVersion, description? }
export async function POST(req: NextRequest) {
  const body = await req.json() as {
    name:              string;
    franchiseId:       string;
    smashDebutVersion: string;
    description?:      string | null;
  };

  if (!body.name?.trim())              return NextResponse.json({ error: "name is required" }, { status: 400 });
  if (!body.franchiseId?.trim())       return NextResponse.json({ error: "franchiseId is required" }, { status: 400 });
  if (!body.smashDebutVersion?.trim()) return NextResponse.json({ error: "smashDebutVersion is required" }, { status: 400 });

  const stage = await db.stage.create({
    data: {
      name:              body.name.trim(),
      franchiseId:       body.franchiseId.trim(),
      smashDebutVersion: body.smashDebutVersion.trim(),
      description:       body.description || null,
    },
  });

  return NextResponse.json(stage, { status: 201 });
}
