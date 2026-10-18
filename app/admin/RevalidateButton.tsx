"use client";

import { useState } from "react";

/** Limpa o cache do site público (útil depois de editar dados por scripts, fora do painel). */
export default function RevalidateButton() {
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const run = async () => {
    setState("loading");
    try {
      const res = await fetch("/api/admin/revalidate", { method: "POST" });
      setState(res.ok ? "ok" : "error");
    } catch {
      setState("error");
    }
  };
  return (
    <button
      onClick={run}
      disabled={state === "loading"}
      className="mt-8 rounded border border-amber-500/40 px-4 py-2 text-sm text-amber-300 hover:bg-amber-500/10 disabled:opacity-50"
    >
      {state === "loading" ? "Atualizando…" : state === "ok" ? "Cache limpo ✓" : state === "error" ? "Falhou — tente de novo" : "Atualizar site agora (limpar cache)"}
    </button>
  );
}
