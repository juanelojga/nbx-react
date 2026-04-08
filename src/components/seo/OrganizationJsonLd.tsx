export function OrganizationJsonLd() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://narboxcourier.com";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NarBox Courier",
    url: siteUrl,
    logo: `${siteUrl}/images/narbox-logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+507-6612-6130",
      contactType: "customer service",
      availableLanguage: ["Spanish", "English"],
    },
    sameAs: ["https://instagram.com/narboxcourier"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
