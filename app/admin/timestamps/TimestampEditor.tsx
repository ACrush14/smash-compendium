'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface Entry {
  id: string;
  name: string;
  position: number | null;
  videoStartSec: number | null;
  videoEndSec: number | null;
  type: 'collectible' | 'fighterBio';
}

interface Tab {
  key: string;
  label: string;
  videoSrc: string;
  entries: Entry[];
}

function fmt(s: number | null): string {
  if (s == null) return '—';
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

function dur(start: number | null, end: number | null): string {
  if (start == null || end == null) return '—';
  return `${end - start}s`;
}

export default function TimestampEditor({ tabs }: { tabs: Tab[] }) {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState<'all' | 'with' | 'without'>('all');
  const [edits, setEdits]         = useState<Record<string, { start: string; end: string }>>({});
  const [saving, setSaving]       = useState<Record<string, boolean>>({});
  const [saved,  setSaved]        = useState<Record<string, boolean>>({});
  const [preview, setPreview]     = useState<{ src: string; start: number; end: number; name: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const tab = tabs[activeTab]!;

  // Reset edits when tab changes
  useEffect(() => {
    setEdits({});
    setSaved({});
    setSearch('');
  }, [activeTab]);

  // Seek video when preview changes
  useEffect(() => {
    if (!preview || !videoRef.current) return;
    const v = videoRef.current;
    v.src = preview.src;
    v.load();
    const onLoaded = () => { v.currentTime = preview.start; v.play().catch(() => {}); };
    v.addEventListener('loadedmetadata', onLoaded, { once: true });
    return () => v.removeEventListener('loadedmetadata', onLoaded);
  }, [preview]);

  // Stop at end
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !preview) return;
    const check = () => { if (v.currentTime >= preview.end) { v.pause(); v.currentTime = preview.start; } };
    v.addEventListener('timeupdate', check);
    return () => v.removeEventListener('timeupdate', check);
  }, [preview]);

  const getEdit = (id: string, field: 'start' | 'end', fallback: number | null) => {
    if (edits[id]?.[field] !== undefined) return edits[id]![field];
    return fallback == null ? '' : String(fallback);
  };

  const setEdit = (id: string, field: 'start' | 'end', val: string) => {
    setEdits(prev => ({ ...prev, [id]: { start: getEdit(id, 'start', null), end: getEdit(id, 'end', null), ...prev[id], [field]: val } }));
    setSaved(prev => ({ ...prev, [id]: false }));
  };

  const isDirty = (entry: Entry) => {
    if (!edits[entry.id]) return false;
    const e = edits[entry.id]!;
    const origStart = entry.videoStartSec == null ? '' : String(entry.videoStartSec);
    const origEnd   = entry.videoEndSec   == null ? '' : String(entry.videoEndSec);
    return (e.start !== undefined && e.start !== origStart) || (e.end !== undefined && e.end !== origEnd);
  };

  const handleSave = useCallback(async (entry: Entry) => {
    const e = edits[entry.id];
    const startVal = e?.start !== undefined ? e.start : String(entry.videoStartSec ?? '');
    const endVal   = e?.end   !== undefined ? e.end   : String(entry.videoEndSec   ?? '');
    const start = startVal === '' ? null : parseInt(startVal, 10);
    const end   = endVal   === '' ? null : parseInt(endVal,   10);

    setSaving(prev => ({ ...prev, [entry.id]: true }));
    try {
      await fetch('/api/admin/update-timestamp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: entry.type, id: entry.id, videoStartSec: start, videoEndSec: end }),
      });
      entry.videoStartSec = start;
      entry.videoEndSec   = end;
      setSaved(prev => ({ ...prev, [entry.id]: true }));
      setEdits(prev => { const n = { ...prev }; delete n[entry.id]; return n; });
    } finally {
      setSaving(prev => ({ ...prev, [entry.id]: false }));
    }
  }, [edits]);

  const handlePreview = (entry: Entry) => {
    const startRaw = edits[entry.id]?.start;
    const endRaw   = edits[entry.id]?.end;
    const start = startRaw !== undefined ? parseInt(startRaw) : (entry.videoStartSec ?? 0);
    const end   = endRaw   !== undefined ? parseInt(endRaw)   : (entry.videoEndSec   ?? start + 15);
    setPreview({ src: tab.videoSrc, start, end, name: entry.name });
  };

  const filtered = tab.entries.filter(e => {
    const matchName = e.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ? true :
      filter === 'with' ? (e.videoStartSec != null) :
      (e.videoStartSec == null);
    return matchName && matchFilter;
  });

  const withTs    = tab.entries.filter(e => e.videoStartSec != null).length;
  const total     = tab.entries.length;

  return (
    <div className="flex h-screen bg-[#0a0a1a] text-white overflow-hidden">
      {/* ── Left panel: table ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Tab bar */}
        <div className="flex gap-1 px-4 pt-4 pb-0 flex-wrap border-b border-white/10">
          {tabs.map((t, i) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(i)}
              className={`px-3 py-2 text-xs font-mono rounded-t transition-colors ${
                i === activeTab
                  ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 border-b-transparent'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-[#0d0d22]">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome..."
            className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-cyan-500/50"
          />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as 'all' | 'with' | 'without')}
            className="bg-white/5 border border-white/10 rounded px-2 py-1.5 text-sm focus:outline-none"
          >
            <option value="all">Todos ({total})</option>
            <option value="with">Com timestamp ({withTs})</option>
            <option value="without">Sem timestamp ({total - withTs})</option>
          </select>
          <span className="text-xs text-white/40 whitespace-nowrap">{filtered.length} exibidos</span>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 z-10 bg-[#0d0d22] border-b border-white/10">
              <tr>
                <th className="text-left px-3 py-2 text-xs text-white/40 font-mono w-12">#</th>
                <th className="text-left px-3 py-2 text-xs text-white/40 font-mono">Nome</th>
                <th className="text-center px-2 py-2 text-xs text-white/40 font-mono w-24">Início (s)</th>
                <th className="text-center px-2 py-2 text-xs text-white/40 font-mono w-24">Fim (s)</th>
                <th className="text-center px-2 py-2 text-xs text-white/40 font-mono w-20">Dur.</th>
                <th className="text-center px-2 py-2 text-xs text-white/40 font-mono w-20">MM:SS</th>
                <th className="text-right px-3 py-2 text-xs text-white/40 font-mono w-28">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, idx) => {
                const startStr = getEdit(entry.id, 'start', entry.videoStartSec);
                const endStr   = getEdit(entry.id, 'end',   entry.videoEndSec);
                const startNum = startStr === '' ? null : parseInt(startStr, 10);
                const endNum   = endStr   === '' ? null : parseInt(endStr,   10);
                const dirty    = isDirty(entry);
                const isSaving = saving[entry.id];
                const wasSaved = saved[entry.id];

                return (
                  <tr
                    key={entry.id}
                    className={`border-b border-white/5 transition-colors ${
                      dirty ? 'bg-yellow-900/10' :
                      wasSaved ? 'bg-green-900/10' :
                      idx % 2 === 0 ? 'bg-white/[0.02]' : ''
                    } hover:bg-white/5`}
                  >
                    <td className="px-3 py-1.5 text-white/30 font-mono text-xs">
                      {entry.position ?? '—'}
                    </td>
                    <td className="px-3 py-1.5 font-medium max-w-xs">
                      <span className="truncate block" title={entry.name}>{entry.name}</span>
                    </td>
                    <td className="px-2 py-1">
                      <input
                        type="number"
                        value={startStr}
                        onChange={e => setEdit(entry.id, 'start', e.target.value)}
                        placeholder="—"
                        className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-center font-mono focus:outline-none focus:border-cyan-500/50"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <input
                        type="number"
                        value={endStr}
                        onChange={e => setEdit(entry.id, 'end', e.target.value)}
                        placeholder="—"
                        className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-center font-mono focus:outline-none focus:border-cyan-500/50"
                      />
                    </td>
                    <td className="px-2 py-1.5 text-center text-xs font-mono text-white/50">
                      {dur(startNum, endNum)}
                    </td>
                    <td className="px-2 py-1.5 text-center text-xs font-mono text-cyan-400/70">
                      {fmt(startNum)}
                    </td>
                    <td className="px-3 py-1 text-right">
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => handlePreview(entry)}
                          title="Pré-visualizar no vídeo"
                          className="px-2 py-1 text-xs bg-white/10 hover:bg-cyan-500/20 rounded transition-colors"
                        >
                          ▶
                        </button>
                        <button
                          onClick={() => handleSave(entry)}
                          disabled={isSaving}
                          title="Salvar"
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            isSaving ? 'opacity-50 cursor-wait bg-white/10' :
                            wasSaved && !dirty ? 'bg-green-600/30 text-green-300' :
                            dirty ? 'bg-cyan-600/40 hover:bg-cyan-500/50 text-cyan-200' :
                            'bg-white/10 hover:bg-white/20 text-white/60'
                          }`}
                        >
                          {isSaving ? '…' : wasSaved && !dirty ? '✓' : '💾'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-white/30 text-sm">
                    Nenhum resultado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Right panel: video preview ── */}
      <div className="w-80 flex-shrink-0 flex flex-col border-l border-white/10 bg-[#0d0d22]">
        <div className="px-4 py-3 border-b border-white/10">
          <p className="text-xs font-mono text-white/40 uppercase tracking-widest">Preview</p>
          {preview && (
            <p className="text-sm font-medium mt-1 text-cyan-300 truncate" title={preview.name}>
              {preview.name}
            </p>
          )}
        </div>

        <div className="flex-1 flex flex-col gap-3 p-4">
          {preview ? (
            <>
              <div className="aspect-video bg-black rounded-lg overflow-hidden border border-white/10">
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  controls
                  playsInline
                  preload="metadata"
                />
              </div>
              <div className="text-xs font-mono text-white/50 space-y-1">
                <div className="flex justify-between">
                  <span>Início:</span>
                  <span className="text-cyan-400">{preview.start}s ({fmt(preview.start)})</span>
                </div>
                <div className="flex justify-between">
                  <span>Fim:</span>
                  <span className="text-cyan-400">{preview.end}s ({fmt(preview.end)})</span>
                </div>
                <div className="flex justify-between">
                  <span>Duração:</span>
                  <span className="text-cyan-400">{preview.end - preview.start}s</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-3">
                <p className="text-xs text-white/30 mb-2">Ir para segundo:</p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Segundo..."
                    className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-cyan-500/50"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && videoRef.current) {
                        videoRef.current.currentTime = parseInt((e.target as HTMLInputElement).value, 10);
                        videoRef.current.play().catch(() => {});
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.querySelector<HTMLInputElement>('input[placeholder="Segundo..."]');
                      if (input && videoRef.current) {
                        videoRef.current.currentTime = parseInt(input.value, 10);
                        videoRef.current.play().catch(() => {});
                      }
                    }}
                    className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors"
                  >
                    Ir
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xs text-white/20 text-center">
                Clique em ▶ em uma linha<br />para pré-visualizar o vídeo
              </p>
            </div>
          )}
        </div>

        {/* Keyboard shortcut hints */}
        <div className="px-4 py-3 border-t border-white/10 text-xs text-white/20 space-y-1">
          <p>• Edite os segundos diretamente</p>
          <p>• ▶ mostra o clipe no vídeo</p>
          <p>• 💾 salva no banco de dados</p>
          <p>• "Ir para segundo" navega no vídeo</p>
        </div>
      </div>
    </div>
  );
}
