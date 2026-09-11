import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Providers } from "../providers";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { WebSiteJsonLd } from "@/components/seo/WebSiteJsonLd";
import { siteConfig } from "@/lib/site-config";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
