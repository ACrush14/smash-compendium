import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "smash_admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Senhaimprovisada123";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/admin") &&
    pathname !== "/admin/login" &&
    !pathname.startsWith("/api/admin/auth")
  ) {
    const cookie = request.cookies.get(COOKIE_NAME);
    if (cookie?.value !== ADMIN_PASSWORD) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
