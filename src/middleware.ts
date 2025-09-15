import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { api } from "./services/api";

interface JWTPayload {
  exp?: number; // expiration in seconds
}

const PUBLIC_PATHS = ["/login", "/verify-otp", "/request-otp"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("access_token")?.value;

  // 🚫 If already logged in, block access to login/verify pages
  if (token && PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      if (decoded.exp && decoded.exp > Math.floor(Date.now() / 1000)) {
        const url = req.nextUrl.clone();
        url.pathname = "/"; // redirect to homepage or dashboard
        return NextResponse.redirect(url);
      }
    } catch {
      
    }
  }

  // ✅ Allow truly public routes (without token requirement)
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 🔒 Protect private routes
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    const decoded = jwtDecode<JWTPayload>(token);
    if (!decoded.exp) throw new Error("No exp in token");

    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      const res = NextResponse.redirect(url);
      res.cookies.delete("access_token");
      return res;
    }
  } catch {
    
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
