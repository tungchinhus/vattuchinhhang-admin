export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: Date;
}

export enum UserRole {
  SELLER = 'seller',
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  SUPER_ADMIN = 'super_admin'
}

export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

// Role display names
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  [UserRole.SELLER]: 'Người bán',
  [UserRole.ADMIN]: 'Quản trị viên',
  [UserRole.CUSTOMER]: 'Khách hàng',
  [UserRole.SUPER_ADMIN]: 'Siêu quản trị viên'
};
