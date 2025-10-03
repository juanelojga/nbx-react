"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      {user && <MainLayout userRole={user.role}>{children}</MainLayout>}
    </ProtectedRoute>
  );
}
