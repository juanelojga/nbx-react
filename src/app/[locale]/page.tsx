import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { setRequestLocale } from "next-intl/server";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-[#1976D2]/20 selection:text-[#1976D2]">
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
              Politicas de Privacidad
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Términos de Servicio
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
