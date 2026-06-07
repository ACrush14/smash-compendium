"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Search, RefreshCw, CheckCircle2, XCircle, Eye, Save,
  AlertTriangle, ChevronLeft, ChevronRight, Trash2, Loader2
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Entry {
  id:              string;
  consoleName:     string;
  titleNtsc:       string;
  titlePal:        string | null;
  titleJp:         string | null;
  releaseDateNtsc: string | null;
  wikiUrl:         string | null;
  boxArtUrl:       string | null;
}

interface RowState {
  wikiUrl:    string;
  boxArtUrl:  string;
  preview:    string | null;       // URL sendo mostrada no preview
  candidates: string[];            // Candidatos retornados pelo fetch
  fetching:   boolean;
  saving:     boolean;
  saved:      boolean;
  error:      string | null;
}

type Filter = "all" | "missing_wiki" | "missing_art";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function statusBadge(entry: Entry) {
  if (!entry.wikiUrl && !entry.boxArtUrl)
    return <span className="text-[10px] font-mono px-1.5 py-0.5 bg-red-900/40 text-red-400 border border-red-800/40">SEM WIKI + ART</span>;
  if (!entry.boxArtUrl)
    return <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-900/40 text-amber-400 border border-amber-800/40">SEM CAPA</span>;
  if (!entry.wikiUrl)
    return <span className="text-[10px] font-mono px-1.5 py-0.5 bg-blue-900/40 text-blue-400 border border-blue-800/40">SEM WIKI</span>;
  return <span className="text-[10px] font-mono px-1.5 py-0.5 bg-green-900/40 text-green-400 border border-green-800/40">✓ OK</span>;
}

// ─── Row Component ────────────────────────────────────────────────────────────

