import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./src/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  return handleI18nRouting(request);
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
