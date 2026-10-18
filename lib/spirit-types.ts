import type { RelatedItem } from "@/components/ui/RelatedItemsGrid";

/** Dados mínimos de cada spirit para a lista lateral, a busca e a navegação (os 1.582 vão para o cliente). */
export interface SpiritListItem {
  id: string;
  name: string;
  posicaoSpiritSsbu: number | null;
  assetRenderUrl: string | null;
  franchiseName: string | null;
}

/** Dados completos de UM spirit; buscados sob demanda (/api/spirits/[id]) quando ele é aberto. */
export interface SpiritDetail {
  id: string;
  nameJp: string | null;
  spiritArtworkSource: string | null;
  spiritFirstAppearance: string | null;
  spiritMusicTitle: string | null;
  spiritMusicArtist: string | null;
  spiritMusicDuration: string | null;
  spiritCuratorComment: string | null;
  sourceGame: string | null;
  svgIconUrl: string | null;
  franchiseId: string | null;
  artCoverUrl: string | null;
  firstCoverUrl: string | null;
  sourceCoverUrl: string | null;
  artWikiUrl: string | null;
  firstWikiUrl: string | null;
  sourceWikiUrl: string | null;
  descriptionEn: string | null;
  descriptionPt: string | null;
  descriptionJp: string | null;
  descriptionJpEn: string | null;
  relatedItems: RelatedItem[];
}
