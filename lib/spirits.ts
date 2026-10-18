import { db } from "@/lib/db";
import { cachedQuery, cachedQueryZ } from "@/lib/cache";
import type { SpiritDetail, SpiritListItem } from "@/lib/spirit-types";

const orderBy = [
  { posicaoSpiritSsbu: "asc" as const },
  { orderIndex:        "asc" as const },
  { name:              "asc" as const },
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const normTitle = (s: string) => norm(s.replace(/\s*\(\d{4}\)$/, "").trim());

/** Lista leve de todos os spirits (sem duplicados por orderIndex), em cache comprimido de 1 h. */
export function getSpiritList(): Promise<SpiritListItem[]> {
  return cachedQueryZ(["spirit-list"], async () => {
    const rows = await db.collectible.findMany({
      where: { type: "SPIRIT" },
      orderBy,
      select: {
        id: true, name: true, orderIndex: true, posicaoSpiritSsbu: true, assetRenderUrl: true,
        franchise: { select: { name: true } },
      },
    });
    const seen = new Set<number>();
    const out: SpiritListItem[] = [];
    for (const r of rows) {
      if (r.orderIndex) {
        if (seen.has(r.orderIndex)) continue;
        seen.add(r.orderIndex);
      }
      out.push({
        id: r.id,
        name: r.name,
        posicaoSpiritSsbu: r.posicaoSpiritSsbu ?? null,
        assetRenderUrl: r.assetRenderUrl ?? null,
        franchiseName: r.franchise?.name ?? null,
      });
    }
    return out;
  });
}

/** Título normalizado → capa e página wiki do jogo (Chronicles). */
function getCoverMaps(): Promise<{ art: Record<string, string>; wiki: Record<string, string> }> {
  return cachedQuery(["chronicle-cover-maps"], async () => {
    const entries = await db.chronicleEntry.findMany({
      where:  { OR: [{ boxArtUrl: { not: null } }, { wikiUrl: { not: null } }] },
      select: { titleNtsc: true, boxArtUrl: true, wikiUrl: true },
    });
    const art: Record<string, string> = {};
    const wiki: Record<string, string> = {};
    for (const e of entries) {
      const k = norm(e.titleNtsc);
      if (e.boxArtUrl && !(k in art))  art[k]  = e.boxArtUrl;
      if (e.wikiUrl  && !(k in wiki))  wiki[k] = e.wikiUrl;
    }
    return { art, wiki };
  });
}

const relSelect = { select: { id: true, name: true, smashGameVersion: true, assetRenderUrl: true, type: true } } as const;

/** Detalhe completo de um spirit (ou null se não existir na lista). Em cache por id durante 1 h. */
export async function getSpiritDetail(id: string): Promise<SpiritDetail | null> {
  const list = await getSpiritList();
  if (!list.some(s => s.id === id)) return null; // só ids válidos entram no cache

  return cachedQuery(["spirit-detail", id], async () => {
    const item = await db.collectible.findFirst({
      where:   { id, type: "SPIRIT" },
      include: {
        franchise: { select: { svgIconUrl: true, name: true } },
        fighter:   { select: { id: true, name: true, imageUrl: true } },
        relationsFrom: { include: { to:   relSelect } },
        relationsTo:   { include: { from: relSelect } },
      },
    });
    if (!item) return null;

    const { art, wiki } = await getCoverMaps();
    const cover = (src: string | null) => (src ? art[normTitle(src)] ?? null : null);
    const wikiOf = (src: string | null) => (src ? wiki[normTitle(src)] ?? null : null);

    const detail: SpiritDetail = {
      id:                    item.id,
      nameJp:                item.nameJp ?? null,
      spiritArtworkSource:   item.spiritArtworkSource ?? null,
      spiritFirstAppearance: item.spiritFirstAppearance ?? null,
      spiritMusicTitle:      item.spiritMusicTitle ?? null,
      spiritMusicArtist:     item.spiritMusicArtist ?? null,
      spiritMusicDuration:   item.spiritMusicDuration ?? null,
      spiritCuratorComment:  item.spiritCuratorComment ?? null,
      sourceGame:            item.sourceGame ?? null,
      svgIconUrl:            item.franchise?.svgIconUrl ?? null,
      franchiseId:           item.franchiseId ?? null,
      artCoverUrl:           cover(item.spiritArtworkSource ?? null),
      firstCoverUrl:         cover(item.spiritFirstAppearance ?? null),
      sourceCoverUrl:        cover(item.sourceGame ?? null),
      artWikiUrl:            wikiOf(item.spiritArtworkSource ?? null),
      firstWikiUrl:          wikiOf(item.spiritFirstAppearance ?? null),
      sourceWikiUrl:         wikiOf(item.sourceGame ?? null),
      descriptionEn:         item.descriptionEn ?? null,
      descriptionPt:         item.descriptionPt ?? null,
      descriptionJp:         item.descriptionJp ?? null,
      descriptionJpEn:       item.descriptionJpEn ?? null,
      relatedItems: [
        ...(item.fighter ? [{
          id: item.fighter.id, name: item.fighter.name, smashGameVersion: "SSBU",
          assetRenderUrl: item.fighter.imageUrl, type: "FIGHTER",
        }] : []),
        ...item.relationsFrom.map(r => ({
          id: r.to.id, name: r.to.name, smashGameVersion: r.to.smashGameVersion,
          assetRenderUrl: r.to.assetRenderUrl, type: r.to.type,
        })),
        ...item.relationsTo.map(r => ({
          id: r.from.id, name: r.from.name, smashGameVersion: r.from.smashGameVersion,
          assetRenderUrl: r.from.assetRenderUrl, type: r.from.type,
        })),
      ].slice(0, 8),
    };
    return detail;
  });
}
