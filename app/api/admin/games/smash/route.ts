import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const ERA_LABEL: Record<string, string> = {
  "Super Smash Bros.":                          "SSB64",
  "Super Smash Bros. Melee":                    "SSBM",
  "Super Smash Bros. Brawl":                    "SSBB",
  "Super Smash Bros. for Nintendo 3DS / Wii U": "SSB4",
  "Super Smash Bros. for Wii U":                "SSB4",
  "Super Smash Bros. Ultimate":                 "SSBU",
};

function titleToEra(titleEn: string) {
  if (ERA_LABEL[titleEn]) return ERA_LABEL[titleEn];
  if (titleEn.includes("Melee"))    return "SSBM";
  if (titleEn.includes("Brawl"))    return "SSBB";
  if (titleEn.includes("3DS") || titleEn.includes("Wii U")) return "SSB4";
  if (titleEn.includes("Ultimate")) return "SSBU";
  if (titleEn.startsWith("Super Smash Bros")) return "SSB64";
  return null;
}

// GET /api/admin/games/smash → the 5 main Smash games with IDs
export async function GET() {
  const entries = await db.chronicleEntry.findMany({
    where: { titleNtsc: { startsWith: "Super Smash Bros" } },
    orderBy: { releaseDateNtsc: "asc" },
    select: { id: true, titleNtsc: true, consoleName: true },
  });

  type GameWithEra = { id: string; titleNtsc: string; consoleName: string; era: string };

  const smashGames = entries
    .map(g => ({ ...g, era: titleToEra(g.titleNtsc) }))
    .filter((g): g is GameWithEra => !!g.era)
    // deduplicate by era (keep first per era)
    .reduce<GameWithEra[]>((acc, g) => {
      if (!acc.find(x => x.era === g.era)) acc.push(g);
      return acc;
    }, []);

  return NextResponse.json(smashGames);
}
