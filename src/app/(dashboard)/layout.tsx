"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { getUserRoleString } from "@/lib/utils/user-role";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      {user && (
        <MainLayout userRole={getUserRoleString(user.role)}>
          {children}
        </MainLayout>
      )}
    </ProtectedRoute>
  );
}
