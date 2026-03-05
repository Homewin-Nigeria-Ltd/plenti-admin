import type { AccountSettingsUser } from "@/types/UserTypes";

type AccountLike =
  | AccountSettingsUser
  | (AccountSettingsUser & {
      permissions_list?: string[];
      roles?: Array<{
        slug?: string;
        permissions?: Array<{ slug?: string }>;
      }>;
    })
  | null
  | undefined;

export function hasRole(account: AccountLike, roleSlug: string): boolean {
  if (!account?.roles?.length) return false;
  return account.roles.some((role) => role.slug === roleSlug);
}

export function hasAnyRole(account: AccountLike, roleSlugs: string[]): boolean {
  return roleSlugs.some((roleSlug) => hasRole(account, roleSlug));
}

export function hasPermission(
  account: AccountLike,
  permissionSlug: string,
): boolean {
  if (!account) return false;

  const accountWithPermissions = account as AccountSettingsUser & {
    permissions_list?: string[];
  };

  if (
    Array.isArray(accountWithPermissions.permissions) &&
    accountWithPermissions.permissions.includes(permissionSlug)
  ) {
    return true;
  }

  if (!account.roles?.length) return false;

  return account.roles.some((role) =>
    Array.isArray(
      (role as { permissions?: Array<{ slug?: string }> }).permissions,
    )
      ? (
          (role as { permissions?: Array<{ slug?: string }> }).permissions ?? []
        ).some((permission) => permission.slug === permissionSlug)
      : false,
  );
}

export function hasAnyPermission(
  account: AccountLike,
  permissionSlugs: string[],
): boolean {
  return permissionSlugs.some((permissionSlug) =>
    hasPermission(account, permissionSlug),
  );
}
