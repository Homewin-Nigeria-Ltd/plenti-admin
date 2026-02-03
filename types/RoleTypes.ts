/** Single permission from GET {{base_url}}/api/admin/permissions (each module array) */
export type PermissionItem = {
  id: number;
  name: string;
  slug: string;
  module: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

/** Permissions grouped by module from GET {{base_url}}/api/admin/permissions (data) */
export type PermissionsByModule = Record<string, PermissionItem[]>;

/** Permission from GET {{base_url}}/api/admin/roles (role.permissions[]) */
export type RolePermission = PermissionItem & {
  pivot?: {
    role_id: number;
    permission_id: number;
    created_at: string;
    updated_at: string;
  };
};

/** Role from GET {{base_url}}/api/admin/roles (data[]) */
export type Role = {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
  permissions: RolePermission[];
};

export type RolesState = {
  roles: Role[];
  loadingRoles: boolean;
  rolesError: string | null;
  fetchRoles: () => Promise<boolean>;
};
