"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Send } from "lucide-react";
import { t, type UILang } from "@/lib/ui-i18n";

interface Suggestion {
  id:         string;
  authorName: string;
  message:    string;
  createdAt:  string;
}

interface SuggestionPanelProps {
  fighterId: string;
  section:   string;
  lang?:     UILang;
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

export default function SuggestionPanel({ fighterId, section, lang = "EN" }: SuggestionPanelProps) {
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
    fetchSuggestions();
  }, [fetchSuggestions]);

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
      if (!res.ok) { setError(data.error ?? t(lang, "errorSend")); return; }
      setSuggestions((prev) => [data, ...prev]);
      setName("");
      setMessage("");
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch {
      setError(t(lang, "errorConnection"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="border-t border-cyan-500/15 mt-8"
      style={{ background: "rgba(3,3,18,0.6)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-cyan-500/10">
        <MessageSquare className="h-4 w-4 text-cyan-600" strokeWidth={1.5} />
        <span className="font-mono text-[12px] uppercase tracking-[0.25em] text-cyan-600">
          {t(lang, "suggestions")}{suggestions.length > 0 ? ` (${suggestions.length})` : ""}
        </span>
      </div>

      <div className="px-6 py-5 flex flex-col gap-4">

        {/* Existing suggestions */}
        {loading ? (
          <p className="font-mono text-[10px] text-cyan-900 italic">{t(lang, "loading")}</p>
        ) : suggestions.length > 0 ? (
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#0e3045_transparent]">
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
            {t(lang, "noSuggestions")}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder={t(lang, "namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            required
            className="bg-[#060620] border border-cyan-500/15 px-3 py-2 font-mono text-[13px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/40 transition-colors"
          />
          <textarea
            placeholder={t(lang, "suggestionPlaceholder")}
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
                t(lang, "sent")
              ) : (
                <>
                  <Send className="h-3 w-3" strokeWidth={1.5} />
                  {submitting ? t(lang, "sending") : t(lang, "send")}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
