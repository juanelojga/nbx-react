import { siteConfig } from "@/lib/site-config";

export function WebSiteJsonLd() {
  const siteUrl = siteConfig.url;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteUrl,
    inLanguage: ["es", "en"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
