import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

const PRIVATE_SECTIONS = ["login", "admin/", "client/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          ...routing.locales.flatMap((locale) =>
            PRIVATE_SECTIONS.map((section) => `/${locale}/${section}`)
          ),
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
