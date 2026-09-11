import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorAlertProps {
  message: string;
  onClose?: () => void;
}

export function ErrorAlert({ message, onClose }: ErrorAlertProps) {
  const t = useTranslations("common");

  return (
    <Alert variant="destructive" className="relative" role="alert">
      <AlertDescription className="pr-8">{message}</AlertDescription>
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6"
          onClick={onClose}
          aria-label={t("dismiss")}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
      )}
    </Alert>
  );
}
