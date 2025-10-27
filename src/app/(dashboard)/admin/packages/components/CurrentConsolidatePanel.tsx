"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Package, X } from "lucide-react";
import { Package as PackageType } from "../types";
import { cn } from "@/lib/utils";

interface CurrentConsolidatePanelProps {
  selectedPackages: string[];
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
  const selectedPackageDetails = useMemo(() => {
    return packages.filter((pkg) => selectedPackages.includes(pkg.id));
  }, [packages, selectedPackages]);

  const isEmpty = selectedPackages.length === 0;

  return (
    <Card className="sticky top-6 h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Current Consolidate</CardTitle>
          {!isEmpty && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Select packages from the table to start grouping.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary */}
            <div className="rounded-lg bg-primary/5 p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Packages:</span>
                <span className="font-semibold">{selectedPackages.length}</span>
              </div>
            </div>

            <Separator />

            {/* Package List */}
            <div>
              <h4 className="mb-3 text-sm font-medium">Selected Packages</h4>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {selectedPackageDetails.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={cn(
                        "group flex items-center justify-between rounded-lg border p-3 transition-colors",
                        "hover:bg-muted/50"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {pkg.barcode}
                        </p>
                        {pkg.description && (
                          <p className="mt-1 text-xs text-muted-foreground truncate">
                            {pkg.description}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(pkg.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemovePackage(pkg.id)}
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        aria-label={`Remove ${pkg.barcode}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
