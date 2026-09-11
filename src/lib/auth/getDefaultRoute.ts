import { UserRole } from "@/types/user";

/** Landing route for a user after login or when denied access elsewhere. */
export function getDefaultRoute(role: UserRole): string {
  return role === UserRole.ADMIN ? "/admin/dashboard" : "/client/dashboard";
}
