import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const ERA_MAP: Record<string, string> = {
  "Super Smash Bros.":                     "SSB64",
  "Super Smash Bros. Melee":               "SSBM",
  "Super Smash Bros. Brawl":               "SSBB",
  "Super Smash Bros. for Nintendo 3DS / Wii U": "SSB4",
  "Super Smash Bros. for Wii U":           "SSB4",
  "Super Smash Bros. for Nintendo 3DS":    "SSB4",
  "Super Smash Bros. Ultimate":            "SSBU",
};
const ERA_ORDER = ["SSB64", "SSBM", "SSBB", "SSB4", "SSBU"];

function titleToEra(titleEn: string): string | null {
  if (ERA_MAP[titleEn]) return ERA_MAP[titleEn];
  if (titleEn.includes("Melee"))    return "SSBM";
  if (titleEn.includes("Brawl"))    return "SSBB";
  if (titleEn.includes("3DS") || titleEn.includes("Wii U")) return "SSB4";
  if (titleEn.includes("Ultimate")) return "SSBU";
  if (titleEn.includes("Super Smash Bros.")) return "SSB64";
  return null;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const fighter = await db.fighter.findUnique({
    where: { id },
    include: {
      franchise: { select: { id: true, name: true } },
      bios:      { orderBy: { smashGameVersion: "asc" } },
      chronicleLinks: {
        include: { chronicleEntry: { select: { titleNtsc: true } } },
      },
    },
  });

  if (!fighter) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const worksEras = fighter.bios
    .map(b => b.smashGameVersion)
    .filter((e, i, arr) => arr.indexOf(e) === i) // unique
    .sort((a, b) => ERA_ORDER.indexOf(a) - ERA_ORDER.indexOf(b));

  const { chronicleLinks, franchise, ...rest } = fighter;

  return NextResponse.json({
    ...rest,
    franchise: franchise.name,
    franchiseObjId: franchise.id,  // explicit franchise ID for admin use
    worksEras,
  });
}
