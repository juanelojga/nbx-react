"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import LanguageSelector from "@/components/LanguageSelector";
import { useLoginRateLimit } from "@/hooks/useRateLimit";
import { sanitizeEmail } from "@/lib/utils/sanitize";

export default function LoginPage() {
  const t = useTranslations("login");
  const router = useRouter();
  const { login, loading, error, user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const { attempt, isLocked, lockExpiry } = useLoginRateLimit();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.isSuperuser
        ? "/admin/dashboard"
        : "/client/dashboard";
      router.push(redirectPath);
    }
  }, [isAuthenticated, user, router]);

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    // Email validation
    if (!email) {
      errors.email = t("emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = t("emailInvalid");
    }

    // Password validation
    if (!password) {
      errors.password = t("passwordRequired");
    } else if (password.length < 6) {
      errors.password = t("passwordMinLength");
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Check rate limiting
    if (isLocked) {
      const remainingSeconds = lockExpiry
        ? Math.ceil((lockExpiry - Date.now()) / 1000)
        : 0;
      setFormError(
        t("rateLimitExceeded", { seconds: remainingSeconds }) ||
          `Too many login attempts. Please try again in ${remainingSeconds} seconds.`
      );
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Check rate limit before attempting
    if (!attempt()) {
      const remainingSeconds = lockExpiry
        ? Math.ceil((lockExpiry - Date.now()) / 1000)
        : 0;
      setFormError(
        t("rateLimitExceeded", { seconds: remainingSeconds }) ||
          `Too many login attempts. Please try again in ${remainingSeconds} seconds.`
      );
      return;
    }

    try {
      // Sanitize email before sending
      const sanitizedEmail = sanitizeEmail(email);
      await login(sanitizedEmail, password);
      // Redirect is handled in AuthContext
    } catch (err) {
      setFormError(err instanceof Error ? err.message : t("loginFailed"));
    }
  };

  return (
    <Card className="w-full shadow-2xl border-border/50 backdrop-blur-sm bg-card/95">
      <CardHeader className="space-y-2 pb-6">
        <div className="flex justify-end mb-2">
          <LanguageSelector />
        </div>
        <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {t("title")}
        </CardTitle>
        <CardDescription className="text-center text-base">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(formError || error) && (
          <ErrorAlert
            message={formError || error || "An error occurred"}
            onClose={() => setFormError(null)}
          />
        )}
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setValidationErrors((prev) => ({ ...prev, email: undefined }));
              }}
              disabled={loading || isLocked}
              aria-invalid={!!validationErrors.email}
              aria-describedby={
                validationErrors.email ? "email-error" : undefined
              }
            />
            {validationErrors.email && (
              <p
                id="email-error"
                className="text-sm text-destructive font-medium flex items-center gap-1 animate-shake"
              >
                <span className="text-base">⚠</span>
                {validationErrors.email}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t("password")}</Label>
              <Link
                href="/forgot-password"
                className="text-sm text-secondary hover:text-secondary/80 transition-colors font-medium"
              >
                {t("forgotPassword")}
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder={t("passwordPlaceholder")}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setValidationErrors((prev) => ({
                  ...prev,
                  password: undefined,
                }));
              }}
              disabled={loading || isLocked}
              aria-invalid={!!validationErrors.password}
              aria-describedby={
                validationErrors.password ? "password-error" : undefined
              }
            />
            {validationErrors.password && (
              <p
                id="password-error"
                className="text-sm text-destructive font-medium flex items-center gap-1 animate-shake"
              >
                <span className="text-base">⚠</span>
                {validationErrors.password}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full relative group overflow-hidden"
            disabled={loading || isLocked}
            size="lg"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  {t("signingIn")}
                </>
              ) : (
                <>
                  {t("signIn")}
                  <span className="group-hover:translate-x-1 transition-transform">
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
