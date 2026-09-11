import type { ReactNode } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/data-display/page-header";

interface ListPageShellProps {
  title: string;
  description: string;
  /** Buttons rendered opposite the page header. */
  actions?: ReactNode;
  errorMessage?: string | null;
  children: ReactNode;
}

/** Header row + card body shared by the admin list pages. */
export function ListPageShell({
  title,
  description,
  actions,
  errorMessage,
  children,
}: ListPageShellProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title={title} description={description} />
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>

      <Card>
        <CardContent className="p-6">
          {errorMessage && (
            <Alert variant="destructive" className="mb-6" role="alert">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
