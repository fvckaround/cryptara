import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
  ],
};

function getSecretKey() {
  return new TextEncoder().encode(process.env.JWT_SECRET);
}

async function getVerifiedSession(request) {
  const token = request.cookies.get("cryptara_session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch (err) {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const session = await getVerifiedSession(request);

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/verify-email" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";
  const isProtectedPage = pathname.startsWith("/dashboard");
  const isAdminPage = pathname.startsWith("/admin");

  if (isProtectedPage && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminPage) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (session.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // /verify-email, /forgot-password, and /reset-password stay
  // reachable even when logged in — unlike /login and /register,
  // which redirect an already-authenticated session to /dashboard.
  const alwaysReachable =
    pathname === "/verify-email" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  if (isAuthPage && session && !alwaysReachable) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}