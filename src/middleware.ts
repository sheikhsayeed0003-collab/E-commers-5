import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MAIN_HOST = "e-commers-5.vercel.app";

/** Redirect old per-deployment URLs to the main production domain */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  if (
    host.endsWith(".vercel.app") &&
    host !== MAIN_HOST &&
    host.startsWith("e-commers-5-") &&
    host.includes("-sayeed8.vercel.app")
  ) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = MAIN_HOST;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
