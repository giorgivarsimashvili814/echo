import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const sessionId = request.cookies.get("sessionId");
  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  const isPublicRoute = request.nextUrl.pathname.startsWith("/users");

  if (!sessionId && !isAuthRoute && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (sessionId && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (sessionId && !isAuthRoute && !isPublicRoute) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/current-user`,
      {
        headers: { cookie: `sessionId=${sessionId.value}` },
      },
    );

    if (!res.ok) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("sessionId");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
