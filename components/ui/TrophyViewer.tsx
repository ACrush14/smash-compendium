"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

export interface TrophyItem {
  id:               string;
  name:             string;
  nameJp:           string | null;
  orderIndex:       number | null;
  assetRenderUrl:   string | null;
  descriptionEn:    string | null;
  sourceGame:       string | null;
  svgIconUrl:       string | null;
  franchiseName:    string | null;
  smashGameVersion: string;
}

interface Props {
  trophies: TrophyItem[];
}

const SIDEBAR_WINDOW = 14;

export default function TrophyViewer({ trophies }: Props) {
  const [index, setIndex]   = useState(0);
  const [query, setQuery]   = useState("");
  const [dir,   setDir]     = useState<"next" | "prev">("next");
  const sidebarRef          = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? trophies.filter(t =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        String(t.orderIndex ?? "").includes(query) ||
        (t.franchiseName ?? "").toLowerCase().includes(query.toLowerCase())
      )
    : trophies;

  const current = filtered[index] ?? filtered[0];
  const safeIdx = index % Math.max(filtered.length, 1);

  const go = useCallback((delta: number) => {
    setDir(delta > 0 ? "next" : "prev");
    setIndex(i => {
      const next = i + delta;
      if (next < 0) return filtered.length - 1;
      if (next >= filtered.length) return 0;
      return next;
    });
  }, [filtered.length]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") go(1);
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   go(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go]);

  // Scroll sidebar to keep active item visible
  useEffect(() => {
    const el = sidebarRef.current?.querySelector(`[data-active="true"]`);
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [safeIdx]);

  if (!current) return (
    <div className="flex items-center justify-center h-64 text-vault-muted font-mono">
      Nenhum troféu encontrado.
    </div>
  );

  const num = current.orderIndex ? `#${String(current.orderIndex).padStart(3, "0")}` : "—";
  const prev = (filtered[safeIdx - 1] ?? filtered[filtered.length - 1])!;
  const next = (filtered[safeIdx + 1] ?? filtered[0])!;

  return (
    <div className="flex flex-col gap-6">
      {/* Search + counter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-vault-muted text-sm">🔍</span>
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setIndex(0); }}
            placeholder="Nome, número ou franquia…"
            className="w-full bg-vault-surface border border-vault-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-vault-accent transition-colors"
          />
        </div>
        <span className="text-xs font-mono text-vault-muted bg-vault-surface border border-vault-border/50 px-3 py-2 rounded-lg whitespace-nowrap">
          {safeIdx + 1} / {filtered.length}
        </span>
      </div>

      {/* Main layout */}
      <div className="flex gap-4 min-h-[480px]">

        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className="hidden md:flex flex-col w-52 shrink-0 bg-vault-surface/40 border border-vault-border/50 rounded-xl overflow-y-auto max-h-[520px] scrollbar-thin"
        >
          {filtered.map((t, i) => {
            const active = i === safeIdx;
            return (
              <button
                key={t.id}
                data-active={active}
                onClick={() => { setDir(i > safeIdx ? "next" : "prev"); setIndex(i); }}
                className={`flex items-center gap-2 px-3 py-2 text-left transition-colors border-b border-vault-border/20 last:border-0 ${
                  active
                    ? "bg-vault-accent/15 border-l-2 border-l-vault-accent"
                    : "hover:bg-vault-surface/80"
                }`}
              >
                {t.assetRenderUrl ? (
                  <div className="relative w-8 h-8 shrink-0">
                    <Image src={t.assetRenderUrl} alt={t.name} fill className="object-contain" sizes="32px" />
                  </div>
                ) : (
                  <div className="w-8 h-8 shrink-0 bg-slate-800 rounded flex items-center justify-center text-[10px] text-slate-500">?</div>
                )}
                <div className="min-w-0">
                  <p className={`text-xs font-medium truncate leading-tight ${active ? "text-slate-100" : "text-slate-400"}`}>
                    {t.name}
                  </p>
                  {t.orderIndex && (
                    <p className="text-[10px] font-mono text-vault-muted">#{String(t.orderIndex).padStart(3, "0")}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Center — trophy */}
        <div className="flex-1 flex flex-col items-center gap-4">

          {/* Navigation */}
          <div className="flex items-center justify-between w-full px-2">
            <button
              onClick={() => go(-1)}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-100 transition-colors group"
            >
              <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
              <span className="text-xs font-mono truncate max-w-[100px] hidden sm:block">{prev.name}</span>
            </button>
            <span className="text-xs font-mono text-vault-muted px-2">{num}</span>
            <button
              onClick={() => go(1)}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-100 transition-colors group"
            >
              <span className="text-xs font-mono truncate max-w-[100px] hidden sm:block">{next.name}</span>
              <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          {/* Trophy image */}
          <div className="relative w-56 h-56 md:w-64 md:h-64">
            <div className="absolute inset-0 rounded-full bg-vault-accent/5 blur-2xl" />
            {current.assetRenderUrl ? (
              <Image
                key={`${current.id}-${dir}`}
                src={current.assetRenderUrl}
                alt={current.name}
                fill
                className="object-contain drop-shadow-2xl animate-trophy-enter"
                sizes="256px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-10">?</div>
            )}
          </div>

          {/* Name + franchise */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              {current.svgIconUrl && (
                <div className="relative w-5 h-5 opacity-60">
                  <Image src={current.svgIconUrl} alt={current.franchiseName ?? ""} fill className="object-contain" sizes="20px" />
                </div>
              )}
              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-100 uppercase tracking-tight">
                {current.name}
              </h2>
            </div>
            {current.franchiseName && (
              <p className="text-xs font-mono text-vault-muted mt-1 uppercase tracking-widest">
                {current.franchiseName}
              </p>
            )}
            {current.nameJp && (
              <p className="text-sm text-slate-500 mt-0.5">{current.nameJp}</p>
            )}
          </div>
        </div>

        {/* Right — info cards */}
        <div className="hidden lg:flex flex-col gap-3 w-64 shrink-0">

          {/* First Game / Moves */}
          {current.sourceGame && (
            <div className="bg-vault-surface border border-vault-border/60 rounded-xl p-4">
              <p className="text-[10px] font-mono uppercase tracking-widest text-vault-muted mb-2">
                Primeiro Jogo / Movimentos
              </p>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {current.sourceGame}
              </p>
            </div>
          )}

          {/* Description */}
          {current.descriptionEn ? (
            <div className="bg-vault-surface border border-vault-border/60 rounded-xl p-4 flex-1">
              <p className="text-[10px] font-mono uppercase tracking-widest text-vault-muted mb-2">
                Descrição
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                {current.descriptionEn}
              </p>
            </div>
          ) : (
            <div className="bg-vault-surface/40 border border-vault-border/30 rounded-xl p-4 flex-1 flex items-center justify-center">
              <p className="text-xs font-mono text-vault-muted/50 text-center">
                Descrição ainda não importada
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile description */}
      <div className="lg:hidden flex flex-col gap-3">
        {current.sourceGame && (
          <div className="bg-vault-surface border border-vault-border/60 rounded-xl p-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-vault-muted mb-1">Primeiro Jogo / Movimentos</p>
            <p className="text-sm text-slate-300 whitespace-pre-line">{current.sourceGame}</p>
          </div>
        )}
        {current.descriptionEn && (
          <div className="bg-vault-surface border border-vault-border/60 rounded-xl p-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-vault-muted mb-1">Descrição</p>
            <p className="text-sm text-slate-300 leading-relaxed">{current.descriptionEn}</p>
          </div>
        )}
      </div>
    </div>
  );
}
