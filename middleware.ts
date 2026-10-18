import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken, safeEqual } from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  // /api/admin/auth é o próprio login/logout; todo o resto de /api/admin exige sessão.
  const isAdminApi  = pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/auth");
  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  const expected = await adminToken();
  const given    = request.cookies.get(ADMIN_COOKIE)?.value ?? "";
  const ok       = expected !== null && safeEqual(given, expected);
  if (ok) return NextResponse.next();

  if (isAdminApi) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
