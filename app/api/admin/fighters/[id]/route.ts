import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json() as {
    curationStatus?: string;
    curationNotes?:  string | null;
  };

  const updated = await db.fighter.update({
    where: { id },
    data: {
      ...(body.curationStatus !== undefined && { curationStatus: body.curationStatus }),
      ...(body.curationNotes  !== undefined && { curationNotes:  body.curationNotes }),
    },
    select: { id: true, curationStatus: true, curationNotes: true },
  });

  return NextResponse.json(updated);
}
