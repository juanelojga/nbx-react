import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/LanguageSelector";
import Image from "next/image";

export function LandingHeader() {
  const t = useTranslations("login"); // Using login translations for "signIn" or creating a specific one

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <Image
              src="/images/narbox-logo.png"
              alt="Narbox Logo"
              width={120}
              height={40}
              className="object-contain"
              priority
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <Link href="/login" passHref>
              <Button
                variant="default"
                className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {t("signIn") || "Log In"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
