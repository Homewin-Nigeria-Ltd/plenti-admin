export const RIDERS_API = {
  list: "/api/admin/rider-management/riders",
  create: "/api/admin/rider-management/riders",
  onboarding: "/api/admin/rider-management/onboarding",
} as const;

export function riderDetailPath(id: number | string): string {
  return `/api/admin/rider-management/riders/${id}`;
}

export function riderApplicationReviewPath(id: number | string): string {
  return `/api/admin/rider-management/riders/${id}/application-review`;
}

export function riderSuspendPath(id: number | string): string {
  return `/api/admin/rider-management/riders/${id}/suspend`;
}

export function riderApprovePath(id: number | string): string {
  return `/api/admin/rider-management/riders/${id}/approve`;
}

export function riderRejectPath(id: number | string): string {
  return `/api/admin/rider-management/riders/${id}/reject`;
}

export function riderUnsuspendPath(id: number | string): string {
  return `/api/admin/rider-management/riders/${id}/unsuspend`;
}

export function riderReassignOrderPath(id: number | string): string {
  return `/api/admin/rider-management/riders/${id}/reassign-order`;
}

export const RIDER_CHAT_API = {
  conversations: "/api/admin/rider-management/chat/conversations",
  staff: "/api/admin/rider-management/chat/staff",
} as const;

export function riderChatOpenPath(riderId: number | string): string {
  return `/api/admin/rider-management/riders/${riderId}/chat/open`;
}

export function riderChatMessagesPath(deliveryId: number | string): string {
  return `/api/admin/rider-management/chat/conversations/${deliveryId}/messages`;
}
