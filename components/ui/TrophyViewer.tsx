"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

export interface RelatedItem {
  id: string;
  name: string;
  smashGameVersion: string;
  assetRenderUrl: string | null;
  type: string;
}

export interface TrophyItem {
  id:               string;
  name:             string;
  nameJp:           string | null;
  orderIndex:       number | null;
  assetRenderUrl:   string | null;
  assetRender2Url:  string | null;  // Imagem 3DS (somente para SSB4 Both)
  descriptionEn:    string | null;
  sourceGame:       string | null;
  svgIconUrl:       string | null;
  franchiseName:    string | null;
  smashGameVersion: string;
  relatedItems:     RelatedItem[];
}

// Parse "Super Mario Bros. (NES) / New Super Mario Bros. (NDS)" → ["Super Mario Bros. (NES)", ...]
// Splits only on " / " (space-slash-space) to avoid breaking "Pokémon Red/Blue"
function parseSourceGames(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split(/\s+\/\s+/).map(s => s.trim()).filter(Boolean);
}

// Strip platform suffix for search query: "Super Mario Bros. (NES)" → "Super Mario Bros."
function gameSearchTitle(entry: string): string {
  return entry.replace(/\s*\([^)]+\)\s*$/, "").trim();
}

const SIDEBAR_SIZE = 14;

interface Props {
  trophies:     TrophyItem[];
  initialIndex?: number;
}

