"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { ErrorAlert } from "@/components/common/ErrorAlert";
import { FormFieldWrapper } from "@/components/common/FormFieldWrapper";
import LanguageSelector from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginRateLimit } from "@/hooks/useLoginRateLimit";
import { Link, useRouter } from "@/i18n/navigation";
import { getDefaultRoute } from "@/lib/auth/getDefaultRoute";
import {
  createLoginFormSchema,
  type LoginFormValues,
} from "@/lib/validation/loginFormSchema";
import { sanitizeEmail } from "@/lib/validation/sanitizeEmail";

const secondsUntil = (timestamp: number | null) =>
  timestamp ? Math.max(0, Math.ceil((timestamp - Date.now()) / 1000)) : 0;

export function LoginForm() {
  const t = useTranslations("login");
  const router = useRouter();
  const { login, loading, error, user, isAuthenticated } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const { attempt, isLocked, lockExpiry } = useLoginRateLimit();

  const schema = useMemo(() => createLoginFormSchema(t), [t]);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });
  const {
    register,
    formState: { errors },
  } = form;

  // Already signed in: go straight to the role dashboard.
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push(getDefaultRoute(user.role));
    }
  }, [isAuthenticated, user, router]);

  const onSubmit = form.handleSubmit(async ({ email, password }) => {
    setFormError(null);

    if (isLocked || !attempt()) {
      setFormError(
        t("rateLimitExceeded", { seconds: secondsUntil(lockExpiry) })
      );
      return;
    }

    try {
      await login(sanitizeEmail(email), password);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : t("loginFailed"));
    }
  });

  const isDisabled = loading || isLocked;

  return (
    <Card className="border-border/50 shadow-2xl backdrop-blur-sm bg-card/95">
      <CardHeader className="space-y-2 pb-6">
        <div className="flex justify-end mb-2">
          <LanguageSelector />
        </div>
        <CardTitle className="font-heading text-2xl font-extrabold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {t("title")}
        </CardTitle>
        <CardDescription className="text-center text-base">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(formError || error) && (
          <ErrorAlert
            message={formError || error || t("loginFailed")}
            onClose={() => setFormError(null)}
          />
        )}
        <form onSubmit={onSubmit} className="space-y-5 mt-4" noValidate>
          <FormFieldWrapper
            id="email"
            label={t("email")}
            error={errors.email?.message}
          >
            {(field) => (
              <Input
                {...field}
                {...register("email")}
                type="email"
                autoComplete="email"
                placeholder={t("emailPlaceholder")}
                disabled={isDisabled}
              />
            )}
          </FormFieldWrapper>
          <div className="space-y-2">
            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-secondary hover:text-secondary/80 transition-colors font-medium"
              >
                {t("forgotPassword")}
              </Link>
            </div>
            <FormFieldWrapper
              id="password"
              label={t("password")}
              error={errors.password?.message}
            >
              {(field) => (
                <Input
                  {...field}
                  {...register("password")}
                  type="password"
                  autoComplete="current-password"
                  placeholder={t("passwordPlaceholder")}
                  disabled={isDisabled}
                />
              )}
            </FormFieldWrapper>
          </div>
          <Button
            type="submit"
            className="w-full relative group overflow-hidden"
            disabled={isDisabled}
            size="lg"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <span className="animate-spin" aria-hidden="true">
                    <span className="block h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  </span>
                  {t("signingIn")}
                </>
              ) : (
                <>
                  {t("signIn")}
                  <span
                    className="group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </>
              )}
            </span>
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                {t("or")}
              </span>
            </div>
          </div>
          <div className="text-center text-sm">
            <span className="text-muted-foreground">{t("noAccount")}</span>{" "}
            <Link
              href="/register"
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              {t("createAccount")}
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
