export const USER_MANAGEMENT_API = {
  list: "/api/admin/user-management",
} as const;

export function userManagementDetailPath(id: number | string): string {
  return `${USER_MANAGEMENT_API.list}/${id}`;
}
