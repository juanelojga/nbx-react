export function WebSiteJsonLd() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://narboxcourier.com";

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NarBox Courier",
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
