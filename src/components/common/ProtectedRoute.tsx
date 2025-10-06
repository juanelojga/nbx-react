"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoading } from "./PageLoading";
import { canAccessRoute, getDefaultRoute } from "@/lib/auth/redirects";
import { getUserRoleString } from "@/lib/utils/user-role";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<"admin" | "client">;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated - redirect to login
      if (!isAuthenticated || !user) {
        router.push("/login");
        return;
      }

      // Check role-based access
      if (
        allowedRoles &&
        !canAccessRoute(getUserRoleString(user.role), allowedRoles)
      ) {
        // Redirect to user's default dashboard
        router.push(getDefaultRoute(getUserRoleString(user.role)));
      }
    }
  }, [user, loading, isAuthenticated, allowedRoles, router]);

  // Show loading while checking authentication
  if (loading) {
    return <PageLoading />;
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // Not authorized for this route
  if (
    allowedRoles &&
    !canAccessRoute(getUserRoleString(user.role), allowedRoles)
  ) {
    return null;
  }

  // Authorized - render children
  return <>{children}</>;
}
