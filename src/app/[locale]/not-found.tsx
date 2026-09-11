import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("common.notFound");

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-md text-center space-y-6">
        <p className="text-6xl font-extrabold text-primary/30" aria-hidden>
          404
        </p>
        <h1 className="text-2xl font-extrabold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
        <Button asChild>
          <Link href="/">{t("goHome")}</Link>
        </Button>
      </div>
    </main>
  );
}
