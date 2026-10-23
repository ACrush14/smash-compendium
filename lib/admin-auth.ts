/**
 * Autenticação do admin (usada no middleware/Edge e na rota de login — por isso só Web Crypto, sem Node).
 *
 * - A senha vem de ADMIN_PASSWORD. Em PRODUÇÃO não existe senha padrão: sem a variável, o admin fica trancado.
 * - O cookie guarda um token assinado (HMAC-SHA256) com data de validade, nunca a senha em si.
 *   Trocar ADMIN_PASSWORD invalida todas as sessões abertas.
 */
export const ADMIN_COOKIE = "smash_admin";

/** Validade da sessão de admin. */
export const SESSION_SECONDS = 60 * 60 * 24 * 7; // 7 dias

/** Senha configurada, ou null quando o admin deve ficar trancado. */
export function getAdminPassword(): string | null {
  const fromEnv = process.env.ADMIN_PASSWORD;
  if (fromEnv && fromEnv.length >= 8) return fromEnv;
  // Só em desenvolvimento local (next dev) há uma senha de conveniência.
  return process.env.NODE_ENV === "production" ? null : "dev-only-admin-password";
}

async function hmacHex(key: string, text: string): Promise<string> {
  const enc = new TextEncoder();
  const k = await crypto.subtle.importKey("raw", enc.encode(`smash-admin-v2:${key}`), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", k, enc.encode(text));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, "0")).join("");
}

/** Cria o token da sessão (`<expira em segundos>.<assinatura>`); null se o admin está trancado. */
export async function createAdminToken(): Promise<string | null> {
  const pw = getAdminPassword();
  if (!pw) return null;
  const exp = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  return `${exp}.${await hmacHex(pw, String(exp))}`;
}

/** Confere assinatura e validade do token. */
export async function verifyAdminToken(token: string): Promise<boolean> {
  const pw = getAdminPassword();
  if (!pw || !token) return false;
  const [expStr, sig] = token.split(".");
  const exp = Number(expStr);
  if (!expStr || !sig || !Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;
  return safeEqual(sig, await hmacHex(pw, expStr));
}

/** Comparação em tempo constante. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
