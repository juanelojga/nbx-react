import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function HeroSection() {
  const t = useTranslations("landing.hero");

  return (
    <section className="relative overflow-hidden bg-background pt-8 pb-16 sm:pt-16 sm:pb-24 lg:pb-32">
      {/* Decorative background elements */}
      <div
        className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-blue-50 to-transparent -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 right-0 -translate-y-12 translate-x-1/3"
        aria-hidden="true"
      >
        <div className="w-[600px] h-[600px] rounded-full bg-blue-100/50 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Mobile Image (Top on small screens) */}
          <div className="lg:hidden w-full relative h-[300px] sm:h-[400px] rounded-2xl overflow-hidden shadow-xl bg-white">
            <Image
              src="/images/hero-image.png"
              alt="Narbox Delivery Illustration"
              fill
              className="object-contain p-4"
              priority
            />
          </div>

          {/* Text Content */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground font-(family-name:--font-work-sans) leading-[1.1]">
                {t("title")}
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                {t("subtitle")}
              </p>
            </div>

            {/* Bullets */}
            <ul className="space-y-3">
              {(["bullet1", "bullet2", "bullet3"] as const).map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <CheckCircle2
                    className="w-6 h-6 text-[#4CAF50] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-base font-medium text-foreground/90">
                    {t(key)}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full">
              <Link
                href={siteConfig.whatsappUrl}
                target="_blank"
                className="w-full sm:w-auto"
              >
                <Button className="w-full sm:w-auto h-12 px-8 text-base bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white font-semibold rounded-full shadow-lg shadow-[#4CAF50]/20 transition-transform active:scale-95">
                  {t("primaryBtn")}
                </Button>
              </Link>
              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto h-12 px-8 text-base border-2 border-[#1976D2] text-[#1976D2] hover:bg-[#1976D2]/5 font-semibold rounded-full transition-transform active:scale-95"
              >
                <a href="#how-it-works">{t("secondaryBtn")}</a>
              </Button>
            </div>

            {/* Micro-trust text */}
            <p className="text-xs text-muted-foreground/80 font-medium">
              {t("trustText")}
            </p>
          </div>

          {/* Desktop Image (Right side) */}
          <div className="hidden lg:block relative w-full h-[500px] xl:h-[600px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/50 bg-white">
            <Image
              src="/images/hero-image.png"
              alt="Narbox Delivery Illustration"
              fill
              className="object-contain p-8"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
