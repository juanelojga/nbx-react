import type { BackendUser } from "@/graphql/queries/auth";
import { type User, UserRole } from "@/types/user";

/** Superusers are admins; everyone else is a client. */
export function mapBackendUser(backendUser: BackendUser): User {
  return {
    id: backendUser.id,
    email: backendUser.email,
    firstName: backendUser.firstName,
    lastName: backendUser.lastName,
    role: backendUser.isSuperuser ? UserRole.ADMIN : UserRole.CLIENT,
    isSuperuser: backendUser.isSuperuser,
  };
}
