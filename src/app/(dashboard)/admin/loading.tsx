import { Card, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

/**
 * Loading component for admin pages
 * Provides a consistent loading experience with Suspense boundaries
 */
export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 animate-pulse rounded bg-muted"></div>
        <div className="h-4 w-96 animate-pulse rounded bg-muted"></div>
      </div>

      {/* Content Loading Indicator */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
