import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET  /api/admin/fighters/[id]/bios → all bios for this fighter
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const bios = await db.fighterBio.findMany({
    where: { fighterId: id },
    orderBy: { smashGameVersion: "asc" },
  });
  return NextResponse.json(bios);
}

// POST /api/admin/fighters/[id]/bios → upsert bio (create or update)
// Body: { smashGameVersion, contentEn?, contentPt?, contentJp?, contentJpEn? }
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json() as {
    smashGameVersion: string;
    contentEn?:   string;
    contentPt?:   string | null;
    contentJp?:   string | null;
    contentJpEn?: string | null;
  };

  const { smashGameVersion, contentEn, contentPt, contentJp, contentJpEn } = body;

  const bio = await db.fighterBio.upsert({
    where: { fighterId_smashGameVersion: { fighterId: id, smashGameVersion } },
    create: {
      fighterId: id,
      smashGameVersion,
      contentEn:   contentEn   ?? "",
      contentPt:   contentPt   ?? null,
      contentJp:   contentJp   ?? null,
      contentJpEn: contentJpEn ?? null,
    },
    update: {
      ...(contentEn   !== undefined && { contentEn }),
      ...(contentPt   !== undefined && { contentPt }),
      ...(contentJp   !== undefined && { contentJp }),
      ...(contentJpEn !== undefined && { contentJpEn }),
    },
  });

  return NextResponse.json(bio);
}
