"use client";

import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { logger } from "@/lib/logger";

interface RouteErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
  /** Locale-relative route offered as the escape hatch. */
  homeHref: string;
}

/** Shared body for the dashboard `error.tsx` boundaries. */
export function RouteErrorFallback({
  error,
  reset,
  homeHref,
}: RouteErrorFallbackProps) {
  const t = useTranslations("common.error");
  const router = useRouter();

  useEffect(() => {
    logger.error("Route error boundary caught an error", error);
  }, [error]);

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-destructive" role="alert">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle
                className="h-6 w-6 text-destructive"
                aria-hidden="true"
              />
            </div>
            <div>
              <CardTitle className="text-destructive">{t("title")}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {t("description")}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error.message && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-mono text-foreground">
                {error.message}
              </p>
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={reset}>{t("retry")}</Button>
            <Button variant="outline" onClick={() => router.push(homeHref)}>
              {t("goToDashboard")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
