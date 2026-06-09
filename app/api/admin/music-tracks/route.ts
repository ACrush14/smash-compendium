import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/music-tracks?franchise=&compositionType=&q=&page=1&limit=50
export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams;

  const franchiseId     = sp.get("franchise")       ?? "";
  const compositionType = sp.get("compositionType") ?? "";
  const q               = sp.get("q")               ?? "";
  const page            = Math.max(1, parseInt(sp.get("page")  ?? "1",  10));
  const limit           = Math.min(100, parseInt(sp.get("limit") ?? "50", 10));
  const offset          = (page - 1) * limit;

  const conds: string[] = [];
  const vals:  unknown[] = [];
  let   idx              = 1;

  if (franchiseId)     { conds.push(`m."franchiseId" = $${idx++}`);             vals.push(franchiseId); }
  if (compositionType) { conds.push(`m."compositionType" = $${idx++}`);         vals.push(compositionType); }
  if (q)               { conds.push(`lower(m.title) LIKE lower($${idx++})`);    vals.push(`%${q}%`); }

  const where = conds.length ? `WHERE ${conds.join(" AND ")}` : "";

  const [countRow, tracks] = await Promise.all([
    db.$queryRawUnsafe<{ count: bigint }[]>(
      `SELECT COUNT(*) AS count FROM "Music" m ${where}`,
      ...vals,
    ),
    db.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT m.id, m.title, m."franchiseId", m.arranger, m."isRemix",
              m."youtubeId", m.duration, m."sourceGame", m."compositionType", m.notes,
              f.name AS "franchiseName"
       FROM "Music" m
       JOIN "Franchise" f ON f.id = m."franchiseId"
       ${where}
       ORDER BY f.name ASC, m.title ASC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      ...vals, limit, offset,
    ),
  ]);

  const total = Number(countRow[0]?.count ?? 0);
  return NextResponse.json({ tracks, total, page, pages: Math.ceil(total / limit) });
}

// POST /api/admin/music-tracks → create music track
export async function POST(req: NextRequest) {
  const body = await req.json() as {
    title:            string;
    franchiseId:      string;
    arranger?:        string | null;
    isRemix?:         boolean;
    youtubeId?:       string | null;
    duration?:        string | null;
    sourceGame?:      string | null;
    compositionType?: string | null;
    notes?:           string | null;
  };

  if (!body.title?.trim())       return NextResponse.json({ error: "title is required" }, { status: 400 });
  if (!body.franchiseId?.trim()) return NextResponse.json({ error: "franchiseId is required" }, { status: 400 });

  const id = `music-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  await db.$executeRawUnsafe(
    `INSERT INTO "Music"
       (id, title, "franchiseId", arranger, "isRemix", "youtubeId", duration, "sourceGame", "compositionType", notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    id,
    body.title.trim(),
    body.franchiseId.trim(),
    body.arranger        || null,
    body.isRemix         ?? false,
    body.youtubeId       || null,
    body.duration        || null,
    body.sourceGame      || null,
    body.compositionType || null,
    body.notes           || null,
  );

  const rows = await db.$queryRawUnsafe<Record<string, unknown>[]>(
    `SELECT m.id, m.title, m."franchiseId", m.arranger, m."isRemix",
            m."youtubeId", m.duration, m."sourceGame", m."compositionType", m.notes,
            f.name AS "franchiseName"
     FROM "Music" m JOIN "Franchise" f ON f.id = m."franchiseId"
     WHERE m.id = $1`,
    id,
  );
  return NextResponse.json(rows[0], { status: 201 });
}
