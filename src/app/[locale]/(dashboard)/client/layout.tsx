import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import ProtectedRoute from "@/components/common/ProtectedRoute";
import { UserRole } from "@/types/user";

const CLIENT_ROLES = [UserRole.CLIENT] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return {
    title: t("clientTitle"),
    robots: { index: false, follow: false },
  };
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={CLIENT_ROLES}>{children}</ProtectedRoute>
  );
}