export default function TrophyViewer({ trophies, initialIndex = 0 }: Props) {
  const [index, setIndex]         = useState(initialIndex);
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);
  const [query, setQuery]         = useState("");
  const activeRef = useRef<HTMLButtonElement>(null);

  const filtered = query.trim()
    ? trophies.filter(t =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        String(t.orderIndex ?? "").includes(query) ||
        (t.franchiseName ?? "").toLowerCase().includes(query.toLowerCase())
      )
    : trophies;

  const safeIndex = Math.min(index, Math.max(0, filtered.length - 1));
  const current   = filtered[safeIndex];

  // Sidebar window centered on safeIndex
  const half         = Math.floor(SIDEBAR_SIZE / 2);
  const sidebarStart = Math.max(0, Math.min(safeIndex - half, filtered.length - SIDEBAR_SIZE));
  const sidebarEnd   = Math.min(filtered.length, sidebarStart + SIDEBAR_SIZE);
  const sidebarItems = filtered.slice(sidebarStart, sidebarEnd);

  // Scroll active into view
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [safeIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight" && safeIndex < filtered.length - 1) {
        setDirection("next"); setIndex(safeIndex + 1);
      } else if (e.key === "ArrowLeft" && safeIndex > 0) {
        setDirection("prev"); setIndex(safeIndex - 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [safeIndex, filtered.length]);

  // URL sync — update ?trophy=<id> without navigation
  useEffect(() => {
    if (!current) return;
    const url = new URL(window.location.href);
    url.searchParams.set("trophy", current.id);
    window.history.replaceState(null, "", url.toString());
  }, [current?.id]);

  const goNext = () => { if (safeIndex < filtered.length - 1) { setDirection("next"); setIndex(safeIndex + 1); } };
  const goPrev = () => { if (safeIndex > 0)                   { setDirection("prev"); setIndex(safeIndex - 1); } };
  const goTo   = (i: number) => {
    setDirection(i > safeIndex ? "next" : i < safeIndex ? "prev" : null);
    setIndex(i);
  };

  // Click during search → jump to that trophy's real position in full list
  const jumpToFull = () => {
    if (!query.trim() || !current) return;
    const fullIndex = trophies.findIndex(t => t.id === current.id);
    if (fullIndex !== -1) { setDirection(null); setIndex(fullIndex); setQuery(""); }
  };

  const isSearchActive = query.trim().length > 0;
  const games = parseSourceGames(current?.sourceGame ?? null);

  if (!current) return (
    <div className="py-16 text-center text-slate-500">
      <Search className="w-10 h-10 mx-auto mb-3 opacity-20" />
      <p className="text-sm">Nenhum troféu encontrado para &ldquo;{query}&rdquo;</p>
    </div>
  );

  const num = current.orderIndex ? `#${String(current.orderIndex).padStart(3, "0")}` : "—";

  return (
    <div className="flex flex-col gap-5 py-2">

      {/* ── Barra de busca ── */}
      <div className="relative w-full max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setIndex(0); setDirection(null); }}
          onKeyDown={e => { if (e.key === "Enter") jumpToFull(); }}
          placeholder="Nome, número ou franquia..."
          className="w-full bg-slate-900/80 border border-vault-border/50 rounded-lg pl-10 pr-9 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-vault-accent/50 focus:ring-1 focus:ring-vault-accent/20 transition-colors font-mono"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setIndex(0); setDirection(null); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── Progresso ── */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-600">
          <span className="text-vault-accent w-12 text-right tabular-nums">{safeIndex + 1}</span>
          <div className="w-36 h-[2px] bg-slate-800 relative rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-vault-accent/50 transition-all duration-150"
              style={{ width: `${((safeIndex + 1) / filtered.length) * 100}%` }}
            />
          </div>
          <span className="w-12 tabular-nums">{filtered.length}</span>
        </div>
      )}

      {/* ── Layout principal: lista | troféu | info ── */}
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_280px] gap-3 md:gap-5 items-start">

        {/* ── ESQUERDA: sidebar ── */}
        <div className="hidden md:flex flex-col gap-0.5 bg-slate-900/40 rounded-xl border border-vault-border/30 p-1.5">
          {sidebarItems.map((t, i) => {
            const filteredIdx = sidebarStart + i;
            const isActive    = filteredIdx === safeIndex;
            return (
              <button
                key={t.id}
                ref={isActive ? activeRef : undefined}
                onClick={() => (isSearchActive && isActive) ? jumpToFull() : goTo(filteredIdx)}
                title={isSearchActive && isActive ? "Clique para ir à posição na lista completa" : t.name}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left w-full transition-all ${
                  isActive
                    ? "bg-vault-accent/15 border border-vault-accent/30"
                    : "hover:bg-slate-800/60 border border-transparent"
                }`}
              >
                <div className="relative w-8 h-8 shrink-0 rounded bg-slate-900/60 overflow-hidden">
                  {t.assetRenderUrl && (
                    <Image src={t.assetRenderUrl} alt={t.name} fill className="object-contain" sizes="32px" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-[11px] font-medium truncate leading-tight ${isActive ? "text-slate-100" : "text-slate-500"}`}>
                    {t.name}
                  </p>
                  {t.orderIndex != null && (
                    <p className={`text-[9px] font-mono ${isActive ? "text-vault-accent" : "text-slate-700"}`}>
                      #{t.orderIndex}
                    </p>
                  )}
                </div>
                {isSearchActive && isActive && (
                  <span className="text-[9px] text-vault-accent/60 shrink-0">↩</span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── CENTRO: troféu + navegação ── */}
        <div className="flex flex-col items-center gap-3">

          {/* Setas de navegação */}
          <div className="flex items-center gap-2 w-full">
            <button
              onClick={goPrev}
              disabled={safeIndex === 0}
              className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full border border-slate-800 text-slate-600 hover:text-vault-accent hover:border-vault-accent/50 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex-1 flex gap-2 min-w-0">
              <span className="flex-1 text-[10px] font-mono text-slate-700 truncate text-right">
                {safeIndex > 0 ? filtered[safeIndex - 1]?.name : ""}
              </span>
              <span className="flex-1 text-[10px] font-mono text-slate-700 truncate text-left">
                {safeIndex < filtered.length - 1 ? filtered[safeIndex + 1]?.name : ""}
              </span>
            </div>
            <button
              onClick={goNext}
              disabled={safeIndex === filtered.length - 1}
              className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full border border-slate-800 text-slate-600 hover:text-vault-accent hover:border-vault-accent/50 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
              aria-label="Próximo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Troféu com efeitos de spirit — key força remount na navegação */}
          <div
            key={safeIndex}
            onClick={isSearchActive ? jumpToFull : undefined}
            className={`flex flex-col items-center gap-2 ${direction ? `spirit-enter-${direction}` : ""} ${isSearchActive ? "cursor-pointer" : ""}`}
          >
            {/* SSB4 Both: mostra 3DS + WiiU lado a lado */}
            {current.smashGameVersion === "SSB4" && current.assetRender2Url ? (
              <div className="flex gap-3 items-end justify-center">
                {/* 3DS */}
                <div className="flex flex-col items-center gap-1">
                  <div className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center">
                    <div className="spirit-rays absolute inset-0 pointer-events-none opacity-60" />
                    <div className="spirit-glow absolute inset-0 pointer-events-none opacity-60" />
                    <div className="absolute inset-0 pointer-events-none overflow-visible">
                      <span className="spirit-star ss-1" /><span className="spirit-star ss-3" />
                      <span className="spirit-star ss-5" /><span className="spirit-star ss-9" />
                      <span className="spirit-orb so-1"  /><span className="spirit-orb so-4"  />
                      <span className="spirit-orb so-7"  /><span className="spirit-orb so-10" />
                      <span className="spirit-rise sr-1" /><span className="spirit-rise sr-3" />
                    </div>
                    <Image
                      src={current.assetRender2Url}
                      alt={`${current.name} (3DS)`}
                      fill
                      className="object-contain p-1 relative z-10"
                      sizes="128px"
                      priority
                    />
                  </div>
                  <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">3DS</span>
                </div>

                {/* WiiU */}
                <div className="flex flex-col items-center gap-1">
                  <div className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center">
                    <div className="spirit-rays absolute inset-0 pointer-events-none opacity-60" />
                    <div className="spirit-glow absolute inset-0 pointer-events-none opacity-60" />
                    <div className="absolute inset-0 pointer-events-none overflow-visible">
                      <span className="spirit-star ss-2" /><span className="spirit-star ss-6" />
                      <span className="spirit-star ss-8" /><span className="spirit-star ss-11" />
                      <span className="spirit-orb so-2"  /><span className="spirit-orb so-5"  />
                      <span className="spirit-orb so-8"  /><span className="spirit-orb so-11" />
                      <span className="spirit-rise sr-2" /><span className="spirit-rise sr-4" />
                    </div>
                    {current.assetRenderUrl ? (
                      <Image
                        src={current.assetRenderUrl}
                        alt={`${current.name} (Wii U)`}
                        fill
                        className="object-contain p-1 relative z-10"
                        sizes="128px"
                        priority
                      />
                    ) : (
                      <span className="text-3xl opacity-10 relative z-10">?</span>
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Wii U</span>
                </div>
              </div>
            ) : (
              /* Single image — Melee, Brawl, SSB4_3DS, SSB4_WIIU, SSB4 sem imagem dupla */
              <div className="relative w-56 h-56 md:w-64 md:h-64 flex items-center justify-center shrink-0">
                {current.svgIconUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={current.svgIconUrl}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 w-full h-full object-contain opacity-[0.07] scale-90 pointer-events-none"
                  />
                )}
                <div className="spirit-rays absolute inset-0 pointer-events-none" />
                <div className="spirit-glow absolute inset-0 pointer-events-none" />
                <div className="absolute inset-0 pointer-events-none overflow-visible">
                  <span className="spirit-star ss-1"  /><span className="spirit-star ss-2"  />
                  <span className="spirit-star ss-3"  /><span className="spirit-star ss-4"  />
                  <span className="spirit-star ss-5"  /><span className="spirit-star ss-6"  />
                  <span className="spirit-star ss-7"  /><span className="spirit-star ss-8"  />
                  <span className="spirit-star ss-9"  /><span className="spirit-star ss-10" />
                  <span className="spirit-star ss-11" /><span className="spirit-star ss-12" />
                  <span className="spirit-orb so-1"   /><span className="spirit-orb so-2"   />
                  <span className="spirit-orb so-3"   /><span className="spirit-orb so-4"   />
                  <span className="spirit-orb so-5"   /><span className="spirit-orb so-6"   />
                  <span className="spirit-orb so-7"   /><span className="spirit-orb so-8"   />
                  <span className="spirit-orb so-9"   /><span className="spirit-orb so-10"  />
                  <span className="spirit-orb so-11"  /><span className="spirit-orb so-12"  />
                  <span className="spirit-rise sr-1"  /><span className="spirit-rise sr-2"  />
                  <span className="spirit-rise sr-3"  /><span className="spirit-rise sr-4"  />
                </div>
                {current.assetRenderUrl ? (
                  <Image
                    src={current.assetRenderUrl}
                    alt={current.name}
                    fill
                    className="object-contain p-1 relative z-10"
                    sizes="256px"
                    priority
                  />
                ) : (
                  <span className="text-5xl opacity-10 relative z-10">?</span>
                )}
              </div>
            )}

            {/* Nome + número */}
            <div className="text-center">
              <p className="text-xl font-bold text-slate-100 leading-tight">{current.name}</p>
              {current.nameJp && (
                <p className="text-xs text-slate-500 mt-0.5">{current.nameJp}</p>
              )}
              <p className="text-xs font-mono mt-1 flex items-center justify-center gap-2">
                <span className="text-vault-accent">{num}</span>
                {current.franchiseName && (
                  <span className="text-slate-600">{current.franchiseName}</span>
                )}
              </p>
              {isSearchActive && (
                <p className="text-[10px] font-mono text-vault-accent/50 mt-1">↩ clique para ir à posição</p>
              )}
            </div>

            {/* Jogos de origem → links para Chronicles */}
            {games.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mt-1">
                {games.map((g, gi) => (
                  <a
                    key={gi}
                    href={`/chronicles?q=${encodeURIComponent(gameSearchTitle(g))}`}
                    className="flex items-center gap-1.5 bg-slate-900/60 border border-vault-border/40 hover:border-vault-accent/50 hover:bg-slate-900/80 rounded-lg px-3 py-1.5 transition-all group"
                    title={`Ver ${g} no Chronicles`}
                  >
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-200 transition-colors">{g}</span>
                    <span className="text-[9px] text-vault-accent/40 group-hover:text-vault-accent/80 transition-colors">↗</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── DIREITA: descrição ── */}
        <div className="hidden md:flex flex-col gap-3 pt-1">
          {current.descriptionEn ? (
            <div className="bg-slate-900/50 rounded-xl border border-vault-border/30 p-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-vault-accent/70 block mb-1.5">
                Descrição
              </span>
              <p className="text-sm text-slate-300 leading-snug">{current.descriptionEn}</p>
            </div>
          ) : (
            <p className="text-xs text-slate-700 italic text-center mt-8">Descrição não disponível</p>
          )}
        </div>
      </div>

      {/* ── Mobile: descrição ── */}
      <div className="md:hidden">
        {current.descriptionEn && (
          <div className="bg-slate-900/50 rounded-xl border border-vault-border/30 p-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-vault-accent/70 block mb-1.5">Descrição</span>
            <p className="text-sm text-slate-300 leading-snug">{current.descriptionEn}</p>
          </div>
        )}
      </div>

      {/* ── Personagens Relacionados ── */}
      <div className="mt-4 pt-5 border-t border-vault-border/20">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3">
          Personagens Relacionados
        </h3>
        {current.relatedItems.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {current.relatedItems.map(rel => (
              <a
                key={rel.id}
                href={`/collectibles?type=TROPHY&game=${rel.smashGameVersion}&trophy=${rel.id}`}
                className="flex items-center gap-2 bg-slate-900/50 border border-vault-border/40 hover:border-vault-accent/50 hover:bg-slate-900/80 rounded-lg px-3 py-2 transition-all"
              >
                {rel.assetRenderUrl && (
                  <div className="relative w-8 h-8 shrink-0">
                    <Image src={rel.assetRenderUrl} alt={rel.name} fill className="object-contain" sizes="32px" />
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-slate-300">{rel.name}</p>
                  <p className="text-[9px] font-mono text-vault-muted">{rel.smashGameVersion.replace("_", " ")}</p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-700 italic">
            Nenhum personagem relacionado vinculado ainda.
          </p>
        )}
      </div>
    </div>
  );
}
