import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken, getAdminPassword, safeEqual } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const expectedPassword = getAdminPassword();
  if (!expectedPassword) {
    return NextResponse.json(
      { error: "Admin trancado: defina ADMIN_PASSWORD (mín. 8 caracteres) no ambiente do servidor." },
      { status: 503 },
    );
  }

  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (typeof password !== "string" || !safeEqual(password, expectedPassword)) {
    // pequena pausa para dificultar tentativas em sequência
    await new Promise(r => setTimeout(r, 600));
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, (await adminToken())!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 dias
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
