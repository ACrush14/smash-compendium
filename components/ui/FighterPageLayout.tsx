"use client";

import { useState } from "react";
import MediaVaultViewer, { type MediaAsset } from "@/components/ui/MediaVaultViewer";
import FighterRightPanel from "@/components/ui/FighterRightPanel";
import { type MusicTrack } from "@/components/ui/MusicPlayer";
import { type OriginGame } from "@/components/ui/OriginGamesPanel";
import { type FighterDataZoneData, type Lang } from "@/components/ui/FighterDataZone";

interface FighterHeader {
  rosterNumber:  number;
  name:          string;
  franchiseName: string;
  appearances:   string[];
}

interface FighterPageLayoutProps {
  fighterId:   string;
  fighterSlug: string;
  suggestions: any[];
  assets:      MediaAsset[];
  music?:      MusicTrack;
  header:      FighterHeader;
  originGames: OriginGame[];
  dataZone:    FighterDataZoneData;
}

export default function FighterPageLayout({
  fighterId, fighterSlug, suggestions, assets, music, header, originGames, dataZone,
}: FighterPageLayoutProps) {
  const [lang, setLang] = useState<Lang>("EN");

  return (
    <>
      {/* ZONA ESQUERDA — MediaVault (5 cols) */}
      <aside className="col-span-5 relative border-r border-cyan-500/10">
        <MediaVaultViewer assets={assets} music={music} lang={lang} />
      </aside>

      {/* ZONA DIREITA — FighterRightPanel */}
      <div className="col-span-7 relative">
        <FighterRightPanel
          fighterId={fighterId}
          fighterSlug={fighterSlug}
          suggestions={suggestions}
          header={header}
          originGames={originGames}
          dataZone={dataZone}
          lang={lang}
          setLang={setLang}
        />
      </div>
    </>
  );
}
