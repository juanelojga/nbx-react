/**
 * Get the default route for a user based on their role
 */
export function getDefaultRoute(role: "admin" | "client"): string {
  return role === "admin" ? "/admin/dashboard" : "/client/dashboard";
}

/**
 * Check if a user has permission to access a specific route
 */
export function canAccessRoute(
  userRole: "admin" | "client",
  allowedRoles?: Array<"admin" | "client">
): boolean {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true; // No restrictions
  }

  return allowedRoles.includes(userRole);
}
