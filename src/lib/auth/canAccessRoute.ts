import type { UserRole } from "@/types/user";

/** A route with no `allowedRoles` is open to every authenticated user. */
export function canAccessRoute(
  role: UserRole,
  allowedRoles?: readonly UserRole[]
): boolean {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  return allowedRoles.includes(role);
}
