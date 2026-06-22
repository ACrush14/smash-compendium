"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Search, Play, Pause, Music2, ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";

export interface MusicTrack {
  id:              string;
  title:           string;
  arranger:        string | null;
  duration:        string | null;
  sourceGame:      string | null;
  compositionType: string | null;
  youtubeId:       string | null;
  isRemix:         boolean;
  franchiseName:   string;
  franchiseIcon:   string | null;
}

interface Props {
  tracks: MusicTrack[];
}

const COMP_TYPE_COLORS: Record<string, string> = {
  "Original":    "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "New Remix":   "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Melee Remix": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "SSB4 Remix":  "bg-red-500/20 text-red-300 border-red-500/30",
  "Brawl Remix": "bg-green-500/20 text-green-300 border-green-500/30",
};

function compTypeClass(ct: string | null): string {
  if (!ct) return "bg-slate-500/20 text-slate-400 border-slate-500/30";
  for (const [key, cls] of Object.entries(COMP_TYPE_COLORS)) {
    if (ct.includes(key)) return cls;
  }
  return "bg-slate-500/20 text-slate-400 border-slate-500/30";
}

export default function MusicBrowser({ tracks }: Props) {
  const PAGE_SIZE = 80;
  const [query,       setQuery]       = useState("");
  const [franchise,   setFranchise]   = useState<string | null>(null);
  const [compType,    setCompType]    = useState<string | null>(null);
  const [playing,     setPlaying]     = useState<MusicTrack | null>(null);
  const [playingIdx,  setPlayingIdx]  = useState<number>(-1);
  const [page,        setPage]        = useState(0);
  const playerRef = useRef<HTMLIFrameElement>(null);

  // Unique franchise list
  const franchises = Array.from(new Set(tracks.map(t => t.franchiseName))).sort();
  // Unique compositionType list
  const compTypes  = Array.from(new Set(tracks.map(t => t.compositionType).filter(Boolean) as string[])).sort();

  const filtered = tracks.filter(t => {
    const q = query.toLowerCase();
    const matchQ = !q || t.title.toLowerCase().includes(q) ||
      (t.arranger ?? "").toLowerCase().includes(q) ||
      (t.sourceGame ?? "").toLowerCase().includes(q);
    const matchF = !franchise || t.franchiseName === franchise;
    const matchC = !compType || t.compositionType === compType;
    return matchQ && matchF && matchC;
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Reset page when filters change
  useEffect(() => { setPage(0); }, [query, franchise, compType]);

  const play = useCallback((track: MusicTrack, idx: number) => {
    setPlaying(track);
    setPlayingIdx(idx);
  }, []);

  const playNext = useCallback(() => {
    const next = playingIdx + 1;
    if (next < filtered.length) play(filtered[next]!, next);
  }, [playingIdx, filtered, play]);

  const playPrev = useCallback(() => {
    const prev = playingIdx - 1;
    if (prev >= 0) play(filtered[prev]!, prev);
  }, [playingIdx, filtered, play]);

  // Keep playingIdx in sync with filtered list when playing changes
  useEffect(() => {
    if (playing) {
      const i = filtered.findIndex(t => t.id === playing.id);
      setPlayingIdx(i);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, franchise, compType]);

  const withVideo = tracks.filter(t => t.youtubeId).length;

  return (
    <div className="min-h-screen bg-[#070718] text-slate-200 font-mono flex flex-col">

      {/* ── Header ── */}
      <div className="border-b border-cyan-500/10 px-6 md:px-12 py-5 flex items-center gap-4 shrink-0">
        <Link href="/" className="text-[10px] uppercase tracking-widest text-slate-600 hover:text-cyan-400 transition-colors">
          ← Início
        </Link>
        <div className="w-px h-4 bg-slate-700" />
        <Music2 className="w-5 h-5 text-amber-400 shrink-0" />
        <h1 className="text-lg font-bold tracking-widest text-cyan-300 uppercase">Músicas</h1>
        <span className="text-[10px] text-slate-600 uppercase tracking-widest">Super Smash Bros. Ultimate</span>
        <div className="flex-1" />
        <span className="text-[10px] text-slate-600">{withVideo} / {tracks.length} com vídeo</span>
      </div>

      {/* ── Filters ── */}
      <div className="border-b border-cyan-500/8 px-6 md:px-12 py-4 flex flex-col gap-3 shrink-0 bg-[#070718]">
        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar por título, arranjador, jogo..."
              className="w-full bg-transparent border border-cyan-500/15 pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-700 outline-none focus:border-cyan-500/40 rounded"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3 h-3 text-slate-600 hover:text-slate-300" />
              </button>
            )}
          </div>
          <span className="text-[10px] text-slate-600">{filtered.length} faixas</span>
          {totalPages > 1 && (
            <span className="text-[10px] text-slate-700">pág. {page + 1}/{totalPages}</span>
          )}
        </div>

        {/* compositionType pills */}
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setCompType(null)}
            className={`px-2.5 py-1 text-[10px] uppercase tracking-wider border rounded transition-colors ${
              !compType ? "border-cyan-500/50 text-cyan-300 bg-cyan-500/10" : "border-slate-700 text-slate-600 hover:text-slate-400"
            }`}
          >
            Todos
          </button>
          {compTypes.map(ct => (
            <button
              key={ct}
              onClick={() => setCompType(ct === compType ? null : ct)}
              className={`px-2.5 py-1 text-[10px] border rounded transition-colors ${
                compType === ct
                  ? compTypeClass(ct) + " border-opacity-100"
                  : "border-slate-700 text-slate-600 hover:text-slate-400"
              }`}
            >
              {ct}
            </button>
          ))}
        </div>

        {/* Franchise pills */}
        <div className="flex gap-1.5 flex-wrap max-h-16 overflow-y-auto">
          <button
            onClick={() => setFranchise(null)}
            className={`px-2.5 py-1 text-[10px] uppercase tracking-wider border rounded transition-colors shrink-0 ${
              !franchise ? "border-cyan-500/50 text-cyan-300 bg-cyan-500/10" : "border-slate-700 text-slate-600 hover:text-slate-400"
            }`}
          >
            Todas franquias
          </button>
          {franchises.map(f => {
            const icon = tracks.find(t => t.franchiseName === f)?.franchiseIcon;
            return (
              <button
                key={f}
                onClick={() => setFranchise(f === franchise ? null : f)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] border rounded transition-colors shrink-0 ${
                  franchise === f
                    ? "border-cyan-500/50 text-cyan-300 bg-cyan-500/10"
                    : "border-slate-700 text-slate-600 hover:text-slate-400"
                }`}
              >
                {icon && <Image src={icon} alt={f} width={12} height={12} className="w-3 h-3 object-contain opacity-70" />}
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Track list ── */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 py-4" style={{ paddingBottom: playing ? "120px" : "24px" }}>
        <div className="flex flex-col divide-y divide-cyan-500/5">
          {filtered.length === 0 && (
            <p className="text-slate-600 text-sm py-12 text-center">Nenhuma faixa encontrada.</p>
          )}
          {paginated.map((track, i) => {
            const i_global = page * PAGE_SIZE + i;
            const isPlaying = playing?.id === track.id;
            return (
              <button
                key={track.id}
                onClick={() => play(track, i_global)}
                disabled={!track.youtubeId}
                className={`flex items-center gap-4 py-3 px-2 rounded transition-colors text-left w-full group
                  ${isPlaying ? "bg-cyan-500/8 text-cyan-300" : "hover:bg-white/3 text-slate-300"}
                  ${!track.youtubeId ? "opacity-40 cursor-default" : "cursor-pointer"}
                `}
              >
                {/* Play icon / index */}
                <div className="w-8 shrink-0 flex items-center justify-center">
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-cyan-400" />
                  ) : track.youtubeId ? (
                    <Play className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  ) : (
                    <span className="text-[10px] text-slate-700">{i + 1}</span>
                  )}
                </div>

                {/* Franchise icon */}
                <div className="w-5 shrink-0">
                  {track.franchiseIcon && (
                    <Image src={track.franchiseIcon} alt={track.franchiseName} width={16} height={16} className="w-4 h-4 object-contain opacity-60" />
                  )}
                </div>

                {/* Title + source game */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate font-medium ${isPlaying ? "text-cyan-300" : "text-slate-200"}`}>
                    {track.title}
                  </p>
                  {track.sourceGame && (
                    <p className="text-[10px] text-slate-600 truncate">{track.sourceGame}</p>
                  )}
                </div>

                {/* Arranger */}
                {track.arranger && (
                  <p className="text-[10px] text-slate-600 hidden md:block truncate max-w-[180px] shrink-0">
                    {track.arranger}
                  </p>
                )}

                {/* compositionType */}
                {track.compositionType && (
                  <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 border rounded hidden lg:block shrink-0 ${compTypeClass(track.compositionType)}`}>
                    {track.compositionType}
                  </span>
                )}

                {/* Duration */}
                {track.duration && (
                  <span className="text-[10px] text-slate-600 w-10 text-right shrink-0">{track.duration}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-6">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 text-[10px] uppercase tracking-widest border border-slate-700 text-slate-500 hover:text-slate-300 disabled:opacity-30 rounded"
            >
              ← Anterior
            </button>
            <span className="text-[10px] text-slate-600">{page + 1} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 text-[10px] uppercase tracking-widest border border-slate-700 text-slate-500 hover:text-slate-300 disabled:opacity-30 rounded"
            >
              Próxima →
            </button>
          </div>
        )}
      </div>

      {/* ── Now Playing bar ── */}
      {playing && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#070718]/95 backdrop-blur border-t border-cyan-500/20 px-6 md:px-12 py-3 flex items-center gap-4">
          {/* Hidden YouTube iframe for audio */}
          <iframe
            ref={playerRef}
            key={playing.youtubeId!}
            src={`https://www.youtube.com/embed/${playing.youtubeId}?autoplay=1&mute=0&controls=0`}
            className="w-0 h-0 opacity-0 absolute"
            allow="autoplay; encrypted-media"
          />

          {/* Franchise icon */}
          {playing.franchiseIcon && (
            <Image src={playing.franchiseIcon} alt={playing.franchiseName} width={20} height={20} className="w-5 h-5 object-contain opacity-70 shrink-0" />
          )}

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-cyan-300 truncate">{playing.title}</p>
            <p className="text-[10px] text-slate-600 truncate">
              {playing.arranger ?? playing.franchiseName}
              {playing.duration ? ` · ${playing.duration}` : ""}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={playPrev} disabled={playingIdx <= 0} className="text-slate-500 hover:text-slate-300 disabled:opacity-30">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={playNext} disabled={playingIdx >= filtered.length - 1} className="text-slate-500 hover:text-slate-300 disabled:opacity-30">
              <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={() => setPlaying(null)} className="text-slate-600 hover:text-slate-400 ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
