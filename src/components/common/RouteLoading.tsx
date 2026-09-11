import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardHeader } from "@/components/ui/card";

/** Route-level loading UI shared by Suspense boundaries and loading.tsx files. */
export function RouteLoading() {
  const t = useTranslations("common");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2" aria-hidden="true">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded bg-muted" />
      </div>
      <Card>
        <CardHeader>
          <div
            className="flex items-center justify-center py-12"
            role="status"
            aria-live="polite"
          >
            <div className="text-center space-y-4">
              <Loader2
                className="h-12 w-12 animate-spin text-primary mx-auto"
                aria-hidden="true"
              />
              <p className="text-sm text-muted-foreground">{t("loading")}</p>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
