import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
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

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isProtectedPage = pathname.startsWith("/dashboard");

  if (isProtectedPage && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}