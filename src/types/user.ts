export enum UserRole {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isSuperuser: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
