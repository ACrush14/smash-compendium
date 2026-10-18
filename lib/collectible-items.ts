import { db } from "@/lib/db";
import { cachedQuery, cachedQueryZ } from "@/lib/cache";
import type { CollectibleDetail, CollectibleListItem } from "@/lib/collectible-types";

const listSelect = {
  id: true, name: true, orderIndex: true, assetRenderUrl: true, assetRender2Url: true, smashGameVersion: true,
  posicaoTrofeuMelee: true, posicaoTrofeuBrawl: true, posicaoTrofeuSsb4: true,
  franchise: { select: { name: true } },
} as const;

type ListRow = {
  id: string; name: string; orderIndex: number | null; assetRenderUrl: string | null; assetRender2Url: string | null;
  smashGameVersion: string; posicaoTrofeuMelee: number | null; posicaoTrofeuBrawl: number | null; posicaoTrofeuSsb4: number | null;
  franchise: { name: string } | null;
};

const toListItem = (r: ListRow): CollectibleListItem => ({
  id: r.id,
  name: r.name,
  orderIndex: r.posicaoTrofeuMelee ?? r.posicaoTrofeuBrawl ?? r.posicaoTrofeuSsb4 ?? r.orderIndex ?? null,
  assetRenderUrl: r.assetRenderUrl ?? null,
  assetRender2Url: r.assetRender2Url ?? null,
  franchiseName: r.franchise?.name ?? null,
  smashGameVersion: r.smashGameVersion,
});

/** Troféus de um jogo (SSB4 inclui as variantes 3DS/Wii U), na ordem oficial. Em cache comprimido de 1 h. */
export function getTrophyList(game: string): Promise<CollectibleListItem[]> {
  const SSB4 = ["SSB4", "SSB4_3DS", "SSB4_WIIU"];
  const versions = SSB4.includes(game) ? SSB4 : [game];
  return cachedQueryZ(["trophy-list", versions.join(",")], async () => {
    const rows = await db.collectible.findMany({
      where: { type: "TROPHY", smashGameVersion: { in: versions } },
      orderBy: [{ posicaoTrofeuMelee: "asc" }, { posicaoTrofeuBrawl: "asc" }, { posicaoTrofeuSsb4: "asc" }, { name: "asc" }],
      select: listSelect,
    });
    return rows.map(toListItem);
  });
}

export function getStickerList(game: string): Promise<CollectibleListItem[]> {
  return cachedQueryZ(["sticker-list", game], async () => {
    const rows = await db.collectible.findMany({
      where: { type: "STICKER", smashGameVersion: game },
      orderBy: [{ orderIndex: "asc" }, { name: "asc" }],
      select: listSelect,
    });
    return rows.map(toListItem);
  });
}

/** Todos os ids de troféus e stickers — só estes entram no cache de detalhes (evita encher o cache com ids inventados). */
function getValidIds(): Promise<string[]> {
  return cachedQueryZ(["collectible-valid-ids"], async () => {
    const rows = await db.collectible.findMany({ where: { type: { in: ["TROPHY", "STICKER"] } }, select: { id: true } });
    return rows.map(r => r.id);
  });
}

const relSelect = { select: { id: true, name: true, smashGameVersion: true, assetRenderUrl: true, type: true } } as const;

type ChrLink = { id: string; titleNtsc: string; boxArtUrl: string | null; wikiUrl: string | null };

export async function getCollectibleDetail(id: string): Promise<CollectibleDetail | null> {
  const ids = await getValidIds();
  if (!ids.includes(id)) return null;

  return cachedQuery(["collectible-detail", id], async () => {
    const t = await db.collectible.findFirst({
      where: { id, type: { in: ["TROPHY", "STICKER"] } },
      include: {
        franchise: { select: { svgIconUrl: true, name: true } },
        fighter: {
          select: {
            id: true, name: true, imageUrl: true,
            bios: { where: { smashGameVersion: "SSBM" }, select: { videoStartSec: true, videoEndSec: true } },
          },
        },
        relationsFrom: { include: { to:   relSelect } },
        relationsTo:   { include: { from: relSelect } },
      },
    });
    if (!t) return null;

    const links = await (db as any).$queryRawUnsafe(
      `SELECT ce.id, ce."titleNtsc", ce."boxArtUrl", ce."wikiUrl"
       FROM "CollectibleChronicleLink" ccl
       JOIN "ChronicleEntry" ce ON ccl."chronicleEntryId" = ce.id
       WHERE ccl."collectibleId" = $1
       ORDER BY ce."titleNtsc"`,
      id,
    ) as ChrLink[];

    const detail: CollectibleDetail = {
      id: t.id,
      nameJp:          t.nameJp          ?? null,
      descriptionEn:   t.descriptionEn   ?? null,
      descriptionPt:   t.descriptionPt   ?? null,
      descriptionJp:   t.descriptionJp   ?? null,
      descriptionJpEn: t.descriptionJpEn ?? null,
      sourceGame:      t.sourceGame      ?? null,
      svgIconUrl:      t.franchise?.svgIconUrl ?? null,
      franchiseId:     t.franchiseId     ?? null,
      videoStartSec:   t.videoStartSec   ?? null,
      videoEndSec:     t.videoEndSec     ?? null,
      videoStartSec2:  (t as any).videoStartSec2 ?? null,
      videoEndSec2:    (t as any).videoEndSec2   ?? null,
      fighterBioVideoStartSec: t.fighter?.bios?.[0]?.videoStartSec ?? null,
      fighterBioVideoEndSec:   t.fighter?.bios?.[0]?.videoEndSec   ?? null,
      relatedItems: [
        ...(t.fighter ? [{
          id: t.fighter.id, name: t.fighter.name, smashGameVersion: "SSBU",
          assetRenderUrl: t.fighter.imageUrl, type: "FIGHTER",
        }] : []),
        ...t.relationsFrom.map(r => ({
          id: r.to.id, name: r.to.name, smashGameVersion: r.to.smashGameVersion,
          assetRenderUrl: r.to.assetRenderUrl, type: r.to.type,
        })),
        ...t.relationsTo.map(r => ({
          id: r.from.id, name: r.from.name, smashGameVersion: r.from.smashGameVersion,
          assetRenderUrl: r.from.assetRenderUrl, type: r.from.type,
        })),
      ].filter((r, i, all) => all.findIndex(x => x.id === r.id) === i) // o vínculo existe nos dois sentidos: sem repetidos
       .slice(0, 8),
      chronicleLinks: links.map(l => ({ id: l.id, titleNtsc: l.titleNtsc, boxArtUrl: l.boxArtUrl, wikiUrl: l.wikiUrl })),
    };
    return detail;
  });
}
