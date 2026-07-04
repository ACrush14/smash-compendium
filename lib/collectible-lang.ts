import type { Lang } from "@/components/ui/FighterDataZone";

export interface CollectibleDescriptions {
  descriptionEn?:   string | null;
  descriptionPt?:   string | null;
  descriptionJp?:   string | null;
  descriptionJpEn?: string | null;
}

export function pickCollectibleDescription(item: CollectibleDescriptions, lang: Lang): string | null {
  switch (lang) {
    case "PT":    return item.descriptionPt ?? item.descriptionEn ?? null;
    case "JP":    return item.descriptionJp ?? null;
    case "JP_EN": return item.descriptionJpEn ?? item.descriptionEn ?? null;
    default:      return item.descriptionEn ?? null;
  }
}
