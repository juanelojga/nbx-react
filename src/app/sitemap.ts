import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, `${siteConfig.url}/${locale}`])
  );

  return routing.locales.map((locale) => ({
    url: `${siteConfig.url}/${locale}`,
    changeFrequency: "weekly" as const,
    priority: 1.0,
    alternates: { languages },
  }));
}
