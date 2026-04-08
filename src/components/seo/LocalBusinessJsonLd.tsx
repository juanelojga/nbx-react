export function LocalBusinessJsonLd() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://narboxcourier.com";

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#business`,
    name: "NarBox Courier",
    image: `${siteUrl}/images/narbox-logo.png`,
    url: siteUrl,
    telephone: "+507-6612-6130",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Panama City",
      addressCountry: "PA",
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
