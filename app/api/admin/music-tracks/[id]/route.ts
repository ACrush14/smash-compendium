import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PATCH /api/admin/music-tracks/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await req.json() as {
    title?:          string;
    franchiseId?:    string;
    arranger?:       string | null;
    isRemix?:        boolean;
    youtubeId?:      string | null;
    duration?:       string | null;
    sourceGame?:     string | null;
    compositionType?: string | null;
    notes?:          string | null;
  };

  const exists = await db.$queryRawUnsafe<{ id: string }[]>(
    `SELECT id FROM "Music" WHERE id = $1 LIMIT 1`,
    params.id,
  );
  if (!exists.length) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const sets: string[]   = [];
  const vals: unknown[]  = [];
  let   idx              = 1;

  if (body.title          !== undefined) { sets.push(`title=$${idx++}`);             vals.push(body.title?.trim() || null); }
  if (body.franchiseId    !== undefined) { sets.push(`"franchiseId"=$${idx++}`);     vals.push(body.franchiseId); }
  if (body.arranger       !== undefined) { sets.push(`arranger=$${idx++}`);          vals.push(body.arranger || null); }
  if (body.isRemix        !== undefined) { sets.push(`"isRemix"=$${idx++}`);         vals.push(body.isRemix); }
  if (body.youtubeId      !== undefined) { sets.push(`"youtubeId"=$${idx++}`);       vals.push(body.youtubeId || null); }
  if (body.duration       !== undefined) { sets.push(`duration=$${idx++}`);          vals.push(body.duration || null); }
  if (body.sourceGame     !== undefined) { sets.push(`"sourceGame"=$${idx++}`);      vals.push(body.sourceGame || null); }
  if (body.compositionType !== undefined) { sets.push(`"compositionType"=$${idx++}`); vals.push(body.compositionType || null); }
  if (body.notes          !== undefined) { sets.push(`notes=$${idx++}`);             vals.push(body.notes || null); }

  if (!sets.length) return NextResponse.json({ error: "Nothing to update" }, { status: 400 });

  vals.push(params.id);
  await db.$executeRawUnsafe(
    `UPDATE "Music" SET ${sets.join(", ")} WHERE id=$${idx}`,
    ...vals,
  );

  const rows = await db.$queryRawUnsafe<Record<string, unknown>[]>(
    `SELECT m.id, m.title, m."franchiseId", m.arranger, m."isRemix",
            m."youtubeId", m.duration, m."sourceGame", m."compositionType", m.notes,
            f.name AS "franchiseName"
     FROM "Music" m
     JOIN "Franchise" f ON f.id = m."franchiseId"
     WHERE m.id = $1`,
    params.id,
  );
  return NextResponse.json(rows[0]);
}

// DELETE /api/admin/music-tracks/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const exists = await db.$queryRawUnsafe<{ id: string }[]>(
    `SELECT id FROM "Music" WHERE id = $1 LIMIT 1`,
    params.id,
  );
  if (!exists.length) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Remove StageMusic associations first
  await db.$executeRawUnsafe(`DELETE FROM "StageMusic" WHERE "musicId" = $1`, params.id);
  await db.$executeRawUnsafe(`DELETE FROM "Music" WHERE id = $1`, params.id);

  return NextResponse.json({ ok: true });
}
