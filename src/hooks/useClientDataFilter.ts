"use client";

import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import { logger } from "@/lib/logger";

/**
 * Hook for filtering data to show only the current user's data
 *
 * WARNING: This is a client-side filter as a temporary measure.
 * The backend should properly filter data by user permissions.
 * TODO: Remove this once backend adds proper restrictions
 *
 * @example
 * ```tsx
 * const { data } = useQuery(GET_ALL_CONSOLIDATIONS);
 * const filteredData = useClientDataFilter(
 *   data?.allConsolidates,
 *   (item) => item.client?.email
 * );
 * ```
 */
export function useClientDataFilter<T>(
  data: T[] | undefined | null,
  getOwnerIdentifier: (item: T) => string | null | undefined
): T[] {
  const { user } = useAuth();

  return useMemo(() => {
    // If no data, return empty array
    if (!data) return [];

    // Admin users can see all data
    if (user?.role === UserRole.ADMIN) {
      return data;
    }

    // Client users should only see their own data
    // Warn about the security concern
    if (process.env.NODE_ENV === "development") {
      logger.warn(
        "[useClientDataFilter] Backend does not filter data by client. " +
          "Applying client-side filter as temporary measure. " +
          "TODO: Add backend filtering for production."
      );
    }

    if (!user?.email) {
      return [];
    }

    return data.filter((item) => {
      const ownerId = getOwnerIdentifier(item);
      return ownerId === user.email;
    });
  }, [data, user, getOwnerIdentifier]);
}

/**
 * Hook to check if user can access a specific resource
 *
 * @example
 * ```tsx
 * const canAccess = useCanAccessResource(
 *   consolidation?.client?.email
 * );
 * ```
 */
export function useCanAccessResource(
  resourceOwnerEmail: string | null | undefined
): boolean {
  const { user } = useAuth();

  return useMemo(() => {
    // Admin users can access everything
    if (user?.role === UserRole.ADMIN) {
      return true;
    }

    // Client users can only access their own resources
    if (!user?.email || !resourceOwnerEmail) {
      return false;
    }

    return user.email === resourceOwnerEmail;
  }, [user, resourceOwnerEmail]);
}

/**
 * Hook that returns warning info about backend filtering
 * Use this to display warnings in the UI
 */
export function useBackendFilteringWarning(): {
  shouldWarn: boolean;
  warningMessage: string;
} {
  const { user } = useAuth();

  return useMemo(() => {
    const shouldWarn = user?.role === UserRole.CLIENT;

    return {
      shouldWarn,
      warningMessage: shouldWarn
        ? "Note: Data filtering is applied client-side. Contact support if you see data that doesn't belong to you."
        : "",
    };
  }, [user]);
}
