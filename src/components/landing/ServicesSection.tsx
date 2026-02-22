import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart, Ship, Truck, Building2 } from "lucide-react";

export function ServicesSection() {
  const t = useTranslations("landing.services");

  const services = [
    {
      id: "online",
      icon: <ShoppingCart className="w-6 h-6 text-[#1976D2]" />,
      titleKey: "card1Title",
      textKey: "card1Text",
    },
    {
      id: "freight",
      icon: <Ship className="w-6 h-6 text-[#03A9F4]" />,
      titleKey: "card2Title",
      textKey: "card2Text",
    },
    {
      id: "heavy",
      icon: <Truck className="w-6 h-6 text-[#4CAF50]" />,
      titleKey: "card3Title",
      textKey: "card3Text",
    },
    {
      id: "business",
      icon: <Building2 className="w-6 h-6 text-[#FFB300]" />,
      titleKey: "card4Title",
      textKey: "card4Text",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      {/* Decorative BG pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#1976D2_1px,transparent_1px)] [background-size:24px_24px] z-0" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold font-(family-name:--font-work-sans) text-foreground">
            {t("title") || "Nuestros Servicios"}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {t("subtitle") || "Soluciones a medida para cada tipo de envío."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Card
              key={service.id}
              className="group border-border/50 bg-background/60 backdrop-blur-sm hover:border-[#1976D2]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1976D2]/5"
            >
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-300">
                  {service.icon}
                </div>
                <CardTitle className="text-xl font-bold text-foreground">
                  {t(service.titleKey as Parameters<typeof t>[0])}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-base text-muted-foreground">
                  {t(service.textKey as Parameters<typeof t>[0])}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
