interface ServiceJsonLdProps {
  services: Array<{
    name: string;
    description: string;
  }>;
}

export function ServiceJsonLd({ services }: ServiceJsonLdProps) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://narboxcourier.com";

  const schema = services.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    provider: {
      "@type": "Organization",
      name: "NarBox Courier",
      url: siteUrl,
    },
    name: service.name,
    description: service.description,
    areaServed: [
      { "@type": "Country", name: "Panama" },
      { "@type": "Country", name: "United States" },
    ],
  }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
