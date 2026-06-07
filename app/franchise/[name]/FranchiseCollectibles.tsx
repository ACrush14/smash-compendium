"use client";

import { useState } from "react";

type CollectibleType = "ALL" | "TROPHY" | "SPIRIT" | "STICKER";
type EraFilter = "ALL" | "SSB64" | "SSBM" | "SSBB" | "SSB4" | "SSBU";

export interface FranchiseCollectible {
  id: string;
  type: string;
  smashGameVersion: string;
  name: string;
  nameJp: string | null;
  descriptionEn: string | null;
  descriptionPt: string | null;
  descriptionJp: string | null;
  descriptionJpEn: string | null;
  assetRenderUrl: string | null;
  fighter: { name: string; rosterNumber: string } | null;
}

const ERA_LABEL: Record<string, string> = {
  SSB64: "64", SSBM: "Melee", SSBB: "Brawl", SSB4: "4", SSBU: "Ultimate",
};

const ERA_COLORS: Record<string, { badge: string; dot: string }> = {
  SSB64: { badge: "border-yellow-500/30 text-yellow-400", dot: "bg-yellow-400" },
  SSBM:  { badge: "border-blue-500/30 text-blue-400",    dot: "bg-blue-400"   },
  SSBB:  { badge: "border-red-500/30 text-red-400",      dot: "bg-red-400"    },
  SSB4:  { badge: "border-purple-500/30 text-purple-400",dot: "bg-purple-400" },
  SSBU:  { badge: "border-cyan-500/30 text-cyan-400",    dot: "bg-cyan-400"   },
};

const TYPE_LABELS: Record<string, string> = {
  TROPHY: "Troféus",
  SPIRIT: "Spirits",
  STICKER: "Stickers",
};

const ALL_ERAS: EraFilter[] = ["ALL", "SSB64", "SSBM", "SSBB", "SSB4", "SSBU"];

