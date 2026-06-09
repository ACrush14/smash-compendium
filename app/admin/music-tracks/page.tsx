"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Search, RefreshCw, Save, Trash2, Loader2, Music2,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ExternalLink,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Track {
  id:              string;
  title:           string;
  franchiseId:     string;
  franchiseName:   string;
  arranger:        string | null;
  isRemix:         boolean;
  youtubeId:       string | null;
  duration:        string | null;
  sourceGame:      string | null;
  compositionType: string | null;
  notes:           string | null;
}

interface Franchise {
  id:   string;
  name: string;
}

interface EditState {
  title:           string;
  arranger:        string;
  isRemix:         boolean;
  youtubeId:       string;
  duration:        string;
  sourceGame:      string;
  compositionType: string;
  notes:           string;
}

interface RowState {
  edit:    EditState;
  open:    boolean;
  saving:  boolean;
  deleting:boolean;
  saved:   boolean;
  error:   string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const COMPOSITION_TYPES = [
  "", "Original", "New Remix", "New Arrangement",
  "Melee Remix", "Brawl Remix", "SSB4 Remix", "Other Remix",
];

function compositionBadge(type: string | null) {
  if (!type) return null;
  const color = type === "Original"
    ? "bg-emerald-900/40 text-emerald-400 border-emerald-800/40"
    : "bg-purple-900/40 text-purple-400 border-purple-800/40";
  return (
    <span className={`text-[9px] font-mono px-1.5 py-0.5 border ${color}`}>
      {type}
    </span>
  );
}

function ytThumb(youtubeId: string | null) {
  if (!youtubeId) return null;
  return `https://img.youtube.com/vi/${youtubeId}/default.jpg`;
}

function toEdit(t: Track): EditState {
  return {
    title:           t.title,
    arranger:        t.arranger        ?? "",
    isRemix:         t.isRemix,
    youtubeId:       t.youtubeId       ?? "",
    duration:        t.duration        ?? "",
    sourceGame:      t.sourceGame      ?? "",
    compositionType: t.compositionType ?? "",
    notes:           t.notes           ?? "",
  };
}

// ─── TrackRow ─────────────────────────────────────────────────────────────────

function TrackRow({
  track,
  franchises,
  onUpdated,
  onDeleted,
}: {
  track:      Track;
  franchises: Franchise[];
  onUpdated:  (id: string, data: Partial<Track>) => void;
  onDeleted:  (id: string) => void;
}) {
  const [s, setS] = useState<RowState>({
    edit:     toEdit(track),
    open:     false,
    saving:   false,
    deleting: false,
    saved:    false,
    error:    null,
  });

  // Reset when track prop changes (e.g. after save patches parent)
  const prevId = useRef(track.id);
  useEffect(() => {
    if (prevId.current !== track.id) {
      setS(p => ({ ...p, edit: toEdit(track) }));
      prevId.current = track.id;
    }
  }, [track]);

  const set = (k: keyof EditState, v: string | boolean) =>
    setS(p => ({ ...p, edit: { ...p.edit, [k]: v } }));

  const isDirty = JSON.stringify(s.edit) !== JSON.stringify(toEdit(track));

  const save = useCallback(async () => {
    setS(p => ({ ...p, saving: true, error: null }));
    try {
      const res = await fetch(`/api/admin/music-tracks/${track.id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          title:           s.edit.title.trim() || undefined,
          arranger:        s.edit.arranger     || null,
          isRemix:         s.edit.isRemix,
          youtubeId:       s.edit.youtubeId    || null,
          duration:        s.edit.duration     || null,
          sourceGame:      s.edit.sourceGame   || null,
          compositionType: s.edit.compositionType || null,
          notes:           s.edit.notes        || null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Erro");
      const updated = await res.json() as Track;
      setS(p => ({ ...p, saving: false, saved: true, error: null, edit: toEdit(updated) }));
      onUpdated(track.id, updated);
      setTimeout(() => setS(p => ({ ...p, saved: false })), 2500);
    } catch (err) {
      setS(p => ({ ...p, saving: false, error: (err as Error).message }));
    }
  }, [track.id, s.edit, onUpdated]);

  const del = useCallback(async () => {
    if (!confirm(`Deletar "${track.title}"?`)) return;
    setS(p => ({ ...p, deleting: true, error: null }));
    try {
      const res = await fetch(`/api/admin/music-tracks/${track.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error ?? "Erro");
      onDeleted(track.id);
    } catch (err) {
      setS(p => ({ ...p, deleting: false, error: (err as Error).message }));
    }
  }, [track.id, track.title, onDeleted]);

  const thumb = ytThumb(s.edit.youtubeId || track.youtubeId);

  return (
    <div className={`border rounded transition-all ${
      s.saved   ? "border-green-600/40 bg-green-950/10" :
      isDirty   ? "border-cyan-600/30  bg-cyan-950/10"  :
                  "border-white/5 bg-[#0a0a1a]"
    }`}>
      {/* Collapsed header */}
      <button
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-white/2 transition-all"
        onClick={() => setS(p => ({ ...p, open: !p.open }))}
      >
        {/* Thumbnail */}
        <div className="flex-shrink-0 w-8 h-6 bg-black/40 border border-white/5 overflow-hidden">
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumb} alt="" className="w-full h-full object-cover opacity-80" />
          ) : (
            <Music2 size={10} className="m-auto mt-1 text-slate-600" />
          )}
        </div>

