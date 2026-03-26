import type {
  NotificationApiEntry,
  NotificationItem,
  NotificationsResponse,
} from "@/types/NotificationTypes";

export const NOTIFICATIONS_UNREAD_PATH = "/api/notifications/unread";

export function formatNotificationTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-CA", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export function getNotificationCategory(type: string): string {
  const t = type.toLowerCase();
  if (t === "stock_transfer") return "Inventory";
  if (t === "admin") return "System";
  return "Notifications";
}

export function getInitials(title: string): string {
  const words = title
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(" ")
    .map((w) => w.trim())
    .filter(Boolean);

  const initials = words
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return initials || "N";
}

export function parseNotificationRowsFromEnvelope(
  res: Partial<NotificationsResponse> | null | undefined,
): NotificationApiEntry[] {
  const d = res?.data as unknown;
  if (!d) return [];
  if (Array.isArray(d)) return d as NotificationApiEntry[];
  if (typeof d !== "object") return [];
  const o = d as Record<string, unknown>;
  if (Array.isArray(o.data)) return o.data as NotificationApiEntry[];
  const notifications = o.notifications as { data?: unknown } | undefined;
  if (notifications && Array.isArray(notifications.data)) {
    return notifications.data as NotificationApiEntry[];
  }
  return [];
}

export function getNotificationRows(data: NotificationsResponse): NotificationApiEntry[] {
  return parseNotificationRowsFromEnvelope(data);
}

export function mapNotification(n: NotificationApiEntry): NotificationItem {
  return {
    id: n.id,
    category: n.module ?? getNotificationCategory(n.type),
    title: n.title,
    message: n.message,
    time:
      n.display_time ??
      n.relative_time ??
      formatNotificationTime(n.delivered_at ?? n.created_at),
    linkLabel: (() => {
      if (n.action_text && n.action_text.trim()) return n.action_text.trim();
      if (n.action_url) return "View";
      const typeLower = n.type.toLowerCase();
      const titleLower = n.title.toLowerCase();
      const messageLower = n.message.toLowerCase();
      if (typeLower === "stock_transfer") {
        if (titleLower.includes("request") || messageLower.includes("pending")) {
          return "Review";
        }
        return "View";
      }
      return "Details";
    })(),
    unread: typeof n.is_read === "boolean" ? !n.is_read : n.read_at === null,
    actionUrl: (() => {
      if (n.action_url) return n.action_url;
      const typeLower = n.type.toLowerCase();
      const titleLower = n.title.toLowerCase();
      const messageLower = n.message.toLowerCase();
      if (typeLower === "stock_transfer") {
        if (titleLower.includes("request") || messageLower.includes("pending")) {
          return "/inventory/transfer-request";
        }
        return "/inventory/stock-transfer";
      }
      return null;
    })(),
  };
}
