"use client";

import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Package as PackageIcon, X } from "lucide-react";
import { Package } from "../types";

interface PackagesTableProps {
  packages: Package[];
  selectedPackages: string[];
  onSelectionChange: (packageIds: string[]) => void;
  isLoading: boolean;
}

export function PackagesTable({
  packages,
  selectedPackages,
  onSelectionChange,
  isLoading,
}: PackagesTableProps) {
  const allSelected = useMemo(() => {
    return packages.length > 0 && selectedPackages.length === packages.length;
  }, [packages.length, selectedPackages.length]);

  const someSelected = useMemo(() => {
    return selectedPackages.length > 0 && !allSelected;
  }, [selectedPackages.length, allSelected]);

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(packages.map((pkg) => pkg.id));
    }
  };

  const handleSelectPackage = (packageId: string) => {
    if (selectedPackages.includes(packageId)) {
      onSelectionChange(selectedPackages.filter((id) => id !== packageId));
    } else {
      onSelectionChange([...selectedPackages, packageId]);
    }
  };

  const handleClearSelection = () => {
    onSelectionChange([]);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <div className="h-4 w-4 animate-pulse rounded bg-muted"></div>
                </TableHead>
                <TableHead>Barcode</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="h-4 w-4 animate-pulse rounded bg-muted"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-40 animate-pulse rounded bg-muted"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // Empty state
  if (packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
        <div className="mb-6 rounded-full bg-primary/10 p-6">
          <PackageIcon className="h-16 w-16 text-primary/60" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          No Unassigned Packages
        </h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          No unassigned packages for this client. All packages may already be
          consolidated or there are no packages yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all packages"
                  className={
                    someSelected ? "data-[state=checked]:bg-primary/50" : ""
                  }
                />
              </TableHead>
              <TableHead>Barcode</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map((pkg) => {
              const isSelected = selectedPackages.includes(pkg.id);
              return (
                <TableRow
                  key={pkg.id}
                  className={
                    isSelected
                      ? "bg-primary/5 hover:bg-primary/10"
                      : "hover:bg-muted/50"
                  }
                >
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleSelectPackage(pkg.id)}
                      aria-label={`Select package ${pkg.barcode}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{pkg.barcode}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {pkg.description || "—"}
                  </TableCell>
                  <TableCell>
                    {new Date(pkg.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Selection Actions Bar */}
      {selectedPackages.length > 0 && (
        <div className="sticky bottom-4 z-10 flex items-center justify-between rounded-lg border bg-background p-4 shadow-lg">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              {selectedPackages.length} package
              {selectedPackages.length !== 1 ? "s" : ""} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearSelection}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear Selection
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Select packages to add to consolidation group
          </div>
        </div>
      )}
    </div>
  );
}
