import type {
  NotificationApiEntry,
  NotificationsPaginatedData,
  NotificationsResponse,
} from "@/types/NotificationTypes";

export const NOTIFICATIONS_ENDPOINT = "/api/admin/notifications";
export const NOTIFICATIONS_UNREAD_ENDPOINT = `${NOTIFICATIONS_ENDPOINT}/unread`;
export const NOTIFICATION_SETTINGS_ENDPOINT = `${NOTIFICATIONS_ENDPOINT}/settings`;

type NotificationModuleRoute = {
  name: string;
  href: string;
  keywords: string[];
};

const NOTIFICATION_MODULES: NotificationModuleRoute[] = [
  { name: "Dashboard", href: "/dashboard", keywords: ["dashboard"] },
  { name: "Inventory Management", href: "/inventory", keywords: ["inventory", "warehouse"] },
  {
    name: "Stock Transfer",
    href: "/inventory/stock-transfer",
    keywords: ["stock transfer", "in_transit", "transfer approved", "transfer declined"],
  },
  {
    name: "Transfer Request",
    href: "/inventory/transfer-request",
    keywords: ["transfer request", "pending approval", "new stock transfer request", "pending"],
  },
  { name: "Product Management", href: "/product", keywords: ["product", "sku", "catalog"] },
  { name: "Order Management", href: "/order", keywords: ["order", "checkout", "ord-"] },
  { name: "Finance Management", href: "/finance", keywords: ["finance", "payment", "withdrawal"] },
  { name: "Marketing & Engagement", href: "/marketing", keywords: ["marketing", "campaign", "banner"] },
  { name: "Sales Management", href: "/sales", keywords: ["sales", "target", "commission"] },
  { name: "User Management", href: "/user?type=customer", keywords: ["user", "customer", "account"] },
  { name: "Customer Support", href: "/customer", keywords: ["support", "ticket", "complaint"] },
  { name: "Systems Configuration", href: "/configuration", keywords: ["configuration", "settings", "system"] },
];

function asPositiveId(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function parseAdminResourcePath(
  actionUrl: string | null | undefined,
): { resource: string; id: number } | null {
  if (!actionUrl) return null;
  try {
    const path = actionUrl.startsWith("http")
      ? new URL(actionUrl).pathname
      : actionUrl;
    const match = path.match(
      /(?:^|\/)(?:admin\/)?(orders|deliveries|riders)\/(\d+)/i,
    );
    if (!match) return null;
    const id = asPositiveId(match[2]);
    if (id == null) return null;
    return { resource: match[1].toLowerCase(), id };
  } catch {
    return null;
  }
}

export function resolveNotificationActionUrl(n: NotificationApiEntry): string | null {
  const payload = n.data ?? {};
  const orderId = asPositiveId(payload.order_id);
  const riderId = asPositiveId(payload.rider_id);
  const parsed = parseAdminResourcePath(n.action_url);

  if (parsed?.resource === "orders") return `/order?orderId=${parsed.id}`;
  if (parsed?.resource === "riders") return `/rider?riderId=${parsed.id}`;
  if (parsed?.resource === "deliveries") {
    if (orderId) return `/order?orderId=${orderId}`;
    if (riderId) return `/rider?riderId=${riderId}`;
    return "/rider";
  }

  if (orderId) return `/order?orderId=${orderId}`;
  if (riderId) return `/rider?riderId=${riderId}`;

  const lower = (n.title ?? "").toLowerCase();
  for (const mod of NOTIFICATION_MODULES) {
    if (mod.keywords.some((keyword) => lower.includes(keyword))) {
      return mod.href;
    }
  }
  return null;
}

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

export function getNotificationPaginationMeta(
  res: Partial<NotificationsResponse> | null | undefined,
): { currentPage: number; lastPage: number } {
  const d = res?.data as unknown;
  if (!d || typeof d !== "object") return { currentPage: 1, lastPage: 1 };
  const o = d as Record<string, unknown>;
  const paginated = o.notifications as NotificationsPaginatedData | undefined;
  if (paginated) {
    return {
      currentPage: Number(paginated.current_page) || 1,
      lastPage: Number(paginated.last_page) || 1,
    };
  }
  return {
    currentPage: Number(o.current_page) || 1,
    lastPage: Number(o.last_page) || 1,
  };
}

export function getUnreadNotificationCount(
  res: Partial<NotificationsResponse> | null | undefined,
): number {
  const d = res?.data as unknown;
  if (!d || typeof d !== "object") return 0;
  const o = d as Record<string, unknown>;
  const summary = o.summary as { unread?: unknown } | undefined;
  if (summary && typeof summary.unread === "number") return summary.unread;
  const tabs = o.tabs as { unread?: unknown } | undefined;
  if (tabs && typeof tabs.unread === "number") return tabs.unread;
  return 0;
}

