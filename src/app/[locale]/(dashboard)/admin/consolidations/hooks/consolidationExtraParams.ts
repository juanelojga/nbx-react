import { isValidISODate, todayISO } from "@/lib/date/todayISO";
import type { ExtraParamsCodec } from "@/lib/table/table-url-state.types";

export interface ConsolidationExtraParams {
  /** Status filter; "all" means no filter. */
  status: string;
  /** YYYY-MM-DD or empty. */
  createdAfter: string;
  /** YYYY-MM-DD or empty. */
  createdBefore: string;
}

/**
 * Status + creation date range for the consolidations list.
 *
 * Date semantics: when neither date param is in the URL the range defaults to
 * today/today; an explicit clear writes both params as empty strings so the
 * next parse does not re-apply the default. Malformed or inverted ranges fall
 * back to today/today.
 */
export const consolidationExtraParams: ExtraParamsCodec<ConsolidationExtraParams> =
  {
    parse(params) {
      const status = params.get("status") || "all";

      if (!params.has("createdAfter") && !params.has("createdBefore")) {
        const today = todayISO();
        return { status, createdAfter: today, createdBefore: today };
      }

      const rawAfter = params.get("createdAfter") ?? "";
      const rawBefore = params.get("createdBefore") ?? "";
      let createdAfter = isValidISODate(rawAfter) ? rawAfter : "";
      let createdBefore = isValidISODate(rawBefore) ? rawBefore : "";
      if (createdAfter && createdBefore && createdAfter > createdBefore) {
        const today = todayISO();
        createdAfter = today;
        createdBefore = today;
      }
      return { status, createdAfter, createdBefore };
    },

    apply(params, patch, current) {
      if (patch.status !== undefined) {
        if (patch.status !== "all") params.set("status", patch.status);
        else params.delete("status");
      }
      if (
        patch.createdAfter !== undefined ||
        patch.createdBefore !== undefined
      ) {
        params.set("createdAfter", patch.createdAfter ?? current.createdAfter);
        params.set(
          "createdBefore",
          patch.createdBefore ?? current.createdBefore
        );
      }
    },
  };
