import { useTranslations } from "next-intl";
import { ShoppingBag, Plane, PackageCheck } from "lucide-react";

export function HowItWorksSection() {
  const t = useTranslations("landing.howItWorks");

  const steps = [
    {
      id: 1,
      icon: <ShoppingBag className="w-8 h-8 text-[#1976D2]" />,
      titleKey: "step1Title",
      textKey: "step1Text",
      bg: "bg-blue-50",
    },
    {
      id: 2,
      icon: <Plane className="w-8 h-8 text-[#03A9F4]" />,
      titleKey: "step2Title",
      textKey: "step2Text",
      bg: "bg-sky-50",
    },
    {
      id: 3,
      icon: <PackageCheck className="w-8 h-8 text-[#4CAF50]" />,
      titleKey: "step3Title",
      textKey: "step3Text",
      bg: "bg-green-50",
    },
  ];

  return (
    <section className="py-20 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold font-(family-name:--font-work-sans) text-foreground">
            {t("title")}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connecting line (Desktop only) */}
          <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-100 via-sky-100 to-green-100 z-0" />

          {steps.map((step) => (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              {/* Number/Icon badge */}
              <div
                className={`w-24 h-24 rounded-full ${step.bg} flex items-center justify-center mb-6 shadow-sm ring-4 ring-white transition-transform duration-300 group-hover:-translate-y-2`}
              >
                <div className="relative">
                  {step.icon}
                  {/* Small number badge */}
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                    {step.id}
                  </div>
                </div>
              </div>

              {/* Text */}
              <h3 className="text-xl font-bold font-(family-name:--font-work-sans) text-foreground mb-3">
                {t(step.titleKey as Parameters<typeof t>[0])}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t(step.textKey as Parameters<typeof t>[0])}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
