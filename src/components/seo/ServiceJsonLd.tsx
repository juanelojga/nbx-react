import { siteConfig } from "@/lib/site-config";

interface ServiceJsonLdProps {
  services: Array<{
    name: string;
    description: string;
  }>;
}

export function ServiceJsonLd({ services }: ServiceJsonLdProps) {
  const siteUrl = siteConfig.url;

  const schema = services.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
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
