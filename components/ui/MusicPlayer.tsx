"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, Music2, Volume2 } from "lucide-react";

// ─── YouTube IFrame API types ──────────────────────────────────────────────────

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  setVolume(volume: number): void;
  getVolume(): number;
  unMute(): void;
  destroy(): void;
}

declare global {
  interface Window {
    YT: {
      Player: new (el: HTMLElement, opts: object) => YTPlayer;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number; BUFFERING: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// ─── Props ─────────────────────────────────────────────────────────────────────

export interface MusicTrack {
  youtubeId: string;
  title:     string;
  artist?:   string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MusicPlayer({ youtubeId, title, artist, autoPlay }: MusicTrack & { autoPlay?: boolean }) {
  const mountRef   = useRef<HTMLDivElement>(null);
  const playerRef  = useRef<YTPlayer | null>(null);
  const tickRef    = useRef<ReturnType<typeof setInterval> | null>(null);

  const [ready,       setReady]       = useState(false);
  const [playing,     setPlaying]     = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration,    setDuration]    = useState(0);
  const [volume,      setVolumeState] = useState(10);
  const [loading,     setLoading]     = useState(true);

  const setVolume = (v: number) => {
    setVolumeState(v);
    playerRef.current?.setVolume(v);
  };

  const stopTick = useCallback(() => {
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
  }, []);

  const startTick = useCallback(() => {
    stopTick();
    tickRef.current = setInterval(() => {
      setCurrentTime(playerRef.current?.getCurrentTime() ?? 0);
    }, 200);
  }, [stopTick]);

  useEffect(() => {
    let destroyed = false;

    const init = () => {
      if (destroyed || !mountRef.current) return;
      const div = document.createElement("div");
      mountRef.current.appendChild(div);

      const p = new window.YT.Player(div, {
        videoId: youtubeId,
        width:   "1",
        height:  "1",
        playerVars: { autoplay: autoPlay ? 1 : 0, mute: autoPlay ? 1 : 0, controls: 0, rel: 0, fs: 0, disablekb: 1, modestbranding: 1, iv_load_policy: 3 },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            if (destroyed) return;
            playerRef.current = e.target;
            setDuration(e.target.getDuration());
            setReady(true);
            setLoading(false);
            if (autoPlay) {
              // Inicia mutado (bypass de bloqueio do browser), depois desmuta com volume baixo
              e.target.playVideo();
              setTimeout(() => {
                if (!destroyed) { e.target.unMute(); e.target.setVolume(10); }
              }, 800);
            } else {
              e.target.setVolume(10);
            }
          },
          onStateChange: (e: { data: number }) => {
            if (destroyed) return;
            if (e.data === window.YT.PlayerState.PLAYING) {
              setPlaying(true);
              startTick();
            } else {
              setPlaying(false);
              stopTick();
              if (e.data === window.YT.PlayerState.ENDED) setCurrentTime(0);
            }
          },
        },
      });

      return p;
    };

    let player: YTPlayer | undefined;

    if (typeof window !== "undefined") {
      if (window.YT?.Player) {
        player = init();
      } else {
        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          prev?.();
          player = init();
        };
        if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
          const s    = document.createElement("script");
          s.src      = "https://www.youtube.com/iframe_api";
          s.async    = true;
          document.head.appendChild(s);
        }
      }
    }

    return () => {
      destroyed = true;
      stopTick();
      player?.destroy();
      playerRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeId]);

  const toggle = () => {
    if (!ready || !playerRef.current) return;
    playing ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ready || !playerRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const t    = pct * duration;
    playerRef.current.seekTo(t, true);
    setCurrentTime(t);
  };

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="shrink-0 px-4 pt-3 pb-3.5"
      style={{
        borderTop:  "1px solid rgba(64,180,255,0.07)",
        background: "linear-gradient(to bottom, rgba(10,8,32,0.95), rgba(5,5,20,0.98))",
      }}
    >
      {/* Hidden YT iframe mount point */}
      <div
        ref={mountRef}
        aria-hidden
        style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", opacity: 0, pointerEvents: "none" }}
      />

      {/* ── Header ── */}
      <div className="flex items-center gap-2 mb-2.5">
        <Music2 className="w-3 h-3 text-amber-400 shrink-0" strokeWidth={1.5} />
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-amber-400/80">
          Trilha Sonora
        </span>
        <div className="flex-1 h-px" style={{ background: "rgba(64,180,255,0.08)" }} />
        {loading && (
          <span className="font-mono text-[8px] text-slate-600 animate-pulse tracking-wide">
            carregando...
          </span>
        )}
      </div>

      {/* ── Controls ── */}
      <div className="flex items-center gap-3">

        {/* Play / Pause button — estilo HUD angular */}
        <button
          onClick={toggle}
          disabled={!ready}
          aria-label={playing ? "Pausar" : "Reproduzir"}
          className="relative shrink-0 w-9 h-9 flex items-center justify-center text-amber-400 transition-all duration-150 disabled:opacity-20 disabled:cursor-not-allowed group"
          style={{
            background: playing ? "rgba(251,191,36,0.12)" : "rgba(251,191,36,0.05)",
            border:     "1px solid rgba(251,191,36,0.35)",
            clipPath:   "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
          }}
        >
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: "rgba(251,191,36,0.08)" }} />
          {playing
            ? <Pause className="relative w-3.5 h-3.5 z-10" strokeWidth={2.5} />
            : <Play  className="relative w-3.5 h-3.5 z-10 ml-0.5" strokeWidth={2.5} />
          }
        </button>

        {/* Progress bar + time */}
        <div className="flex-1 flex flex-col gap-1.5">
          <div
            className="relative h-[3px] cursor-pointer group"
            style={{ background: "rgba(255,255,255,0.06)" }}
            onClick={seek}
            role="slider"
            aria-valuenow={Math.round(currentTime)}
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
          >
            {/* Track fill */}
            <div
              className="absolute inset-y-0 left-0 transition-none"
              style={{
                width:      `${progress}%`,
                background: "linear-gradient(to right, rgba(251,191,36,0.6), rgba(251,191,36,0.9))",
              }}
            />
            {/* Scrub thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{
                left:       `calc(${progress}% - 5px)`,
                background: "#fbbf24",
                clipPath:   "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              }}
            />
          </div>

          {/* Time stamps */}
          <div className="flex justify-between font-mono tabular-nums leading-none" style={{ fontSize: 9 }}>
            <span className="text-slate-500">{fmt(currentTime)}</span>
            <span className="text-slate-700">{duration > 0 ? fmt(duration) : "─ : ─ ─"}</span>
          </div>
        </div>

        {/* Volume slider */}
        <div className="w-24 flex items-center gap-2 shrink-0 pl-2">
          <Volume2 className="w-3 h-3 text-slate-500 shrink-0" strokeWidth={2} />
          <div
            className="relative flex-1 h-[3px] cursor-pointer group"
            style={{ background: "rgba(255,255,255,0.06)" }}
            onClick={(e) => {
              if (!ready || !playerRef.current) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              setVolume(Math.round(pct * 100));
            }}
            role="slider"
            aria-valuenow={volume}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="absolute inset-y-0 left-0 transition-none"
              style={{
                width: `${volume}%`,
                background: "rgba(148, 163, 184, 0.8)",
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{
                left: `calc(${volume}% - 4px)`,
                background: "#94a3b8",
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Track info ── */}
      <div className="mt-2.5 pl-12 flex flex-col gap-0.5">
        <p
          className="font-mono text-[13px] text-slate-200 truncate leading-tight tracking-wide"
          style={{ textShadow: "0 0 12px rgba(251,191,36,0.15)" }}
        >
          {title}
        </p>
        {artist && (
          <p className="font-mono text-[11px] text-slate-600 truncate leading-tight">{artist}</p>
        )}
      </div>
    </div>
  );
}
