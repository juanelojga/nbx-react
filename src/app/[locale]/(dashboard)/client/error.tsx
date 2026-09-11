"use client";

import { RouteErrorFallback } from "@/components/common/RouteErrorFallback";

export default function ClientError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteErrorFallback {...props} homeHref="/client/dashboard" />;
}
