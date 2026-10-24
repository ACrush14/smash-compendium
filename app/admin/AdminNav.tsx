"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/admin",              label: "Início" },
  { href: "/admin/fighters",     label: "Lutadores" },
  { href: "/admin/collectibles", label: "Colecionáveis" },
  { href: "/admin/chronicles",   label: "Chronicles" },
  { href: "/admin/music",        label: "Músicas" },
  { href: "/admin/music-tracks", label: "Faixas" },
  { href: "/admin/timestamps",   label: "Timestamps" },
  { href: "/admin/create",       label: "Construtor" },
];

/** Barra fixa no topo de todas as páginas do admin: navegar, abrir o site, limpar o cache e sair. */
export default function AdminNav() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [cache, setCache] = useState<"idle" | "loading" | "ok" | "error">("idle");

  if (pathname.startsWith("/admin/login")) return null;

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(href + "/"));

  const clearCache = async () => {
    setCache("loading");
    try {
      const res = await fetch("/api/admin/revalidate", { method: "POST" });
      setCache(res.ok ? "ok" : "error");
    } catch {
      setCache("error");
    }
    setTimeout(() => setCache("idle"), 2500);
  };

  const logout = async () => {
    try { await fetch("/api/admin/auth", { method: "DELETE" }); } catch { /* sai mesmo assim */ }
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <nav
      aria-label="Navegação do admin"
      className="admin-nav sticky top-0 z-50 flex items-center gap-1 border-b border-white/10 bg-[#05050f]/95 px-3 backdrop-blur"
    >
      <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-1 [scrollbar-width:none]">
        {LINKS.map(l => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={isActive(l.href) ? "page" : undefined}
            className={`shrink-0 rounded px-2.5 py-1 font-mono text-[11px] transition-colors ${
              isActive(l.href)
                ? "bg-cyan-500/15 text-cyan-300"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <div className="flex shrink-0 items-center gap-1 pl-2">
        <button
          onClick={clearCache}
          disabled={cache === "loading"}
          title="Limpa o cache do site (útil depois de editar dados fora do painel)"
          className="rounded border border-amber-500/30 px-2 py-1 font-mono text-[11px] text-amber-300 hover:bg-amber-500/10 disabled:opacity-50"
        >
          {cache === "loading" ? "Limpando…" : cache === "ok" ? "Cache limpo ✓" : cache === "error" ? "Falhou" : "Limpar cache"}
        </button>
        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="rounded px-2 py-1 font-mono text-[11px] text-slate-400 hover:bg-white/5 hover:text-slate-100"
        >
          Ver site ↗
        </a>
        <button
          onClick={logout}
          className="rounded px-2 py-1 font-mono text-[11px] text-slate-400 hover:bg-red-500/10 hover:text-red-300"
        >
          Sair
        </button>
      </div>
    </nav>
  );
}
