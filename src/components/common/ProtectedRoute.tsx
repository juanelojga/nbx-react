"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for loading to complete
    if (loading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Check role-based access if required
    if (requiredRole && user?.role !== requiredRole) {
      // Redirect to appropriate dashboard based on user role
      const roleDashboards: Record<UserRole, string> = {
        [UserRole.ADMIN]: "/admin",
        [UserRole.CLIENT]: "/client",
      };

      const userDashboard = roleDashboards[user?.role as UserRole] || "/";
      router.push(userDashboard);
    }
  }, [loading, isAuthenticated, user, requiredRole, router, redirectTo]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children until authentication is verified
  if (!isAuthenticated) {
    return null;
  }

  // Don't render if role doesn't match
  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}
