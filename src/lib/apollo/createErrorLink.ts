import { CombinedGraphQLErrors, Observable } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";

import { isAuthError } from "@/lib/apollo/isAuthError";
import { logger } from "@/lib/logger";

export interface ErrorLinkDependencies {
  /** Refresh the session; resolves with the new access token or null. */
  refresh: () => Promise<string | null>;
  /** Whether a refresh token is available at all. */
  hasRefreshToken: () => boolean;
  /** Called once the session cannot be recovered. */
  onSessionExpired: () => void;
}

const REFRESH_OPERATION = "RefreshToken";

/**
 * Global error handling: logs failures and, for authentication errors,
 * refreshes the session once and replays the failed operation. A single
 * retry is enforced through the `authRetried` context flag.
 */
export function createErrorLink({
  refresh,
  hasRefreshToken,
  onSessionExpired,
}: ErrorLinkDependencies): ErrorLink {
  return new ErrorLink(({ error, operation, forward }) => {
    if (!CombinedGraphQLErrors.is(error)) {
      logger.error(`[Network error] ${operation.operationName}:`, error);
      return;
    }

    for (const gqlError of error.errors) {
      logger.error(
        `[GraphQL error] ${operation.operationName}: ${gqlError.message}`,
        { path: gqlError.path, locations: gqlError.locations }
      );
    }

    if (!error.errors.some(isAuthError)) return;

    const alreadyRetried = operation.getContext().authRetried === true;
    if (
      alreadyRetried ||
      operation.operationName === REFRESH_OPERATION ||
      !hasRefreshToken()
    ) {
      onSessionExpired();
      return;
    }

    return new Observable((observer) => {
      let cancelled = false;
      let subscription: { unsubscribe: () => void } | undefined;

      refresh().then(
        (token) => {
          if (cancelled) return;
          if (!token) {
            onSessionExpired();
            observer.error(error);
            return;
          }
          operation.setContext(({ headers = {} }) => ({
            headers: { ...headers, authorization: `JWT ${token}` },
            authRetried: true,
          }));
          // `forward` resumes the chain after this link, so a second auth
          // failure on the replay must be detected here.
          subscription = forward(operation).subscribe({
            next: (result) => {
              if (result.errors?.some(isAuthError)) onSessionExpired();
              observer.next(result);
            },
            error: (replayError: unknown) => observer.error(replayError),
            complete: () => observer.complete(),
          });
        },
        (refreshError: unknown) => {
          if (!cancelled) observer.error(refreshError);
        }
      );

      return () => {
        cancelled = true;
        subscription?.unsubscribe();
      };
    });
  });
}
