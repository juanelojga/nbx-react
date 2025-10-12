"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LanguageSelector() {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) return;

    startTransition(() => {
      // Set cookie for locale preference
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

      // Refresh to apply new locale
      router.refresh();
    });
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleLocaleChange("es")}
        disabled={isPending || locale === "es"}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          locale === "es"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label={t("spanish")}
      >
        {t("spanish")}
      </button>
      <button
        onClick={() => handleLocaleChange("en")}
        disabled={isPending || locale === "en"}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          locale === "en"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label={t("english")}
      >
        {t("english")}
      </button>
    </div>
  );
}
