import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js Middleware for route protection.
 * - /dashboard/* → redirect to /login if no session
 * - /login, /register → redirect to /dashboard if already logged in
 * Reference: docs/02_SYSTEM_ARCHITECTURE.md (Section 5)
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for Better Auth session cookie
  const sessionCookie =
    request.cookies.get("better-auth.session_token") ??
    request.cookies.get("__Secure-better-auth.session_token");

  const isAuthenticated = !!sessionCookie?.value;

  // Protected routes — redirect to login if not authenticated
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Auth routes — redirect to dashboard if already authenticated
  if (pathname === "/login" || pathname === "/register") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
