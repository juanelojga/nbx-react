"use client";

import { RouteErrorFallback } from "@/components/common/RouteErrorFallback";

export default function AdminError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteErrorFallback {...props} homeHref="/admin/dashboard" />;
}
