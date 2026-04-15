import { isValidISODate, todayISO } from "@/lib/date/todayISO";

export type DateRangeError =
  | "invalidDate"
  | "invalidDateRange"
  | "futureDate"
  | null;

export function validateDateRange(
  createdAfter: string,
  createdBefore: string
): DateRangeError {
  if (createdAfter && !isValidISODate(createdAfter)) return "invalidDate";
  if (createdBefore && !isValidISODate(createdBefore)) return "invalidDate";
  const today = todayISO();
  if (createdAfter && createdAfter > today) return "futureDate";
  if (createdBefore && createdBefore > today) return "futureDate";
  if (createdAfter && createdBefore && createdAfter > createdBefore)
    return "invalidDateRange";
  return null;
}