        {/* Title + franchise */}
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[12px] text-slate-100 truncate">{track.title}</p>
          <p className="font-mono text-[10px] text-slate-500 truncate">
            {track.franchiseName}
            {track.duration && <span className="ml-2 text-slate-600">{track.duration}</span>}
          </p>
        </div>

        {/* Composition badge */}
        <div className="flex-shrink-0">{compositionBadge(track.compositionType)}</div>

        {/* Expand icon */}
        <div className="flex-shrink-0 text-slate-600">
          {s.open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </div>
      </button>

      {/* Expanded edit form */}
      {s.open && (
        <div className="px-3 pb-3 border-t border-white/5 pt-3 space-y-2">

          {/* Title */}
          <div className="flex gap-1 items-center">
            <label className="font-mono text-[10px] text-slate-500 w-28 flex-shrink-0">Título</label>
            <input
              className="flex-1 bg-[#050510] border border-white/10 text-slate-200 font-mono text-[11px] px-2 py-1.5 focus:outline-none focus:border-cyan-500/50"
              value={s.edit.title}
              onChange={e => set("title", e.target.value)}
            />
          </div>

          {/* YouTube ID + preview */}
          <div className="flex gap-1 items-center">
            <label className="font-mono text-[10px] text-slate-500 w-28 flex-shrink-0">YouTube ID</label>
            <input
              className="flex-1 bg-[#050510] border border-white/10 text-slate-200 font-mono text-[11px] px-2 py-1.5 focus:outline-none focus:border-red-500/50"
              placeholder="dQw4w9WgXcQ"
              value={s.edit.youtubeId}
              onChange={e => set("youtubeId", e.target.value)}
            />
            {s.edit.youtubeId && (
              <a
                href={`https://www.youtube.com/watch?v=${s.edit.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 p-1.5 border border-white/10 text-red-500 hover:border-red-500/50 hover:bg-red-950/20 transition-all"
                title="Abrir no YouTube"
              >
                <ExternalLink size={13} />
              </a>
            )}
          </div>

          {/* Duration + sourceGame */}
          <div className="flex gap-2">
            <div className="flex gap-1 items-center flex-1">
              <label className="font-mono text-[10px] text-slate-500 w-28 flex-shrink-0">Duração</label>
              <input
                className="flex-1 bg-[#050510] border border-white/10 text-slate-200 font-mono text-[11px] px-2 py-1.5 focus:outline-none focus:border-cyan-500/50"
                placeholder="2:30"
                value={s.edit.duration}
                onChange={e => set("duration", e.target.value)}
              />
            </div>
            <div className="flex gap-1 items-center flex-1">
              <label className="font-mono text-[10px] text-slate-500 w-24 flex-shrink-0">Jogo Origem</label>
              <input
                className="flex-1 bg-[#050510] border border-white/10 text-slate-200 font-mono text-[11px] px-2 py-1.5 focus:outline-none focus:border-cyan-500/50"
                placeholder="Super Mario Bros."
                value={s.edit.sourceGame}
                onChange={e => set("sourceGame", e.target.value)}
              />
            </div>
          </div>

          {/* compositionType + isRemix */}
          <div className="flex gap-2 items-center">
            <label className="font-mono text-[10px] text-slate-500 w-28 flex-shrink-0">Tipo</label>
            <select
              className="flex-1 bg-[#050510] border border-white/10 text-slate-300 font-mono text-[11px] px-2 py-1.5 focus:outline-none focus:border-cyan-500/50"
              value={s.edit.compositionType}
              onChange={e => {
                const v = e.target.value;
                set("compositionType", v);
                set("isRemix", v !== "Original" && v !== "");
              }}
            >
              {COMPOSITION_TYPES.map(t => (
                <option key={t} value={t}>{t || "— selecionar —"}</option>
              ))}
            </select>
            <label className="flex items-center gap-1 cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={s.edit.isRemix}
                onChange={e => set("isRemix", e.target.checked)}
                className="accent-purple-500"
              />
              <span className="font-mono text-[10px] text-slate-400">Remix</span>
            </label>
          </div>

          {/* Arranger */}
          <div className="flex gap-1 items-center">
            <label className="font-mono text-[10px] text-slate-500 w-28 flex-shrink-0">Arranjador</label>
            <input
              className="flex-1 bg-[#050510] border border-white/10 text-slate-200 font-mono text-[11px] px-2 py-1.5 focus:outline-none focus:border-cyan-500/50"
              placeholder="Koji Kondo"
              value={s.edit.arranger}
              onChange={e => set("arranger", e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="flex gap-1 items-start">
            <label className="font-mono text-[10px] text-slate-500 w-28 flex-shrink-0 pt-1.5">Notas</label>
            <textarea
              className="flex-1 bg-[#050510] border border-white/10 text-slate-200 font-mono text-[11px] px-2 py-1.5 focus:outline-none focus:border-cyan-500/50 resize-y min-h-[56px]"
              placeholder="Créditos, supervisores, curiosidades..."
              value={s.edit.notes}
              onChange={e => set("notes", e.target.value)}
            />
          </div>

          {/* YouTube thumbnail preview */}
          {thumb && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-slate-600 w-28 flex-shrink-0">Preview</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumb}
                alt="yt thumb"
                className="h-12 w-auto border border-white/10"
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <span className="font-mono text-[10px] text-slate-600">{s.edit.youtubeId}</span>
            </div>
          )}

          {/* Error / status */}
          {s.error && (
            <p className="font-mono text-[10px] text-red-400">{s.error}</p>
          )}
          {s.saved && !isDirty && (
            <p className="font-mono text-[10px] text-green-400">✓ Salvo</p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={del}
              disabled={s.deleting}
              className="p-1.5 border border-white/10 text-red-500 hover:border-red-500/50 hover:bg-red-950/20 disabled:opacity-30 transition-all"
              title="Deletar faixa"
            >
              {s.deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
            </button>

            <button
              onClick={save}
              disabled={s.saving || !isDirty}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider border transition-all
                disabled:opacity-30 border-cyan-800/60 text-cyan-500 hover:bg-cyan-950/30 hover:border-cyan-500/60"
            >
              {s.saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              Salvar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminMusicTracksPage() {
  const [tracks,     setTracks]     = useState<Track[]>([]);
  const [total,      setTotal]      = useState(0);
  const [pages,      setPages]      = useState(1);
  const [page,       setPage]       = useState(1);
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [franchise,  setFranchise]  = useState("");
  const [compType,   setCompType]   = useState("");
  const [q,          setQ]          = useState("");
  const [loading,    setLoading]    = useState(false);

  const PER_PAGE = 50;
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load franchise list for filter
  useEffect(() => {
    fetch("/api/admin/franchises")
      .then(r => r.json())
      .then((data: Franchise[] | { franchises: Franchise[] }) => {
        setFranchises(Array.isArray(data) ? data : data.franchises ?? []);
      })
      .catch(() => {/* ignore */});
  }, []);

  const load = useCallback(async (pg = 1) => {
    setLoading(true);
    const params = new URLSearchParams({
      page:  String(pg),
      limit: String(PER_PAGE),
      ...(franchise && { franchise }),
      ...(compType  && { compositionType: compType }),
      ...(q         && { q }),
    });
    try {
      const res  = await fetch(`/api/admin/music-tracks?${params}`);
      const data = await res.json() as { tracks: Track[]; total: number; pages: number };
      setTracks(data.tracks ?? []);
      setTotal(data.total  ?? 0);
      setPages(data.pages  ?? 1);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [franchise, compType, q]);

  // Debounced reload on filter change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setPage(1); load(1); }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [franchise, compType, q, load]);

  const handlePage = (pg: number) => {
    setPage(pg);
    load(pg);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdated = useCallback((id: string, data: Partial<Track>) => {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  }, []);

  const handleDeleted = useCallback((id: string) => {
    setTracks(prev => prev.filter(t => t.id !== id));
    setTotal(prev => prev - 1);
  }, []);

  return (
    <div className="min-h-screen bg-[#060614] text-slate-100 font-mono">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#060614]/95 backdrop-blur border-b border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold uppercase tracking-widest text-cyan-400">
                Music Tracks Admin
              </h1>
              <p className="text-[11px] text-slate-500">
                {total} faixas · página {page}/{pages || 1}
              </p>
            </div>
            <button
              onClick={() => load(page)}
              className="p-2 border border-white/10 hover:border-cyan-500/30 transition-all"
            >
              <RefreshCw size={14} className={loading ? "animate-spin text-cyan-500" : "text-slate-400"} />
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {/* Franchise */}
            <select
              value={franchise}
              onChange={e => setFranchise(e.target.value)}
              className="bg-[#050510] border border-white/10 text-slate-400 text-[11px] px-2 py-1 focus:outline-none focus:border-cyan-500/30"
            >
              <option value="">Todas as franquias</option>
              {franchises.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>

            {/* Composition type */}
            <select
              value={compType}
              onChange={e => setCompType(e.target.value)}
              className="bg-[#050510] border border-white/10 text-slate-400 text-[11px] px-2 py-1 focus:outline-none focus:border-cyan-500/30"
            >
              <option value="">Todos os tipos</option>
              {COMPOSITION_TYPES.filter(Boolean).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Search */}
            <div className="flex items-center gap-1 border border-white/10 px-2 bg-[#050510] flex-1 min-w-[160px]">
              <Search size={12} className="text-slate-600" />
              <input
                className="bg-transparent text-[11px] text-slate-300 placeholder:text-slate-600 focus:outline-none py-1 w-full"
                placeholder="Buscar título..."
                value={q}
                onChange={e => setQ(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tracks list */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        {loading && (
          <div className="flex items-center justify-center py-20 gap-2 text-slate-500">
            <Loader2 size={20} className="animate-spin" /> Carregando...
          </div>
        )}

        {!loading && tracks.length === 0 && (
          <div className="flex items-center justify-center py-20 text-slate-500">
            <Music2 size={20} className="mr-2 text-slate-600" />
            Nenhuma faixa encontrada.
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          {tracks.map(track => (
            <TrackRow
              key={track.id}
              track={track}
              franchises={franchises}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
            />
          ))}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => handlePage(page - 1)}
              disabled={page <= 1}
              className="p-2 border border-white/10 hover:border-white/30 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[12px] text-slate-400">{page} / {pages}</span>
            <button
              onClick={() => handlePage(page + 1)}
              disabled={page >= pages}
              className="p-2 border border-white/10 hover:border-white/30 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
