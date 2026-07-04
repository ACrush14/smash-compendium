"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";

const DEBOUNCE_MS = 320;

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync input se o usuário navegar back/forward
  useEffect(() => {
    setValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  function pushQuery(raw: string) {
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = raw.trim();

    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setValue(next);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => pushQuery(next), DEBOUNCE_MS);
  }

  function handleClear() {
    setValue("");
    if (timerRef.current) clearTimeout(timerRef.current);
    pushQuery("");
  }

  // Cleanup on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <div className="relative min-w-0 flex-1 sm:max-w-xl sm:mx-auto">
      {/* Ícone esquerdo: spinner durante transição, lupa em repouso */}
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
        {isPending
          ? <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
          : <Search className="h-4 w-4" />
        }
      </div>

      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Buscar lutador, troféu, spirit…"
        aria-label="Buscar no acervo"
        className={[
          "w-full rounded-none border bg-slate-900/80 py-2 pl-9 pr-8",
          "text-sm text-slate-300 placeholder:text-slate-600",
          "focus:outline-none focus:ring-1 transition-all duration-200",
          isPending
            ? "border-amber-500/50 ring-amber-500/30"
            : "border-slate-700/60 focus:border-amber-500/50 focus:ring-amber-500/30",
        ].join(" ")}
      />

      {/* Botão de limpar */}
      {value && (
        <button
          onClick={handleClear}
          aria-label="Limpar busca"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
