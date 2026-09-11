import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactSection } from "@/components/landing/ContactSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQPageJsonLd } from "@/components/seo/FAQPageJsonLd";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import { ServiceJsonLd } from "@/components/seo/ServiceJsonLd";
import { siteConfig } from "@/lib/site-config";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tFaq = await getTranslations({ locale, namespace: "landing.faq" });
  const tServices = await getTranslations({
    locale,
    namespace: "landing.services",
  });
  const tFooter = await getTranslations({ locale, namespace: "footer" });

  const faqs = [
    { question: tFaq("q1"), answer: tFaq("a1") },
    { question: tFaq("q2"), answer: tFaq("a2") },
    { question: tFaq("q3"), answer: tFaq("a3") },
  ];

  const services = [
    { name: tServices("card1Title"), description: tServices("card1Text") },
    { name: tServices("card2Title"), description: tServices("card2Text") },
    { name: tServices("card3Title"), description: tServices("card3Text") },
    { name: tServices("card4Title"), description: tServices("card4Text") },
  ];

  const breadcrumbs = [
    { name: siteConfig.shortName, url: `${siteConfig.url}/${locale}` },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-[#1976D2]/20 selection:text-[#1976D2]">
      <LocalBusinessJsonLd />
      <FAQPageJsonLd faqs={faqs} />
      <ServiceJsonLd services={services} />
      <BreadcrumbJsonLd items={breadcrumbs} />

      <LandingHeader />

      <main className="flex-1 flex flex-col">
        <HeroSection />
        <HowItWorksSection />
        <ServicesSection />
        <FAQSection />
        <ContactSection />
      </main>

      {/* Simple Footer derived from Contact Section */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wide">NarBox</span>
            <span className="text-sm">© {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <span>{tFooter("privacyPolicy")}</span>
            <span>{tFooter("termsOfService")}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
