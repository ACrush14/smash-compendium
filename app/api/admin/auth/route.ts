import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, SESSION_SECONDS, createAdminToken, getAdminPassword, safeEqual } from "@/lib/admin-auth";
import { clearLimit, clientIp, isLimited, rateLimit } from "@/lib/rate-limit";

const MAX_FAILS   = 5;
const LOCK_WINDOW = 15 * 60 * 1000; // 5 erros em 15 min bloqueiam o IP até a janela passar

export async function POST(req: NextRequest) {
  const expectedPassword = getAdminPassword();
  if (!expectedPassword) {
    return NextResponse.json(
      { error: "Admin trancado: defina ADMIN_PASSWORD (mín. 8 caracteres) no ambiente do servidor." },
      { status: 503 },
    );
  }

  const key = `admin-login:${clientIp(req.headers)}`;
  const wait = isLimited(key, MAX_FAILS, LOCK_WINDOW);
  if (wait > 0) {
    return NextResponse.json(
      { error: `Muitas tentativas. Tente de novo em ${Math.ceil(wait / 60)} min.` },
      { status: 429, headers: { "Retry-After": String(wait) } },
    );
  }

  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (typeof password !== "string" || !safeEqual(password, expectedPassword)) {
    rateLimit(key, MAX_FAILS, LOCK_WINDOW); // conta a falha
    // pequena pausa para dificultar tentativas em sequência
    await new Promise(r => setTimeout(r, 600));
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  clearLimit(key);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, (await createAdminToken())!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
