import { useTranslations } from "next-intl";

/** Full-screen loading state shown while the session is being restored. */
export function PageLoading() {
  const t = useTranslations("common");

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50"
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <div className="flex items-center justify-center mb-6" aria-hidden>
          <div className="h-16 w-16 rounded-2xl bg-[#1976D2] flex items-center justify-center text-white text-3xl font-bold">
            N
          </div>
        </div>
        <div className="animate-spin mx-auto mb-4" aria-hidden>
          <div className="h-8 w-8 border-4 border-[#1976D2] border-t-transparent rounded-full" />
        </div>
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    </div>
  );
}
