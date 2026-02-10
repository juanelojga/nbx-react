"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, X, Layers, DollarSign, Weight } from "lucide-react";
import { Package as PackageType } from "../types";
import { cn } from "@/lib/utils";

interface CurrentConsolidatePanelProps {
  selectedPackages: Set<string>; // Rule 7.11: Use Set for O(1) lookups
  packages: PackageType[];
  onRemovePackage: (packageId: string) => void;
  onClearAll: () => void;
}

export function CurrentConsolidatePanel({
  selectedPackages,
  packages,
  onRemovePackage,
  onClearAll,
}: CurrentConsolidatePanelProps) {
  const t = useTranslations("adminPackages.panel");

  const selectedPackageDetails = useMemo(() => {
    // Rule 7.11: Use Set.has() for O(1) lookup instead of Array.includes()
    return packages.filter((pkg) => selectedPackages.has(pkg.id));
  }, [packages, selectedPackages]);

  // Calculate aggregate statistics for selected packages
  const statistics = useMemo(() => {
    return selectedPackageDetails.reduce(
      (acc, pkg) => {
        // Sum real prices
        if (pkg.realPrice !== null) {
          acc.totalRealPrice += pkg.realPrice;
        }
        // Sum service prices
        if (pkg.servicePrice !== null) {
          acc.totalServicePrice += pkg.servicePrice;
        }
        // Sum weights (assuming all in same unit or handling mixed units)
        if (pkg.weight !== null) {
          acc.totalWeight += pkg.weight;
          // Track weight unit (use first non-null unit found)
          if (!acc.weightUnit && pkg.weightUnit) {
            acc.weightUnit = pkg.weightUnit;
          }
        }
        return acc;
      },
      {
        totalRealPrice: 0,
        totalServicePrice: 0,
        totalWeight: 0,
        weightUnit: null as string | null,
      }
    );
  }, [selectedPackageDetails]);

  const isEmpty = selectedPackages.size === 0;

  return (
    <div className="relative">
      {/* Animated background glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse" />

      <Card className="relative sticky top-6 h-fit overflow-hidden border-2 border-border shadow-2xl bg-card">
        {/* Diagonal stripe pattern background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              hsl(var(--foreground)) 0px,
              hsl(var(--foreground)) 2px,
              transparent 2px,
              transparent 12px
            )`,
          }}
        />

        {/* Top accent bar with animated gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-500 opacity-90">
          <div
            className="h-full w-1/3 bg-white/40 animate-[shimmer_2s_ease-in-out_infinite]"
            style={{
              animation: "shimmer 2s ease-in-out infinite",
              backgroundImage:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            }}
          />
        </div>

        <CardHeader className="relative pb-4 pt-6 px-6 bg-gradient-to-br from-card via-card to-muted/30">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Animated icon container */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg blur-md opacity-50 animate-pulse" />
                <div className="relative w-11 h-11 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <Layers className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
                {!isEmpty && (
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg animate-in zoom-in duration-300">
                    {selectedPackages.size}
                  </div>
                )}
              </div>
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground leading-none">
                  {t("title")}
                </CardTitle>
                <p className="text-[10px] uppercase tracking-wider text-cyan-500 font-bold mt-1.5 leading-none">
                  {isEmpty
                    ? t("statusStandby")
                    : `${selectedPackages.size} ${t("statusActive")}`}
                </p>
              </div>
            </div>
            {!isEmpty && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="h-7 px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-border/50 hover:border-destructive/50 transition-all duration-300"
              >
                {t("clearAll")}
              </Button>
            )}
          </div>
        </CardHeader>

        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <CardContent className="relative p-6 pt-5">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="relative mb-6">
                {/* Pulsing rings */}
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping" />
                <div
                  className="absolute inset-0 rounded-full border-2 border-cyan-500/30"
                  style={{ animationDelay: "0.5s" }}
                />

                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center border-2 border-border">
                  <Package
                    className="h-9 w-9 text-muted-foreground/60"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 max-w-[200px] leading-relaxed">
                {t("emptyMessage")}
              </p>
              <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
          ) : (
            <div className="space-y-5">
              {/* Data Grid - Statistics with bold styling */}
              <div className="relative rounded-xl overflow-hidden border-2 border-border bg-gradient-to-br from-card to-muted/20 shadow-inner">
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-2xl" />

                <div className="relative grid grid-cols-2 gap-px bg-border p-px">
                  {/* Stat Card: Total Packages */}
                  <div className="bg-card p-4 relative overflow-hidden group hover:bg-muted/30 transition-colors duration-300">
                    <div className="absolute top-1 right-1 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Layers
                        className="h-12 w-12 text-emerald-500"
                        strokeWidth={1}
                      />
                    </div>
                    <div className="relative">
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                          {t("totalPackages")}
                        </p>
                      </div>
                      <p className="text-2xl font-black tracking-tight text-foreground tabular-nums leading-none">
                        {selectedPackages.size}
                      </p>
                      <p className="text-[9px] uppercase tracking-wider text-emerald-500 font-bold mt-1.5">
                        {t("unitsLabel")}
                      </p>
                    </div>
                  </div>

                  {/* Stat Card: Total Weight */}
                  <div className="bg-card p-4 relative overflow-hidden group hover:bg-muted/30 transition-colors duration-300">
                    <div className="absolute top-1 right-1 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Weight
                        className="h-12 w-12 text-cyan-500"
                        strokeWidth={1}
                      />
                    </div>
                    <div className="relative">
                      <div className="flex items-center gap-1.5 mb-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"
                          style={{ animationDelay: "0.2s" }}
                        />
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                          {t("totalWeight")}
                        </p>
                      </div>
                      <p className="text-2xl font-black tracking-tight text-foreground tabular-nums leading-none">
                        {statistics.totalWeight > 0
                          ? statistics.totalWeight.toFixed(2)
                          : "—"}
                      </p>
                      <p className="text-[9px] uppercase tracking-wider text-cyan-500 font-bold mt-1.5">
                        {statistics.weightUnit || t("weightUnitDefault")}
                      </p>
                    </div>
                  </div>

                  {/* Stat Card: Real Price */}
                  <div className="bg-card p-4 relative overflow-hidden group hover:bg-muted/30 transition-colors duration-300">
                    <div className="absolute top-1 right-1 opacity-10 group-hover:opacity-20 transition-opacity">
                      <DollarSign
                        className="h-12 w-12 text-blue-500"
                        strokeWidth={1}
                      />
                    </div>
                    <div className="relative">
                      <div className="flex items-center gap-1.5 mb-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"
                          style={{ animationDelay: "0.4s" }}
                        />
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                          {t("totalRealPrice")}
                        </p>
                      </div>
                      <p className="text-2xl font-black tracking-tight text-foreground tabular-nums leading-none">
                        {statistics.totalRealPrice > 0
                          ? `$${statistics.totalRealPrice.toFixed(2)}`
                          : "—"}
                      </p>
                      <p className="text-[9px] uppercase tracking-wider text-blue-500 font-bold mt-1.5">
                        {t("currencyLabel")}
                      </p>
                    </div>
                  </div>

                  {/* Stat Card: Service Price */}
                  <div className="bg-card p-4 relative overflow-hidden group hover:bg-muted/30 transition-colors duration-300">
                    <div className="absolute top-1 right-1 opacity-10 group-hover:opacity-20 transition-opacity">
                      <DollarSign
                        className="h-12 w-12 text-violet-500"
                        strokeWidth={1}
                      />
                    </div>
                    <div className="relative">
                      <div className="flex items-center gap-1.5 mb-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"
                          style={{ animationDelay: "0.6s" }}
                        />
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                          {t("totalServicePrice")}
                        </p>
                      </div>
                      <p className="text-2xl font-black tracking-tight text-foreground tabular-nums leading-none">
                        {statistics.totalServicePrice > 0
                          ? `$${statistics.totalServicePrice.toFixed(2)}`
                          : "—"}
                      </p>
                      <p className="text-[9px] uppercase tracking-wider text-violet-500 font-bold mt-1.5">
                        {t("currencyLabel")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider with label */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    {t("selectedPackagesTitle")}
                  </span>
                </div>
              </div>

              {/* Package List with tactical styling */}
              <ScrollArea className="h-[380px] pr-3">
                <div className="space-y-2">
                  {selectedPackageDetails.map((pkg, index) => (
                    <div
                      key={pkg.id}
                      className="group relative"
                      style={{
                        animation: `slideInFromRight 0.3s ease-out ${index * 0.05}s both`,
                      }}
                    >
                      {/* Hover glow effect */}
                      <div className="absolute -inset-px bg-gradient-to-r from-emerald-500/0 via-cyan-500/30 to-emerald-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />

                      <div
                        className={cn(
                          "relative flex items-center gap-3 rounded-lg border-2 border-border p-3.5",
                          "bg-card hover:bg-muted/50 transition-all duration-300",
                          "hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10",
                          "hover:translate-x-1"
                        )}
                      >
                        {/* Index badge */}
                        <div className="flex-shrink-0 w-7 h-7 rounded-md bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center border border-border group-hover:border-cyan-500/50 transition-colors duration-300">
                          <span className="text-[10px] font-black text-muted-foreground group-hover:text-cyan-500 transition-colors duration-300">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Package
                              className="h-3 w-3 text-cyan-500 flex-shrink-0"
                              strokeWidth={2.5}
                            />
                            <p className="text-sm font-black truncate text-foreground tracking-wide">
                              {pkg.barcode}
                            </p>
                          </div>
                          {pkg.description && (
                            <p className="text-[11px] text-muted-foreground truncate leading-tight">
                              {pkg.description}
                            </p>
                          )}
                          <p className="text-[9px] uppercase tracking-wider text-muted-foreground/70 font-bold mt-1.5">
                            {new Date(pkg.createdAt)
                              .toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              })
                              .toUpperCase()}
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemovePackage(pkg.id)}
                          className={cn(
                            "h-8 w-8 flex-shrink-0 rounded-md",
                            "opacity-0 group-hover:opacity-100 transition-all duration-300",
                            "text-muted-foreground hover:text-white hover:bg-destructive border border-transparent hover:border-destructive",
                            "hover:scale-110 hover:rotate-90"
                          )}
                          aria-label={`Remove ${pkg.barcode}`}
                        >
                          <X className="h-4 w-4" strokeWidth={2.5} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>

        {/* Bottom accent line */}
        {!isEmpty && (
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        )}
      </Card>

      {/* Add keyframes for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0%,
          100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(400%);
          }
        }
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