function EntryRow({ entry, onSaved }: { entry: Entry; onSaved: (id: string, data: Partial<Entry>) => void }) {
  const [s, setS] = useState<RowState>({
    wikiUrl:    entry.wikiUrl    ?? "",
    boxArtUrl:  entry.boxArtUrl  ?? "",
    preview:    entry.boxArtUrl  ?? null,
    candidates: [],
    fetching:   false,
    saving:     false,
    saved:      false,
    error:      null,
  });

  const fetchPreview = useCallback(async (urlToFetch?: string) => {
    const target = urlToFetch ?? s.wikiUrl;
    if (!target) return;
    setS(p => ({ ...p, fetching: true, error: null, candidates: [] }));
    try {
      const res = await fetch("/api/admin/chronicles/fetch-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      });
      const data = await res.json();
      setS(p => ({
        ...p, fetching: false,
        preview:    data.imgUrl ?? null,
        candidates: data.candidates ?? [],
        boxArtUrl:  data.imgUrl ?? p.boxArtUrl,
        error:      data.error ?? (data.imgUrl ? null : "Nenhuma imagem encontrada"),
      }));
    } catch {
      setS(p => ({ ...p, fetching: false, error: "Erro de rede" }));
    }
  }, [s.wikiUrl]);

  const save = useCallback(async () => {
    setS(p => ({ ...p, saving: true, error: null }));
    try {
      const res = await fetch(`/api/admin/chronicles/${entry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wikiUrl: s.wikiUrl || null, boxArtUrl: s.boxArtUrl || null }),
      });
      const updated = await res.json();
      setS(p => ({ ...p, saving: false, saved: true, error: null }));
      onSaved(entry.id, { wikiUrl: updated.wikiUrl, boxArtUrl: updated.boxArtUrl });
      setTimeout(() => setS(p => ({ ...p, saved: false })), 2500);
    } catch {
      setS(p => ({ ...p, saving: false, error: "Erro ao salvar" }));
    }
  }, [entry.id, s.wikiUrl, s.boxArtUrl, onSaved]);

  const clearArt = useCallback(async () => {
    await fetch(`/api/admin/chronicles/${entry.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boxArtUrl: null }),
    });
    setS(p => ({ ...p, boxArtUrl: "", preview: null }));
    onSaved(entry.id, { boxArtUrl: null });
  }, [entry.id, onSaved]);

  const isDirty = s.wikiUrl !== (entry.wikiUrl ?? "") || s.boxArtUrl !== (entry.boxArtUrl ?? "");

  return (
    <div className={`border border-white/5 rounded p-3 flex flex-col gap-2 transition-all ${s.saved ? "border-green-600/40 bg-green-950/10" : isDirty ? "border-cyan-600/30 bg-cyan-950/10" : "bg-[#0a0a1a]"}`}>
      {/* Header row */}
      <div className="flex items-start gap-2">
        <span className="font-mono text-[10px] text-slate-500 min-w-[90px] pt-0.5">{entry.consoleName}</span>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-sm text-slate-100 truncate">{entry.titleNtsc}</p>
          {(entry.titleJp || entry.titlePal) && (
            <p className="font-mono text-[11px] text-slate-500 truncate">
              {[entry.titleJp, entry.titlePal].filter(Boolean).join(" · ")}
            </p>
          )}
          {entry.releaseDateNtsc && (
            <p className="font-mono text-[10px] text-slate-600">{entry.releaseDateNtsc}</p>
          )}
        </div>
        {statusBadge({ ...entry, wikiUrl: s.wikiUrl || null, boxArtUrl: s.boxArtUrl || null })}
      </div>

      {/* Edit fields */}
      <div className="grid grid-cols-1 gap-1.5">
        {/* Wiki URL */}
        <div className="flex gap-1">
          <input
            className="flex-1 bg-[#050510] border border-white/10 text-slate-200 font-mono text-[11px] px-2 py-1.5 focus:outline-none focus:border-cyan-500/50 placeholder:text-slate-600"
            placeholder="https://en.wikipedia.org/wiki/..."
            value={s.wikiUrl}
            onChange={e => setS(p => ({ ...p, wikiUrl: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && fetchPreview()}
          />
          <button
            onClick={() => fetchPreview()}
            disabled={!s.wikiUrl || s.fetching}
            title="Buscar capa desta URL"
            className="px-2 py-1.5 border border-white/10 text-cyan-500 hover:border-cyan-500/50 hover:bg-cyan-950/20 disabled:opacity-30 transition-all"
          >
            {s.fetching ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
          </button>
        </div>

        {/* BoxArt URL manual */}
        <div className="flex gap-1">
          <input
            className="flex-1 bg-[#050510] border border-white/10 text-slate-200 font-mono text-[11px] px-2 py-1.5 focus:outline-none focus:border-cyan-500/50 placeholder:text-slate-600"
            placeholder="URL da imagem (deixar vazio para auto-buscar)"
            value={s.boxArtUrl}
            onChange={e => setS(p => ({ ...p, boxArtUrl: e.target.value, preview: e.target.value || null }))}
          />
          {s.boxArtUrl && (
            <button onClick={clearArt} title="Limpar capa" className="px-2 py-1.5 border border-white/10 text-red-500 hover:border-red-500/50 hover:bg-red-950/20 transition-all">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Candidates (multiple options) */}
      {s.candidates.length > 1 && (
        <div className="flex gap-1.5 flex-wrap">
          <span className="font-mono text-[10px] text-slate-500 pt-1">Candidatos:</span>
          {s.candidates.map((c, i) => (
            <button
              key={i}
              onClick={() => setS(p => ({ ...p, preview: c, boxArtUrl: c }))}
              className={`relative border transition-all ${s.preview === c ? "border-cyan-500/60" : "border-white/10 hover:border-white/30"}`}
              title={c.split("/").pop()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c} alt="" style={{ height: 44, width: "auto", display: "block", maxWidth: 44, objectFit: "cover" }} />
              {s.preview === c && <span className="absolute inset-0 border-2 border-cyan-500/60 pointer-events-none" />}
            </button>
          ))}
        </div>
      )}

      {/* Preview + error + save */}
      <div className="flex items-end gap-2">
        {/* Image preview */}
        <div className="flex-shrink-0">
          {s.preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={s.preview}
              alt="preview"
              style={{ height: 56, width: "auto", maxWidth: 56, objectFit: "cover" }}
              className="border border-white/10"
              onError={() => setS(p => ({ ...p, error: "Imagem não carregou" }))}
            />
          ) : (
            <div className="w-10 h-14 bg-[#050510] border border-white/5 flex items-center justify-center">
              <span className="text-[8px] text-slate-700 font-mono text-center leading-tight">SEM<br/>CAPA</span>
            </div>
          )}
        </div>

        {/* Error */}
        {s.error && (
          <p className="flex-1 font-mono text-[10px] text-red-400 flex items-center gap-1">
            <AlertTriangle size={10} /> {s.error}
          </p>
        )}
        {s.saved && (
          <p className="flex-1 font-mono text-[10px] text-green-400 flex items-center gap-1">
            <CheckCircle2 size={10} /> Salvo
          </p>
        )}

        {/* Save button */}
        <button
          onClick={save}
          disabled={s.saving || (!isDirty && !s.saved)}
          className="ml-auto px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider border transition-all
            disabled:opacity-30 border-cyan-800/60 text-cyan-500 hover:bg-cyan-950/30 hover:border-cyan-500/60"
        >
          {s.saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminChroniclesPage() {
  const [entries, setEntries]     = useState<Entry[]>([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [filter, setFilter]       = useState<Filter>("missing_art");
  const [console_, setConsole_]   = useState("");
  const [q, setQ]                 = useState("");
  const [consoles, setConsoles]   = useState<string[]>([]);
  const [loading, setLoading]     = useState(false);
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const PER_PAGE = 50;
  const totalPages = Math.ceil(total / PER_PAGE);

  // Load consoles
  useEffect(() => {
    fetch("/api/admin/chronicles/consoles").then(r => r.json()).then(setConsoles);
  }, []);

  // Load entries
  const load = useCallback(async (pg = 1) => {
    setLoading(true);
    const params = new URLSearchParams({
      filter, page: String(pg), ...(console_ && { console: console_ }), ...(q && { q }),
    });
    const res  = await fetch(`/api/admin/chronicles?${params}`);
    const data = await res.json();
    setEntries(data.entries);
    setTotal(data.total);
    setLoading(false);
  }, [filter, console_, q]);

  // Debounced reload
  useEffect(() => {
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => { setPage(1); load(1); }, 300);
    return () => { if (searchRef.current) clearTimeout(searchRef.current); };
  }, [filter, console_, q, load]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    load(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaved = useCallback((id: string, data: Partial<Entry>) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
  }, []);

  const filterOptions: { value: Filter; label: string }[] = [
    { value: "all",          label: "Todos" },
    { value: "missing_art",  label: "Sem capa" },
    { value: "missing_wiki", label: "Sem wiki URL" },
  ];

  return (
    <div className="min-h-screen bg-[#060614] text-slate-100 font-mono">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#060614]/95 backdrop-blur border-b border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold uppercase tracking-widest text-cyan-400">Chronicles Admin</h1>
              <p className="text-[11px] text-slate-500">
                {total} entradas · página {page}/{totalPages || 1}
              </p>
            </div>
            <button onClick={() => load(page)} className="p-2 border border-white/10 hover:border-cyan-500/30 transition-all">
              <RefreshCw size={14} className={loading ? "animate-spin text-cyan-500" : "text-slate-400"} />
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {filterOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`px-3 py-1 text-[11px] uppercase tracking-wider border transition-all ${
                  filter === opt.value
                    ? "border-cyan-500/60 bg-cyan-950/30 text-cyan-400"
                    : "border-white/10 text-slate-500 hover:border-white/30"
                }`}
              >
                {opt.label}
              </button>
            ))}

            {/* Console filter */}
            <select
              value={console_}
              onChange={e => setConsole_(e.target.value)}
              className="bg-[#050510] border border-white/10 text-slate-400 text-[11px] px-2 py-1 focus:outline-none focus:border-cyan-500/30"
            >
              <option value="">Todos os consoles</option>
              {consoles.map(c => <option key={c} value={c}>{c}</option>)}
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

      {/* Entries */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        {loading && (
          <div className="flex items-center justify-center py-20 gap-2 text-slate-500">
            <Loader2 size={20} className="animate-spin" /> Carregando...
          </div>
        )}

        {!loading && entries.length === 0 && (
          <div className="flex items-center justify-center py-20 text-slate-500">
            <CheckCircle2 size={20} className="mr-2 text-green-500" />
            Nenhuma entrada neste filtro.
          </div>
        )}

        <div className="flex flex-col gap-2">
          {entries.map(entry => (
            <EntryRow key={entry.id} entry={entry} onSaved={handleSaved} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-2 border border-white/10 hover:border-white/30 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[12px] text-slate-400">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
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
