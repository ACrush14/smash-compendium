"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Music2, Volume2, ChevronDown, AlertTriangle } from "lucide-react";

/** Tipo legado usado pela página do lutador (campo `music`); o player do site usa `AudioSource`. */
export interface MusicTrack {
  youtubeId: string;
  title:     string;
  artist?:   string;
}

export interface AudioSource {
  src:  string;
  type: string;
}

interface Props {
  title:     string;
  artist?:   string;
  sources:   AudioSource[];
  loop?:     boolean;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const fmt = (s: number) => {
  if (!isFinite(s) || s <= 0) return "0:00";
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
    : `${m}:${String(sec).padStart(2, "0")}`;
};

/**
 * Player de áudio do site. O <audio> fica sempre montado (mesmo recolhido) e pré-carrega o arquivo,
 * mas só toca quando a pessoa aperta play — nenhum áudio automático.
 */
export default function MusicPlayer({ title, artist, sources, loop, collapsed, onToggleCollapse }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying]   = useState(false);
  const [current, setCurrent]   = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume]     = useState(10);
  const [ready, setReady]       = useState(false);
  const [failed, setFailed]     = useState(false);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  // O áudio pode terminar de carregar antes da hidratação (eventos perdidos): sincroniza o estado ao montar.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.readyState >= 1 && isFinite(a.duration)) setDuration(a.duration);
    if (a.readyState >= 3) setReady(true);
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a || failed) return;
    if (a.paused) a.play().catch(() => setPlaying(false));
    else a.pause();
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    a.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * duration;
  };

  const pct = duration > 0 ? (current / duration) * 100 : 0;

  const playButton = (size: string) => (
    <button
      onClick={toggle}
      disabled={!ready || failed}
      aria-label={playing ? "Pausar música" : "Tocar música"}
      className={`relative shrink-0 ${size} flex items-center justify-center text-amber-400 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed`}
      style={{
        background: playing ? "rgba(251,191,36,0.14)" : "rgba(251,191,36,0.06)",
        border:     "1px solid rgba(251,191,36,0.4)",
        clipPath:   "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
      }}
    >
      {playing ? <Pause className="w-4 h-4" strokeWidth={2.5} /> : <Play className="w-4 h-4 ml-0.5" strokeWidth={2.5} />}
    </button>
  );

  return (
    <>
      <audio
        ref={audioRef}
        preload="auto"
        loop={loop}
        onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
        onCanPlay={() => { setReady(true); setFailed(false); }}
        onTimeUpdate={e => setCurrent(e.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      >
        {sources.map(s => (
          <source key={s.src} src={s.src} type={s.type}
            onError={e => {
              // o erro só é definitivo quando a ÚLTIMA fonte falha
              if (e.currentTarget === e.currentTarget.parentElement?.lastElementChild) setFailed(true);
            }} />
        ))}
      </audio>

      {collapsed ? (
        /* ── Modo recolhido: só uma pílula pequena no canto ── */
        <div
          className="fixed bottom-3 right-3 z-50 flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-[#050514]/95 p-1.5 shadow-lg backdrop-blur"
        >
          {playButton("h-11 w-11")}
          <button
            onClick={onToggleCollapse}
            aria-label="Mostrar player de música"
            title={title}
            className="flex h-11 w-11 items-center justify-center text-amber-400/80 hover:text-amber-300"
          >
            <Music2 className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>
      ) : (
        /* ── Modo completo ── */
        <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-2xl">
          <div
            className="px-4 pt-3 pb-3.5"
            style={{ borderTop: "1px solid rgba(64,180,255,0.07)", background: "linear-gradient(to bottom, rgba(10,8,32,0.97), rgba(5,5,20,0.99))" }}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <Music2 className="w-3 h-3 text-amber-400 shrink-0" strokeWidth={1.5} />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-amber-400/80">Soundtrack</span>
              <div className="flex-1 h-px" style={{ background: "rgba(64,180,255,0.08)" }} />
              {!ready && !failed && <span className="font-mono text-[10px] text-slate-500 animate-pulse">carregando…</span>}
              <button
                onClick={onToggleCollapse}
                aria-label="Recolher player de música"
                className="flex h-8 w-8 items-center justify-center text-slate-400 hover:text-amber-300"
              >
                <ChevronDown className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>

            {failed ? (
              <p className="flex items-center gap-2 font-mono text-[11px] text-amber-300/80">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Áudio não encontrado. Coloque o arquivo em <code>public/audio/trophy-gallery.mp3</code>.
              </p>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  {playButton("h-11 w-11")}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div
                      className="relative h-2 cursor-pointer group flex items-center"
                      onClick={seek}
                      role="slider"
                      aria-label="Posição da música"
                      aria-valuenow={Math.round(current)}
                      aria-valuemin={0}
                      aria-valuemax={Math.round(duration)}
                    >
                      <div className="absolute inset-x-0 h-[3px]" style={{ background: "rgba(255,255,255,0.08)" }} />
                      <div className="absolute left-0 h-[3px]" style={{ width: `${pct}%`, background: "linear-gradient(to right, rgba(251,191,36,0.6), rgba(251,191,36,0.95))" }} />
                    </div>
                    <div className="flex justify-between font-mono tabular-nums leading-none text-[10px]">
                      <span className="text-slate-500">{fmt(current)}</span>
                      <span className="text-slate-600">{duration > 0 ? fmt(duration) : "–:––"}</span>
                    </div>
                  </div>
                  {/* Volume: escondido no celular (o sistema controla o volume) */}
                  <div className="hidden sm:flex w-24 items-center gap-2 shrink-0 pl-2">
                    <Volume2 className="w-3.5 h-3.5 text-slate-500 shrink-0" strokeWidth={2} />
                    <input
                      type="range" min={0} max={100} value={volume}
                      onChange={e => setVolume(Number(e.target.value))}
                      aria-label="Volume"
                      className="w-full accent-amber-400"
                    />
                  </div>
                </div>
                <div className="mt-2.5 pl-14 flex flex-col gap-0.5">
                  <p className="font-mono text-[13px] text-slate-200 truncate leading-tight tracking-wide">{title}</p>
                  {artist && <p className="font-mono text-[11px] text-slate-500 truncate leading-tight">{artist}</p>}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
