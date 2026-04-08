import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import { FAQPageJsonLd } from "@/components/seo/FAQPageJsonLd";
import { ServiceJsonLd } from "@/components/seo/ServiceJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://narboxcourier.com";

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

  const breadcrumbs = [{ name: "NarBox", url: `${siteUrl}/${locale}` }];

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
            <a href="#" className="hover:text-white transition-colors">
              {tFooter("privacyPolicy")}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {tFooter("termsOfService")}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
