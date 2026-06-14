"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

export interface SpiritItem {
  id: string;
  name: string;
  nameJp: string | null;
  posicaoSpiritSsbu: number | null;
  assetRenderUrl: string | null;
  spiritArtworkSource: string | null;
  spiritFirstAppearance: string | null;
  spiritMusicTitle: string | null;
  spiritMusicArtist: string | null;
  spiritMusicDuration: string | null;
  spiritCuratorComment: string | null;
  sourceGame: string | null;
  svgIconUrl: string | null;
  franchiseName: string | null;
  artCoverUrl: string | null;
  firstCoverUrl: string | null;
  artWikiUrl: string | null;
  firstWikiUrl: string | null;
  descriptionEn: string | null;
}

const SIDEBAR_SIZE = 14;

export default function SpiritViewer({ spirits, initialIndex = 0 }: { spirits: SpiritItem[], initialIndex?: number }) {
  const [index, setIndex]         = useState(initialIndex);
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);
  const [query, setQuery]         = useState("");
  const activeRef = useRef<HTMLButtonElement>(null);

  const filtered = query.trim()
    ? spirits.filter(s => {
        const q   = query.toLowerCase();
        const num = s.posicaoSpiritSsbu?.toString() ?? "";
        return (
          s.name.toLowerCase().includes(q) ||
          num.includes(q) ||
          (s.franchiseName ?? "").toLowerCase().includes(q)
        );
      })
    : spirits;

  const safeIndex = Math.min(index, Math.max(0, filtered.length - 1));
  const current   = filtered[safeIndex];

  // O usuário solicitou um scroll com todos os itens, então não precisamos mais cortar a lista.
  // Renderiza todos os itens filtrados na sidebar scrollable.

  // Scroll active sidebar item into view when navigating
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [safeIndex]);

  // Keyboard navigation (← →)
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

  const goNext = () => {
    if (safeIndex < filtered.length - 1) { setDirection("next"); setIndex(safeIndex + 1); }
  };
  const goPrev = () => {
    if (safeIndex > 0)                   { setDirection("prev"); setIndex(safeIndex - 1); }
  };
  const goTo = (filteredIdx: number) => {
    setDirection(filteredIdx > safeIndex ? "next" : filteredIdx < safeIndex ? "prev" : null);
    setIndex(filteredIdx);
  };

  // Clica no spirit atual durante busca → pula para posição real na lista completa
  const jumpToFull = () => {
    if (!query.trim() || !current) return;
    const fullIndex = spirits.findIndex(s => s.id === current.id);
    if (fullIndex !== -1) {
      setDirection(null);
      setIndex(fullIndex);
      setQuery("");
    }
  };

  const isSearchActive = query.trim().length > 0;

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

      {!current ? (
        <div className="py-16 text-center text-slate-500">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm">Nenhum spirit encontrado para &ldquo;{query}&rdquo;</p>
        </div>
      ) : (
        <>
          {/* ── Layout principal: lista | art | texto ── */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_280px] gap-3 md:gap-5 items-start">

            {/* ── ESQUERDA: lista de spirits ── */}
            <div className="hidden md:flex flex-col gap-0.5 bg-slate-900/40 rounded-xl border border-vault-border/30 p-1.5 max-h-[700px] overflow-y-auto scrollbar-thin scrollbar-thumb-vault-accent/30 scrollbar-track-transparent">
              {filtered.map((spirit, filteredIdx) => {
                const isActive    = filteredIdx === safeIndex;
                return (
                  <button
                    key={spirit.id}
                    ref={isActive ? activeRef : undefined}
                    onClick={() => (isSearchActive && isActive) ? jumpToFull() : goTo(filteredIdx)}
                    title={isSearchActive && isActive ? "Clique para ir à posição na lista completa" : spirit.name}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left w-full transition-all ${
                      isActive
                        ? "bg-vault-accent/15 border border-vault-accent/30"
                        : "hover:bg-slate-800/60 border border-transparent"
                    }`}
                  >
                    <div className="relative w-8 h-8 shrink-0 rounded bg-slate-900/60 overflow-hidden">
                      {spirit.assetRenderUrl && (
                        <Image
                          src={spirit.assetRenderUrl}
                          alt={spirit.name}
                          fill
                          className="object-contain"
                          sizes="32px"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-[11px] font-medium truncate leading-tight ${isActive ? "text-slate-100" : "text-slate-500"}`}>
                        {spirit.name}
                      </p>
                      {spirit.posicaoSpiritSsbu != null && (
                        <p className={`text-[9px] font-mono ${isActive ? "text-vault-accent" : "text-slate-700"}`}>
                          #{spirit.posicaoSpiritSsbu}
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

            {/* ── CENTRO: art + navegação ── */}
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

              {/* Spirit art com aura — key força remount e dispara animação CSS */}
              <div
                key={safeIndex}
                onClick={isSearchActive ? jumpToFull : undefined}
                className={`flex flex-col items-center gap-2 ${direction ? `spirit-enter-${direction}` : ""} ${isSearchActive ? "cursor-pointer" : ""}`}
              >
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

                {/* Nome + número */}
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-100 leading-tight">{current.name}</p>
                  {current.nameJp && (
                    <p className="text-xs text-slate-500 mt-0.5">{current.nameJp}</p>
                  )}
                  <p className="text-xs font-mono mt-1 flex items-center justify-center gap-2">
                    {current.posicaoSpiritSsbu != null && (
                      <span className="text-vault-accent">#{String(current.posicaoSpiritSsbu).padStart(4, "0")}</span>
                    )}
                    {current.franchiseName && (
                      <span className="text-slate-600">{current.franchiseName}</span>
                    )}
                  </p>
                  {isSearchActive && (
                    <p className="text-[10px] font-mono text-vault-accent/50 mt-1">↩ clique para ir à posição</p>
                  )}
                </div>

                {/* Jogos de origem — logo abaixo do nome */}
                {(current.spiritArtworkSource || current.spiritFirstAppearance || current.sourceGame) && (
                  <div className="flex flex-wrap gap-2 justify-center mt-1">
                    {current.spiritArtworkSource && (
                      <GameCard
                        label="Arte"
                        title={current.spiritArtworkSource}
                        coverUrl={current.artCoverUrl}
                        wikiUrl={current.artWikiUrl}
                      />
                    )}
                    {current.spiritFirstAppearance && current.spiritFirstAppearance !== current.spiritArtworkSource && (
                      <GameCard
                        label="1ª Aparição"
                        title={current.spiritFirstAppearance}
                        coverUrl={current.firstCoverUrl}
                        wikiUrl={current.firstWikiUrl}
                      />
                    )}
                    {!current.spiritArtworkSource && !current.spiritFirstAppearance && current.sourceGame && (
                      <p className="text-sm text-slate-400 italic">{current.sourceGame}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── DIREITA: música + texto ── */}
            <div className="flex flex-col gap-3 pt-1">
              {current.spiritMusicTitle && (
                <div className="bg-slate-900/50 rounded-xl border border-vault-border/30 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-vault-accent/70 block mb-1.5">
                    Música
                  </span>
                  <p className="text-sm text-vault-accent/90 font-medium leading-tight">
                    {current.spiritMusicTitle}
                  </p>
                  {current.spiritMusicArtist && (
                    <p className="text-xs text-slate-500 mt-1 leading-tight">
                      {current.spiritMusicArtist}
                      {current.spiritMusicDuration ? ` · ${current.spiritMusicDuration}` : ""}
                    </p>
                  )}
                </div>
              )}
              {current.descriptionEn && (
                <div className="bg-slate-900/50 rounded-xl border border-vault-border/30 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block mb-1.5">
                    Inspiração da Batalha
                  </span>
                  <p className="text-sm text-slate-400 leading-snug whitespace-pre-wrap">{current.descriptionEn}</p>
                </div>
              )}
              {current.spiritCuratorComment && (
                <div className="bg-slate-900/50 rounded-xl border border-vault-border/30 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block mb-1.5">
                    Comentário
                  </span>
                  <p className="text-sm text-slate-400 leading-snug whitespace-pre-wrap">{current.spiritCuratorComment}</p>
                </div>
              )}
              {!current.spiritMusicTitle && !current.spiritCuratorComment && !current.descriptionEn && (
                <p className="text-xs text-slate-700 italic text-center mt-8">Sem informações adicionais</p>
              )}
            </div>
          </div>

        </>
      )}
    </div>
  );
}

function GameCard({
  label,
  title,
  coverUrl,
  wikiUrl,
}: {
  label: string;
  title: string;
  coverUrl: string | null;
  wikiUrl: string | null;
}) {
  const inner = (
    <div className={`flex gap-3 items-center rounded-xl border p-3 transition-all ${
      wikiUrl
        ? "bg-slate-900/60 border-vault-border/40 hover:border-vault-accent/50 hover:bg-slate-900/80"
        : "bg-slate-900/40 border-vault-border/20"
    }`}>
      {coverUrl && (
        <div className="relative shrink-0 w-14 aspect-[3/4] bg-slate-900 rounded overflow-hidden border border-vault-border/40 shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverUrl} alt="" className="absolute inset-0 w-full h-full object-cover object-top" />
        </div>
      )}
      <div className="min-w-0">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">{label}</span>
        <p className="text-sm text-slate-300 font-medium leading-tight mt-0.5">{title}</p>
        {wikiUrl && (
          <span className="text-[10px] text-vault-accent/60 mt-1 block">↗ Wikipedia</span>
        )}
      </div>
    </div>
  );

  return wikiUrl ? (
    <a href={wikiUrl} target="_blank" rel="noopener noreferrer" className="block max-w-sm">
      {inner}
    </a>
  ) : (
    <div className="max-w-sm">{inner}</div>
  );
}
