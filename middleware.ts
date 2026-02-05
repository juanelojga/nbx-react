import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Middleware
 *
 * Handles:
 * - Locale detection and redirection
 * - Security headers injection
 * - Auth path protection (client-side auth handled in AuthContext)
 */

// Locale configuration (duplicated here to avoid circular dependencies)
const locales = ["es", "en"] as const;
const defaultLocale = "es" as const;
type Locale = (typeof locales)[number];

// Paths that don't require locale prefix
const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the pathname starts with a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Add security headers to all responses
  const response = NextResponse.next();

  // Add cache control for static assets
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)
  ) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
  }

  // Add nonce for CSP (can be used with CSP headers)
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  response.headers.set("X-Nonce", nonce);

  // If pathname already has locale, continue
  if (pathnameHasLocale) {
    return response;
  }

  // Check if it's a public path that should have locale
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if (isPublicPath || pathname === "/") {
    // Get locale from cookie or accept-language header
    const locale =
      request.cookies.get("NEXT_LOCALE")?.value ||
      getLocaleFromHeaders(request.headers) ||
      defaultLocale;

    // Only redirect if locale is not default or if it's a root path
    if (locale !== defaultLocale || pathname === "/") {
      const newUrl = new URL(
        `/${locale}${pathname === "/" ? "" : pathname}`,
        request.url
      );
      return NextResponse.redirect(newUrl);
    }
  }

  return response;
}

/**
 * Extract preferred locale from Accept-Language header
 */
function getLocaleFromHeaders(headers: Headers): Locale | null {
  const acceptLanguage = headers.get("accept-language");
  if (!acceptLanguage) return null;

  // Parse Accept-Language header
  const preferredLocales = acceptLanguage
    .split(",")
    .map((lang) => {
      const [locale, q = "1"] = lang.trim().split(";q=");
      return { locale: locale.split("-")[0], q: parseFloat(q) };
    })
    .sort((a, b) => b.q - a.q);

  // Find first matching locale
  for (const { locale } of preferredLocales) {
    if (locales.includes(locale as Locale)) {
      return locale as Locale;
    }
  }

  return null;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
