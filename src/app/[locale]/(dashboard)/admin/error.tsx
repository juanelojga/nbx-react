"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

/**
 * Error boundary component for admin pages
 * Provides graceful error handling with recovery options
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Admin page error:", error);
  }, [error]);

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-destructive">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-destructive">
                Something went wrong
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                An error occurred while loading this page
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error.message && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-mono text-foreground">
                {error.message}
              </p>
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={reset}>Try again</Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/admin/dashboard")}
            >
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
