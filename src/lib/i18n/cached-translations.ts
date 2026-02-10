/**
 * Cached Translation Utilities
 *
 * Implements React.cache() for per-request deduplication of translation loading.
 * This prevents multiple calls to getLocale() and getMessages() within the same request.
 *
 * Benefits:
 * - Reduces redundant file system reads for translation files
 * - Improves server response times by caching translations per request
 * - Follows Vercel Best Practices 3.6 - Per-Request Deduplication
 *
 * @see https://react.dev/reference/react/cache
 * @see https://vercel.com/blog/react-best-practices#3-6-per-request-deduplication-with-react-cache
 */

import { cache } from "react";
import { getLocale as getLocaleOriginal } from "next-intl/server";
import { getMessages as getMessagesOriginal } from "next-intl/server";

/**
 * Cached version of getLocale()
 * Ensures locale is only determined once per request, even if called multiple times
 */
export const getLocale = cache(async () => {
  return getLocaleOriginal();
});

/**
 * Cached version of getMessages()
 * Ensures translation messages are only loaded once per request
 */
export const getMessages = cache(async () => {
  return getMessagesOriginal();
});
