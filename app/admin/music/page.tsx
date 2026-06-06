"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle, RefreshCw, ChevronLeft, ChevronRight, Music2 } from "lucide-react";

interface FighterMusic {
  id:             string;
  name:           string;
  rosterNumber:   string;
  franchise:      string;
  musicYoutubeId: string | null;
  musicTitle:     string | null;
  musicArtist:    string | null;
  musicStatus:    string | null;
}

export default function AdminMusicPage() {
  const [fighters, setFighters]     = useState<FighterMusic[]>([]);
  const [idx, setIdx]               = useState(0);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [newId, setNewId]           = useState("");
  const [newTitle, setNewTitle]     = useState("");
  const [newArtist, setNewArtist]   = useState("");
  const [filter, setFilter]         = useState<"all" | "pending" | "approved">("all");

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch("/api/admin/music");
    const data = await res.json();
    setFighters(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const visible = fighters.filter((f) =>
    filter === "all"      ? true :
    filter === "pending"  ? f.musicStatus !== "approved" :
    f.musicStatus === "approved"
  );

  const current = visible[idx];

  useEffect(() => {
    if (current) {
      setNewId(current.musicYoutubeId ?? "");
      setNewTitle(current.musicTitle ?? "");
      setNewArtist(current.musicArtist ?? "");
    }
  }, [current]);

  const save = async (status: "approved" | "pending_review") => {
    if (!current) return;
    setSaving(true);
    await fetch(`/api/admin/music/${current.id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        musicYoutubeId: newId     || current.musicYoutubeId,
        musicTitle:     newTitle  || current.musicTitle,
        musicArtist:    newArtist || current.musicArtist,
        musicStatus:    status,
      }),
    });
    // Update local state
    setFighters((prev) =>
      prev.map((f) =>
        f.id === current.id
          ? { ...f, musicYoutubeId: newId || f.musicYoutubeId, musicTitle: newTitle || f.musicTitle, musicArtist: newArtist || f.musicArtist, musicStatus: status }
          : f
      )
    );
    setSaving(false);
    if (idx < visible.length - 1) setIdx((i) => i + 1);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "a" || e.key === "A") { save("approved"); }
      if (e.key === "ArrowRight") setIdx((i) => Math.min(i + 1, visible.length - 1));
      if (e.key === "ArrowLeft")  setIdx((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, newId, newTitle, newArtist, visible.length]);

  const approvedCount = fighters.filter((f) => f.musicStatus === "approved").length;
  const pendingCount  = fighters.filter((f) => f.musicStatus !== "approved" && f.musicYoutubeId).length;

  if (loading) return (
    <div className="min-h-screen bg-[#070718] flex items-center justify-center text-cyan-400 font-mono">
      Carregando…
    </div>
  );

  return (
    <div className="min-h-screen bg-[#070718] text-slate-200 font-mono">
      {/* ── Header ── */}
      <div className="border-b border-cyan-500/15 px-8 py-5 flex items-center gap-4">
        <Music2 className="text-amber-400 w-5 h-5" />
        <h1 className="text-lg font-bold tracking-widest text-cyan-300 uppercase">
          Admin — Music Review
        </h1>
        <div className="flex-1" />
        <div className="flex gap-4 text-[11px] text-slate-500">
          <span className="text-emerald-400 font-bold">{approvedCount} aprovados</span>
          <span className="text-amber-400">{pendingCount} pendentes</span>
          <span>{fighters.length} total</span>
        </div>
        {/* Filter tabs */}
        <div className="flex gap-1">
          {(["all", "pending", "approved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setIdx(0); }}
              className={`px-3 py-1 text-[10px] uppercase tracking-widest border transition-colors ${
                filter === f
                  ? "border-cyan-500/60 text-cyan-300 bg-cyan-500/10"
                  : "border-slate-700 text-slate-500 hover:text-slate-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">

        {/* ── Fighter list sidebar ── */}
        <div className="w-64 border-r border-cyan-500/10 overflow-y-auto shrink-0">
          {visible.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setIdx(i)}
              className={`w-full text-left px-4 py-3 border-b border-cyan-500/5 transition-colors flex items-center gap-2 ${
                i === idx ? "bg-cyan-500/10 text-cyan-300" : "hover:bg-white/3 text-slate-400"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  f.musicStatus === "approved" ? "bg-emerald-400" :
                  f.musicYoutubeId            ? "bg-amber-400" : "bg-red-500"
                }`}
              />
              <span className="text-[10px] text-slate-600 w-8 shrink-0">{f.rosterNumber}</span>
              <span className="text-[11px] truncate">{f.name}</span>
            </button>
          ))}
        </div>

        {/* ── Main editor ── */}
        <div className="flex-1 p-8 flex flex-col gap-6 overflow-y-auto">
          {!current ? (
            <div className="text-slate-600 text-center mt-20">Nenhum fighter nesta categoria.</div>
          ) : (
            <>
              {/* Fighter header */}
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-cyan-300">{current.name}</h2>
                  <p className="text-[11px] text-slate-500">{current.franchise} · #{current.rosterNumber}</p>
                </div>
                <div className="flex-1" />
                <span className={`text-[10px] px-2 py-1 border uppercase tracking-widest ${
                  current.musicStatus === "approved"
                    ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                    : "border-amber-500/50 text-amber-400 bg-amber-500/10"
                }`}>
                  {current.musicStatus ?? "sem música"}
                </span>
              </div>

              {/* YouTube player */}
              {(newId || current.musicYoutubeId) && (
                <div className="aspect-video w-full max-w-2xl bg-black border border-cyan-500/10">
                  <iframe
                    key={newId || current.musicYoutubeId!}
                    src={`https://www.youtube.com/embed/${newId || current.musicYoutubeId}?autoplay=1&mute=0`}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Edit fields */}
              <div className="flex flex-col gap-3 max-w-2xl">
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500">YouTube ID</span>
                  <input
                    value={newId}
                    onChange={(e) => setNewId(e.target.value.trim())}
                    placeholder={current.musicYoutubeId ?? "Cole o ID do YouTube aqui"}
                    className="bg-transparent border border-cyan-500/20 px-3 py-2 text-sm text-cyan-200 outline-none focus:border-cyan-500/50"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500">Título</span>
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={current.musicTitle ?? "Título da faixa"}
                    className="bg-transparent border border-cyan-500/20 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/50"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500">Artista / Compositor</span>
                  <input
                    value={newArtist}
                    onChange={(e) => setNewArtist(e.target.value)}
                    placeholder={current.musicArtist ?? "Compositor"}
                    className="bg-transparent border border-cyan-500/20 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/50"
                  />
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 max-w-2xl">
                <button
                  onClick={() => save("approved")}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/15 border border-emerald-500/50 text-emerald-400 text-[11px] uppercase tracking-widest hover:bg-emerald-500/25 transition-colors disabled:opacity-40"
                >
                  <CheckCircle className="w-4 h-4" />
                  Aprovar <kbd className="opacity-50 ml-1">[A]</kbd>
                </button>
                <button
                  onClick={() => save("pending_review")}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-500/10 border border-amber-500/40 text-amber-400 text-[11px] uppercase tracking-widest hover:bg-amber-500/20 transition-colors disabled:opacity-40"
                >
                  <RefreshCw className="w-4 h-4" />
                  Salvar &amp; Manter Pendente
                </button>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-4 text-slate-500 text-[11px] max-w-2xl">
                <button
                  onClick={() => setIdx((i) => Math.max(i - 1, 0))}
                  disabled={idx === 0}
                  className="flex items-center gap-1 hover:text-slate-300 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" /> Anterior <kbd className="opacity-50">[←]</kbd>
                </button>
                <span className="flex-1 text-center">{idx + 1} / {visible.length}</span>
                <button
                  onClick={() => setIdx((i) => Math.min(i + 1, visible.length - 1))}
                  disabled={idx >= visible.length - 1}
                  className="flex items-center gap-1 hover:text-slate-300 disabled:opacity-30"
                >
                  Próximo <kbd className="opacity-50">[→]</kbd> <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
