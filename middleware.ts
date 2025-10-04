import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Just pass through - locale detection handled by cookies/headers in client
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
