import type { MetadataRoute } from "next";
import { routing } from "../../i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://narboxcourier.com";

  return routing.locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1.0,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((loc) => [loc, `${siteUrl}/${loc}`])
      ),
    },
  }));
}
