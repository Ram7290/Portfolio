import { NextResponse, type NextRequest } from "next/server";

/**
 * Lightweight edge proxy (Next 16's renamed middleware):
 * bounces visitors without an auth session cookie away from /admin
 * (except the login page). Full verification still happens server-side
 * in the admin layout via auth().
 */

const SESSION_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isLoginRoute = pathname === "/admin/login";

  if (!isAdminRoute || isLoginRoute) return NextResponse.next();

  const hasSessionCookie = SESSION_COOKIE_NAMES.some((name) =>
    request.cookies.has(name),
  );

  if (!hasSessionCookie) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
