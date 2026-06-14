"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/admin/fighters";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push(from);
        router.refresh();
      } else {
        setError("Senha incorreta.");
        setPassword("");
      }
    } catch {
      setError("Erro ao conectar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-xs font-mono uppercase tracking-widest text-slate-400">
          Senha de Administrador
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••••••"
          autoFocus
          required
          className="w-full bg-slate-900 border border-vault-border rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-vault-accent transition-colors font-mono"
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm font-mono">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !password}
        className="w-full bg-vault-accent/20 hover:bg-vault-accent/30 border border-vault-accent text-vault-accent font-mono font-bold uppercase tracking-widest py-3 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-vault-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-vault-accent/10 border border-vault-accent/30 flex items-center justify-center mx-auto mb-4 text-3xl">
            ★
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-100 uppercase tracking-tight">
            Smash Compendium
          </h1>
          <p className="text-vault-muted text-sm font-mono mt-1">Admin</p>
        </div>

        <div className="bg-vault-surface border border-vault-border rounded-2xl p-6 shadow-xl">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
