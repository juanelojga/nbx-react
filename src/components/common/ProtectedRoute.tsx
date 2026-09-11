"use client";

import { useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "@/i18n/navigation";
import { canAccessRoute } from "@/lib/auth/canAccessRoute";
import { getDefaultRoute } from "@/lib/auth/getDefaultRoute";
import type { UserRole } from "@/types/user";

import { PageLoading } from "./PageLoading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** When set, only these roles may render `children`; others are sent to their dashboard. */
  allowedRoles?: readonly UserRole[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  const isAuthorized =
    isAuthenticated && user !== null && canAccessRoute(user.role, allowedRoles);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }
    if (!isAuthorized) {
      router.push(getDefaultRoute(user.role));
    }
  }, [loading, isAuthenticated, user, isAuthorized, router]);

  if (loading) return <PageLoading />;
  if (!isAuthorized) return null;

  return <>{children}</>;
}