// Expandable collectible card
function CollectibleCard({ item, lang }: { item: FranchiseCollectible; lang: "EN" | "PT" }) {
  const [expanded, setExpanded] = useState(false);

  const desc = lang === "PT"
    ? (item.descriptionPt ?? item.descriptionEn)
    : item.descriptionEn;

  const era = ERA_COLORS[item.smashGameVersion];

  return (
    <div className="border border-white/5 bg-[#05050f] hover:border-white/10 transition-colors">
      {/* Card header */}
      <div className="flex items-start gap-2.5 p-3">
        {/* Image */}
        <div className="shrink-0 w-10 h-10 border border-white/5 bg-black/20 flex items-center justify-center overflow-hidden">
          {item.assetRenderUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.assetRenderUrl}
              alt={item.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-4 h-4 border border-white/10" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            {/* Era badge */}
            <span className={`text-[8px] font-mono px-1.5 py-px border ${
              era?.badge ?? "border-slate-500/30 text-slate-500"
            }`}>
              {ERA_LABEL[item.smashGameVersion] ?? item.smashGameVersion}
            </span>

            {/* Type badge */}
            <span className="text-[8px] font-mono px-1.5 py-px border border-white/10 text-slate-600">
              {TYPE_LABELS[item.type] ?? item.type}
            </span>

            {/* Fighter attribution */}
            {item.fighter && (
              <span className="text-[8px] font-mono px-1.5 py-px border border-cyan-500/15 text-cyan-800">
                ← {item.fighter.name}
              </span>
            )}
          </div>

          <p className="text-[12px] text-slate-200 leading-tight font-medium truncate">
            {item.name}
          </p>
          {item.nameJp && (
            <p className="text-[10px] text-slate-600 leading-tight mt-px truncate">
              {item.nameJp}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      {desc && (
        <div className="px-3 pb-3">
          <div
            className={`text-[11px] text-slate-400 leading-relaxed ${expanded ? "" : "line-clamp-2"}`}
          >
            {desc}
          </div>
          {desc.length > 120 && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="text-[9px] font-mono text-slate-600 hover:text-slate-400 mt-1 transition-colors"
            >
              {expanded ? "▲ menos" : "▼ mais"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function FranchiseCollectibles({
  collectibles,
}: {
  collectibles: FranchiseCollectible[];
}) {
  const [typeFilter, setTypeFilter] = useState<CollectibleType>("ALL");
  const [eraFilter,  setEraFilter]  = useState<EraFilter>("ALL");
  const [lang,       setLang]       = useState<"EN" | "PT">("EN");

  // Available eras (only show tabs that have data)
  const availableEras = ALL_ERAS.filter(e => {
    if (e === "ALL") return true;
    return collectibles.some(c => c.smashGameVersion === e);
  });

  // Available types
  const availableTypes = (["ALL", "TROPHY", "SPIRIT", "STICKER"] as CollectibleType[]).filter(t => {
    if (t === "ALL") return true;
    return collectibles.some(c => c.type === t);
  });

  const filtered = collectibles.filter(c => {
    if (typeFilter !== "ALL" && c.type !== typeFilter) return false;
    if (eraFilter  !== "ALL" && c.smashGameVersion !== eraFilter) return false;
    return true;
  });

  // Count per type (for badges)
  const counts: Record<string, number> = { ALL: collectibles.length };
  for (const c of collectibles) {
    counts[c.type] = (counts[c.type] ?? 0) + 1;
  }

  if (collectibles.length === 0) {
    return (
      <section className="mb-10">
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-slate-600 mb-4 flex items-center gap-2">
          <span className="h-px flex-1 bg-white/5" />
          COLECIONÁVEIS
          <span className="h-px flex-1 bg-white/5" />
        </h2>
        <p className="text-center text-slate-700 text-[12px] py-8 font-mono">
          Nenhum colecionável atribuído a esta franquia.
          <br />
          <span className="text-slate-800">
            Use o editor de fighters para mover troféus de franquia para cá.
          </span>
        </p>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <h2 className="font-mono text-[10px] uppercase tracking-widest text-slate-600 mb-4 flex items-center gap-2">
        <span className="h-px flex-1 bg-white/5" />
        COLECIONÁVEIS
        <span className="font-mono text-[9px] px-2 py-px border border-white/10 text-slate-700">
          {filtered.length}
        </span>
        <span className="h-px flex-1 bg-white/5" />
      </h2>

      {/* Controls bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Type filter */}
        <div className="flex gap-1">
          {availableTypes.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2.5 py-1 text-[10px] font-mono border transition-all ${
                typeFilter === t
                  ? "border-cyan-500/40 text-cyan-400 bg-cyan-500/10"
                  : "border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20"
              }`}
            >
              {t === "ALL" ? "Todos" : TYPE_LABELS[t]}
              {counts[t] !== undefined && (
                <span className="ml-1 text-[8px] opacity-50">{counts[t]}</span>
              )}
            </button>
          ))}
        </div>

        {/* Era filter */}
        <div className="flex gap-1">
          {availableEras.map(e => {
            const era = ERA_COLORS[e];
            const isActive = eraFilter === e;
            return (
              <button
                key={e}
                onClick={() => setEraFilter(e)}
                className={`px-2.5 py-1 text-[10px] font-mono border transition-all ${
                  isActive
                    ? era
                      ? `${era.badge} bg-current/5`
                      : "border-white/30 text-white"
                    : "border-white/10 text-slate-600 hover:text-slate-400 hover:border-white/20"
                }`}
              >
                {e === "ALL" ? "Todas eras" : ERA_LABEL[e]}
              </button>
            );
          })}
        </div>

        {/* Lang toggle */}
        <div className="flex gap-1 ml-auto">
          {(["EN", "PT"] as const).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2 py-0.5 text-[9px] font-mono border transition-all ${
                lang === l
                  ? "border-white/20 text-slate-300"
                  : "border-white/5 text-slate-700 hover:text-slate-500"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-slate-700 text-[11px] py-8 font-mono">
          Nenhum resultado para este filtro.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {filtered.map(item => (
            <CollectibleCard key={item.id} item={item} lang={lang} />
          ))}
        </div>
      )}
    </section>
  );
}
