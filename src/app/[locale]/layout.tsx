import "../globals.css";

import type { Metadata, Viewport } from "next";
import { Inter, Work_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";

import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { WebSiteJsonLd } from "@/components/seo/WebSiteJsonLd";
import { type Locale, routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

import { Providers } from "../providers";

// Two-font system (see docs/TYPOGRAPHY_GUIDELINES.md): Work Sans for
// headings, Inter for body/data. Loaded once here for the whole app.
const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-work-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  const siteUrl = siteConfig.url;
  const url = `${siteUrl}/${locale}`;

  return {
    title: {
      default: t("title"),
      template: `%s | ${siteConfig.name}`,
    },
    description: t("description"),
    keywords: t("keywords"),
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        routing.locales.map((loc) => [loc, `${siteUrl}/${loc}`])
      ),
    },
    openGraph: {
      title: t("title"),
      description: t("ogDescription"),
      url,
      siteName: siteConfig.name,
      locale: locale === "es" ? "es_PA" : "en_US",
      alternateLocale: locale === "es" ? ["en_US"] : ["es_PA"],
      type: "website",
      images: [
        {
          url: `${siteUrl}${siteConfig.logoPath}`,
          width: siteConfig.logoWidth,
          height: siteConfig.logoHeight,
          alt: "NarBox Courier Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("ogDescription"),
      images: [`${siteUrl}${siteConfig.logoPath}`],
    },
    icons: {
      icon: "/favicon.ico",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  // Await params to get the locale from URL
  const { locale } = await params;

  // Validate that the locale from URL is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Set the locale for next-intl server components
  setRequestLocale(locale);

  // Get messages for the locale from URL params
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${workSans.variable} ${inter.variable} antialiased`}>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
