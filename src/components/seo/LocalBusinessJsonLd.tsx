import { siteConfig } from "@/lib/site-config";

export function LocalBusinessJsonLd() {
  const siteUrl = siteConfig.url;

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#business`,
    name: siteConfig.name,
    image: `${siteUrl}${siteConfig.logoPath}`,
    url: siteUrl,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.locality,
      addressCountry: siteConfig.countryCode,
    },
    areaServed: [
      { "@type": "Country", name: "Panama" },
      { "@type": "Country", name: "United States" },
    ],
    serviceType: "Courier Service",
    description:
      "Maritime and air courier service from USA to Panama with 20+ years customs experience.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
