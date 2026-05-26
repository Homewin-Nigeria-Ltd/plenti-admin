export const RIDERS_API = {
  list: "/api/admin/riders",
  onboarding: "/api/admin/riders/onboarding",
} as const;

export function riderDetailPath(id: number | string): string {
  return `${RIDERS_API.list}/${id}`;
}

export function riderSuspendPath(id: number | string): string {
  return `${RIDERS_API.list}/${id}/suspend`;
}

export function riderApprovePath(id: number | string): string {
  return `${RIDERS_API.list}/${id}/approve`;
}

export function riderRejectPath(id: number | string): string {
  return `${RIDERS_API.list}/${id}/reject`;
}
