import { UserRole } from "@/types/user";

export function getUserRoleString(role: UserRole): "admin" | "client" {
  switch (role) {
    case UserRole.ADMIN:
      return "admin";
    case UserRole.CLIENT:
      return "client";
    default:
      return "client";
  }
}

export function isAdmin(role: UserRole): boolean {
  return role === UserRole.ADMIN;
}

export function isClient(role: UserRole): boolean {
  return role === UserRole.CLIENT;
}
