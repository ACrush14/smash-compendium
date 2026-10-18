import { PrismaClient } from "@prisma/client";

// Evita múltiplas instâncias do Prisma Client em dev (HMR do Next.js)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Na Vercel cada função serverless cria o próprio pool. Com `connection_limit=5` poucas dezenas de instâncias
 * (inclusive "congeladas", que continuam segurando as conexões) esgotam o limite de 200 conexões de cliente do
 * pooler do Supabase (erro EMAXCONN, visto em 2026-10-18). Aqui cada instância usa no máximo 2 conexões.
 * Fora da Vercel (dev/servidor local) a URL é usada como está.
 */
function datasourceUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url || !process.env.VERCEL) return undefined;
  try {
    const u = new URL(url);
    u.searchParams.set("connection_limit", "2");
    u.searchParams.set("pool_timeout", "20");
    if (u.port === "6543") u.searchParams.set("pgbouncer", "true"); // pooler em modo transação
    return u.toString();
  } catch {
    return undefined;
  }
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: datasourceUrl(),
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
