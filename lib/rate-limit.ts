/**
 * Limite de requisições em memória (janela deslizante por chave, normalmente o IP).
 * Vale por instância do servidor: no PC local é exato; na Vercel cada instância conta separado,
 * então serve como freio contra abuso, não como garantia absoluta.
 */
const hits = new Map<string, number[]>();
let lastSweep = 0;

function sweep(now: number, windowMs: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  hits.forEach((list, key) => {
    const fresh = list.filter(t => now - t < windowMs);
    if (fresh.length) hits.set(key, fresh);
    else hits.delete(key);
  });
}

/** Registra uma tentativa e diz se ainda está dentro do limite. */
export function rateLimit(key: string, max: number, windowMs: number): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  sweep(now, windowMs);
  const list = (hits.get(key) ?? []).filter(t => now - t < windowMs);
  if (list.length >= max) {
    hits.set(key, list);
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((windowMs - (now - (list[0] ?? now))) / 1000)) };
  }
  list.push(now);
  hits.set(key, list);
  return { ok: true, retryAfterSec: 0 };
}

/** Só consulta (sem registrar) — usado para bloquear login depois de várias falhas. */
export function isLimited(key: string, max: number, windowMs: number): number {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter(t => now - t < windowMs);
  if (list.length < max) return 0;
  return Math.max(1, Math.ceil((windowMs - (now - (list[0] ?? now))) / 1000));
}

export function clearLimit(key: string) {
  hits.delete(key);
}

/** IP do cliente atrás do Cloudflare Tunnel ou da Vercel. */
export function clientIp(headers: Headers): string {
  return (
    headers.get("cf-connecting-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
