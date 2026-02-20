"use client";

import { useCallback } from "react";
import { useQuery } from "@apollo/client";
import { useTranslations } from "next-intl";
import { Work_Sans, Inter } from "next/font/google";
import { PageHeader } from "@/components/ui/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StatusBadge } from "@/components/ui/status-badge";
import { Link } from "@/lib/navigation";
import {
  GET_DASHBOARD,
  GetDashboardResponse,
  GetDashboardVariables,
} from "@/graphql/queries/dashboard";
import { ConsolidationStatus } from "@/lib/validation/status";
import {
  Package,
  Users,
  AlertCircle,
  Layers,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

const workSansFont = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-work-sans",
  display: "swap",
});

const interFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const RECENT_LIMIT = 5;

export default function AdminDashboard() {
  const t = useTranslations("adminDashboard");

  const { data, loading, error, refetch } = useQuery<
    GetDashboardResponse,
    GetDashboardVariables
  >(GET_DASHBOARD, {
    variables: {
      recentPackagesLimit: RECENT_LIMIT,
      recentConsolidationsLimit: RECENT_LIMIT,
    },
    fetchPolicy: "cache-and-network",
  });

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const stats = data?.dashboard?.stats;
  const recentPackages = data?.dashboard?.recentPackages ?? [];
  const recentConsolidations = data?.dashboard?.recentConsolidations ?? [];

  return (
    <div
      className={`${workSansFont.variable} ${interFont.variable} space-y-8 animate-fade-in`}
    >
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            {t("refresh")}
          </Button>
        }
      />

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {t("loadingError", { error: error.message })}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label={t("statTotalPackages")}
          value={loading ? "—" : (stats?.totalPackages ?? 0)}
          icon={Package}
          variant="primary"
        />
        <StatCard
          label={t("statTotalClients")}
          value={loading ? "—" : (stats?.totalClients ?? 0)}
          icon={Users}
          variant="success"
        />
        <StatCard
          label={t("statPackagesPending")}
          value={loading ? "—" : (stats?.packagesPending ?? 0)}
          icon={AlertCircle}
          variant="warning"
        />
        <StatCard
          label={t("statPackagesInTransit")}
          value={loading ? "—" : (stats?.packagesInTransit ?? 0)}
          icon={Layers}
          variant="default"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Packages */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  <h2 className="font-[family-name:var(--font-work-sans)] text-lg font-bold">
                    {t("recentPackagesTitle")}
                  </h2>
                </CardTitle>
                <CardDescription>
                  {t("recentPackagesDescription")}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/packages">{t("viewAllPackages")}</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-lg bg-muted/50 animate-pulse"
                  />
                ))}
              </div>
            ) : recentPackages.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                {t("noRecentPackages")}
              </p>
            ) : (
              <div className="space-y-3">
                {recentPackages.map((pkg) => (
                  <Link
                    key={pkg.id}
                    href="/admin/packages"
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-200 hover:shadow-sm block"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <p className="font-[family-name:var(--font-inter)] font-semibold text-sm font-mono">
                          {pkg.barcode}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {pkg.client.fullName}
                        </p>
                        {pkg.description && (
                          <p className="text-xs text-muted-foreground truncate">
                            {pkg.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                      {new Date(pkg.createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Consolidations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  <h2 className="font-[family-name:var(--font-work-sans)] text-lg font-bold">
                    {t("recentConsolidationsTitle")}
                  </h2>
                </CardTitle>
                <CardDescription>
                  {t("recentConsolidationsDescription")}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/consolidations">
                  {t("viewAllConsolidations")}
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-lg bg-muted/50 animate-pulse"
                  />
                ))}
              </div>
            ) : recentConsolidations.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                {t("noRecentConsolidations")}
              </p>
            ) : (
              <div className="space-y-3">
                {recentConsolidations.map((con) => (
                  <Link
                    key={con.id}
                    href="/admin/consolidations"
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-200 hover:shadow-sm block"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Layers className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <p className="font-[family-name:var(--font-inter)] font-semibold text-sm">
                          {con.description}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {con.client.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("packagesCount", {
                            count: con.packages.length,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                      <StatusBadge
                        status={con.status as ConsolidationStatus}
                        label={con.status}
                      />
                      <p className="text-xs text-muted-foreground">
                        {new Date(con.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
