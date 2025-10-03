"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { ErrorAlert } from "@/components/common/ErrorAlert";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error, user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

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
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      await login(email, password);
      // Redirect is handled in AuthContext
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    }
  };

  return (
    <Card className="w-full shadow-2xl border-border/50 backdrop-blur-sm bg-card/95">
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-center text-base">
          Enter your credentials to access your account
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setValidationErrors((prev) => ({ ...prev, email: undefined }));
              }}
              disabled={loading}
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
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-sm text-secondary hover:text-secondary/80 transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setValidationErrors((prev) => ({
                  ...prev,
                  password: undefined,
                }));
              }}
              disabled={loading}
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
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              disabled={loading}
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>
          <Button
            type="submit"
            className="w-full relative group overflow-hidden"
            disabled={loading}
            size="lg"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
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
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Don&apos;t have an account?
            </span>{" "}
            <Link
              href="/register"
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Create account
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
