"use client";

import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

interface ErrorBoundaryFallbackProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorBoundaryFallback({
  message,
  onRetry,
}: ErrorBoundaryFallbackProps) {
  const t = useTranslations("common.error");

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      role="alert"
    >
      <div className="text-center space-y-4 max-w-md">
        <AlertCircle
          className="h-12 w-12 text-destructive mx-auto"
          aria-hidden="true"
        />
        <h1 className="text-2xl font-extrabold">{t("title")}</h1>
        <p className="text-muted-foreground">{message || t("description")}</p>
        <Button onClick={onRetry}>{t("retry")}</Button>
      </div>
    </div>
  );
}
