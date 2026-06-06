"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Send, ChevronDown, ChevronUp } from "lucide-react";

interface Suggestion {
  id:         string;
  authorName: string;
  message:    string;
  createdAt:  string;
}

interface SuggestionPanelProps {
  fighterId: string;
  section:   string;
  label?:    string; // ex: "SSB64", "Melee", "Brawl"
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  <  1) return "agora";
  if (mins  < 60) return `${mins}min`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

export default function SuggestionPanel({ fighterId, section, label }: SuggestionPanelProps) {
  const [open,        setOpen]        = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [name,        setName]        = useState("");
  const [message,     setMessage]     = useState("");
  const [submitting,  setSubmitting]  = useState(false);
  const [sent,        setSent]        = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/suggestions?fighterId=${fighterId}&section=${encodeURIComponent(section)}`);
      if (res.ok) setSuggestions(await res.json());
    } finally {
      setLoading(false);
    }
  }, [fighterId, section]);

  useEffect(() => {
    if (open) fetchSuggestions();
  }, [open, fetchSuggestions]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/suggestions", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ fighterId, section, authorName: name, message }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Erro ao enviar."); return; }
      setSuggestions((prev) => [data, ...prev]);
      setName("");
      setMessage("");
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="border-t border-cyan-500/15 mt-1"
      style={{ background: "rgba(3,3,18,0.6)" }}
    >
      {/* Accordion header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 group hover:bg-cyan-500/5 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <MessageSquare className="h-4 w-4 text-cyan-600 group-hover:text-cyan-400 transition-colors" strokeWidth={1.5} />
          <span className="font-mono text-[12px] uppercase tracking-[0.25em] text-cyan-600 group-hover:text-cyan-400 transition-colors">
            Sugestões{label ? ` · ${label}` : ""}{suggestions.length > 0 ? ` (${suggestions.length})` : ""}
          </span>
        </div>
        {open
          ? <ChevronUp  className="h-4 w-4 text-cyan-600" />
          : <ChevronDown className="h-4 w-4 text-cyan-600" />}
      </button>

      {open && (
        <div className="px-6 pb-5 flex flex-col gap-4">

          {/* Existing suggestions */}
          {loading ? (
            <p className="font-mono text-[10px] text-cyan-900 italic">Carregando…</p>
          ) : suggestions.length > 0 ? (
            <div className="flex flex-col gap-2 max-h-52 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#0e3045_transparent]">
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  className="border border-white/5 px-3 py-2"
                  style={{ background: "rgba(8,8,32,0.7)" }}
                >
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-mono text-[12px] font-bold text-cyan-500 uppercase tracking-wider leading-none">
                      {s.authorName}
                    </span>
                    <span className="font-mono text-[10px] text-slate-600 leading-none">
                      {timeAgo(s.createdAt)}
                    </span>
                  </div>
                  <p className="font-mono text-[13px] text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                    {s.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-mono text-[10px] text-slate-700 italic">
              Nenhuma sugestão ainda. Seja o primeiro!
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                required
                className="flex-1 bg-[#060620] border border-cyan-500/15 px-3 py-2 font-mono text-[13px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/40 transition-colors"
              />
            </div>
            <textarea
              placeholder="Sua sugestão para esta seção…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
              required
              rows={3}
              className="bg-[#060620] border border-cyan-500/15 px-3 py-2 font-mono text-[13px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/40 transition-colors resize-none"
            />
            {error && (
              <p className="font-mono text-[10px] text-red-500">{error}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8px] text-slate-700">{message.length}/1000</span>
              <button
                type="submit"
                disabled={submitting || !name.trim() || !message.trim()}
                className="flex items-center gap-1.5 px-5 py-2 font-mono text-[12px] uppercase tracking-widest transition-all disabled:opacity-30"
                style={{
                  background:   submitting ? "rgba(6,182,212,0.1)" : sent ? "rgba(52,211,153,0.15)" : "rgba(6,182,212,0.12)",
                  border:       `1px solid ${sent ? "rgba(52,211,153,0.4)" : "rgba(6,182,212,0.25)"}`,
                  color:        sent ? "#34d399" : "#67e8f9",
                }}
              >
                {sent ? (
                  "Enviado!"
                ) : (
                  <>
                    <Send className="h-3 w-3" strokeWidth={1.5} />
                    {submitting ? "Enviando…" : "Enviar"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
