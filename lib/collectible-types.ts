import type { RelatedItem } from "@/components/ui/RelatedItemsGrid";

export interface ChronicleLink {
  id:         string;
  titleNtsc:  string;
  boxArtUrl:  string | null;
  wikiUrl:    string | null;
}

/** Dados mínimos de troféus/stickers para a lista lateral, a busca e a navegação (vão todos para o cliente). */
export interface CollectibleListItem {
  id:               string;
  name:             string;
  orderIndex:       number | null;
  assetRenderUrl:   string | null;
  assetRender2Url:  string | null;  // imagem 3DS (SSB4) ou clipe 360° — decide o layout do centro
  franchiseName:    string | null;
  smashGameVersion: string;
}

/** Dados completos de UM troféu/sticker; buscados sob demanda em /api/collectibles/[id]. */
export interface CollectibleDetail {
  id:               string;
  nameJp:           string | null;
  descriptionEn:    string | null;
  descriptionPt:    string | null;
  descriptionJp:    string | null;
  descriptionJpEn:  string | null;
  sourceGame:       string | null;
  svgIconUrl:       string | null;
  franchiseId:      string | null;
  videoStartSec:           number | null;
  videoEndSec:             number | null;
  videoStartSec2:          number | null;
  videoEndSec2:            number | null;
  fighterBioVideoStartSec: number | null;
  fighterBioVideoEndSec:   number | null;
  relatedItems:     RelatedItem[];
  chronicleLinks:   ChronicleLink[];
}
