import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { MessageCircle, Instagram, MapPin } from "lucide-react";
import Link from "next/link";

export function ContactSection() {
  const t = useTranslations("landing.contact");

  return (
    <section className="py-24 bg-slate-50 relative border-t border-border/50 overflow-hidden">
      {/* Decorative Blur blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-[800px] h-[400px] rounded-full bg-blue-100/40 blur-[100px] pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl shadow-blue-900/5 ring-1 ring-border/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Text Content */}
            <div className="space-y-6 max-w-xl">
              <h2 className="text-3xl sm:text-4xl font-bold font-(family-name:--font-work-sans) text-foreground">
                {t("title")}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t("text")}
              </p>
            </div>

            {/* Contact Methods */}
            <div className="flex flex-col gap-6 lg:ml-auto w-full max-w-md">
              {/* WhatsApp Card */}
              <div className="bg-slate-50 rounded-2xl p-6 ring-1 ring-border/50 hover:ring-[#4CAF50]/30 transition-shadow hover:shadow-lg hover:shadow-[#4CAF50]/5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-6 h-6 text-[#4CAF50]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">WhatsApp</h3>
                    <p className="text-muted-foreground font-mono">
                      {t("whatsapp")}
                    </p>
                  </div>
                </div>
                <Link
                  href="https://wa.me/50766126130"
                  target="_blank"
                  className="block"
                >
                  <Button className="w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white font-semibold">
                    {t("whatsappBtn")}
                  </Button>
                </Link>
              </div>

              {/* Other Methods */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Instagram */}
                <Link
                  href="https://instagram.com/narboxcourier"
                  target="_blank"
                  className="bg-white rounded-xl p-4 ring-1 ring-border/50 flex items-center gap-3 hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center group-hover:bg-pink-100 shrink-0 transition-colors">
                    <Instagram className="w-5 h-5 text-pink-500" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-medium text-sm text-foreground">
                      Instagram
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {t("instagram")}
                    </p>
                  </div>
                </Link>

                {/* Address */}
                <div className="bg-white rounded-xl p-4 ring-1 ring-border/50 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-[#1976D2]" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      Ubicación
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t("address")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
