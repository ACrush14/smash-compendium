import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/collectibles?franchiseId=...&type=...&fighterId=null|any&q=...&take=200
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const franchiseId = searchParams.get("franchiseId") ?? undefined;
  const type        = searchParams.get("type") ?? undefined;
  const fighterIdParam = searchParams.get("fighterId"); // "null" = unlinked only
  const q           = searchParams.get("q")?.trim();
  const take        = Math.min(parseInt(searchParams.get("take") ?? "200", 10), 500);

  const items = await db.collectible.findMany({
    where: {
      ...(franchiseId && { franchiseId }),
      ...(type        && { type        }),
      ...(fighterIdParam === "null" && { fighterId: null }),
      ...(q && { name: { contains: q, mode: "insensitive" } }),
    },
    include: {
      fighter: { select: { id: true, name: true } },
    },
    orderBy: [{ smashGameVersion: "asc" }, { name: "asc" }],
    take,
  });

  return NextResponse.json(items);
}

// POST /api/admin/collectibles → create a new collectible (trophy / spirit / sticker)
// Body: { type, smashGameVersion, name, fighterId?, nameJp?, description?, descriptionPt?,
//          descriptionJp?, descriptionJpEn?, assetRenderUrl? }
export async function POST(req: NextRequest) {
  const body = await req.json() as {
    type:              string;
    smashGameVersion:  string;
    name:              string;
    fighterId?:        string | null;
    nameJp?:           string | null;
    description?:      string | null;  // EN — campo principal
    descriptionPt?:    string | null;
    descriptionJp?:    string | null;
    descriptionJpEn?:  string | null;
    assetRenderUrl?:   string | null;
  };

  if (!body.type?.trim())             return NextResponse.json({ error: "type is required" }, { status: 400 });
  if (!body.smashGameVersion?.trim()) return NextResponse.json({ error: "smashGameVersion is required" }, { status: 400 });
  if (!body.name?.trim())             return NextResponse.json({ error: "name is required" }, { status: 400 });

  // Build deterministic ID matching existing convention: "TYPE-VER-Fighter-Name"
  const safeName = body.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-]/g, "");
  const autoId = `${body.type}-${body.smashGameVersion}-${safeName}`;

  const item = await db.collectible.create({
    data: {
      id:               autoId,
      type:             body.type.trim(),
      smashGameVersion: body.smashGameVersion.trim(),
      name:             body.name.trim(),
      fighterId:        body.fighterId   || null,
      nameJp:           body.nameJp      || null,
      description:      body.description    || null,
      descriptionPt:    body.descriptionPt  || null,
      descriptionJp:    body.descriptionJp  || null,
      descriptionJpEn:  body.descriptionJpEn || null,
      assetRenderUrl:   body.assetRenderUrl || null,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
