"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

import { ErrorBoundaryFallback } from "@/components/common/ErrorBoundaryFallback";
import { logger } from "@/lib/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Catches render errors anywhere below it, logs them and shows a recoverable
 * fallback instead of unmounting the whole tree.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error("ErrorBoundary caught an error", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  override render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <ErrorBoundaryFallback
            message={this.state.error?.message}
            onRetry={this.handleRetry}
          />
        )
      );
    }
    return this.props.children;
  }
}
