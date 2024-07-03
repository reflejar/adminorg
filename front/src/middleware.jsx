import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const authTokens = request.cookies.get("token")?.value;

  if (!authTokens) {
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete("token");
    return response;
  }
  if (authTokens && request.nextUrl.pathname.startsWith("/auth/login")) {
    const response = NextResponse.redirect(new URL("/", request.url));
    return response;
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!auth|_next/static|_next/image|img|favicon.ico).*)'],
};