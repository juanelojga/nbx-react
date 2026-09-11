import { siteConfig } from "@/lib/site-config";

export function OrganizationJsonLd() {
  const siteUrl = siteConfig.url;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteUrl,
    logo: `${siteUrl}${siteConfig.logoPath}`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      contactType: "customer service",
      availableLanguage: ["Spanish", "English"],
    },
    sameAs: [siteConfig.instagramUrl],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
