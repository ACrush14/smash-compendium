/**
 * Autenticação do admin (usada no middleware/Edge e na rota de login — por isso só Web Crypto, sem Node).
 *
 * - A senha vem de ADMIN_PASSWORD. Em PRODUÇÃO não existe senha padrão: sem a variável, o admin fica trancado.
 * - O cookie guarda um token derivado (SHA-256), nunca a senha em si.
 */
export const ADMIN_COOKIE = "smash_admin";

/** Senha configurada, ou null quando o admin deve ficar trancado. */
export function getAdminPassword(): string | null {
  const fromEnv = process.env.ADMIN_PASSWORD;
  if (fromEnv && fromEnv.length >= 8) return fromEnv;
  // Só em desenvolvimento local (next dev) há uma senha de conveniência.
  return process.env.NODE_ENV === "production" ? null : "dev-only-admin-password";
}

async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

/** Token que vai no cookie; null se o admin está trancado. */
export async function adminToken(): Promise<string | null> {
  const pw = getAdminPassword();
  return pw ? sha256Hex(`smash-admin-v1:${pw}`) : null;
}

/** Comparação em tempo constante. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
