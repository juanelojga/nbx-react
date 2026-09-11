/**
 * Single source of truth for public business/site constants used by SEO
 * metadata, JSON-LD, the web manifest and marketing sections.
 */
export const siteConfig = {
  name: "NarBox Courier",
  shortName: "NarBox",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://narboxcourier.com",
  logoPath: "/images/narbox-logo.png",
  logoWidth: 455,
  logoHeight: 514,
  phone: "+507-6612-6130",
  whatsappUrl: "https://wa.me/50766126130",
  instagramUrl: "https://instagram.com/narboxcourier",
  themeColor: "#1976D2",
  locality: "Panama City",
  countryCode: "PA",
} as const;
