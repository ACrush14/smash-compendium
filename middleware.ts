import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  // /api/admin/auth é o próprio login/logout; todo o resto de /api/admin exige sessão.
  // /api/translate gasta a cota da Anthropic, então também é só para admin.
  const isAdminApi  = (pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/auth"))
    || pathname.startsWith("/api/translate");
  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  const given = request.cookies.get(ADMIN_COOKIE)?.value ?? "";
  if (await verifyAdminToken(given)) return NextResponse.next();

  if (isAdminApi) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*", "/api/translate"],
};
