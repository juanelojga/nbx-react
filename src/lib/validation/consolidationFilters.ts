import { isValidISODate } from "@/lib/date/todayISO";

export type DateRangeError = "invalidDate" | "invalidDateRange" | null;

export function validateDateRange(
  createdAfter: string,
  createdBefore: string
): DateRangeError {
  if (createdAfter && !isValidISODate(createdAfter)) return "invalidDate";
  if (createdBefore && !isValidISODate(createdBefore)) return "invalidDate";
  if (createdAfter && createdBefore && createdAfter > createdBefore)
    return "invalidDateRange";
  return null;
}
