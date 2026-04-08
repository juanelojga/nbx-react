import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";

export function FAQSection() {
  const t = useTranslations("landing.faq");

  const faqs = [
    { q: "q1", a: "a1" },
    { q: "q2", a: "a2" },
    { q: "q3", a: "a3" },
  ];

  return (
    <section className="py-20 bg-background relative border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-(family-name:--font-work-sans) text-foreground">
            {t("title")}
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">{t("subtitle")}</p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group bg-slate-50 border border-border/60 rounded-2xl md:rounded-full p-1 overflow-hidden transition-all duration-300 open:bg-white open:shadow-lg open:shadow-blue-900/5 open:rounded-2xl"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none px-6 py-4 font-semibold text-foreground select-none">
                <span className="text-base sm:text-lg pr-4">
                  {t(faq.q as Parameters<typeof t>[0])}
                </span>
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-open:-rotate-180 transition-transform duration-300 text-[#1976D2]">
                  <ChevronDown className="w-5 h-5" />
                </span>
              </summary>
              <div className="px-6 pb-6 pt-2 text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-4 duration-300">
                {t(faq.a as Parameters<typeof t>[0])}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
