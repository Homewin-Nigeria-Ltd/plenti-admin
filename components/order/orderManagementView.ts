import { format, subDays } from "date-fns";
import api from "@/lib/api";
import { orderAcceptPath, orderDeclinePath } from "@/data/orders";
import type { Order, OrderItem } from "@/types/OrderTypes";

export type OrderStatusTab =
  | "all"
  | "pending"
  | "processing"
  | "accepted"
  | "packed"
  | "in_transit"
  | "delivered"
  | "canceled"
  | "refund_pending"
  | "refunded";

export type OrderPeriod = "today" | "7d" | "30d" | "all";

export const ORDER_STATUS_TABS: {
  id: OrderStatusTab;
  label: string;
  query?: string;
  statKey?:
    | "pending_orders"
    | "processing_orders"
    | "accepted_orders"
    | "packed_orders"
    | "in_transit_orders"
    | "shipped_orders"
    | "delivered_orders"
    | "cancelled_orders"
    | "refund_pending_orders"
    | "refunded_orders";
}[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending", query: "pending", statKey: "pending_orders" },
  { id: "processing", label: "Processing", query: "processing", statKey: "processing_orders" },
  { id: "accepted", label: "Accepted", query: "accepted", statKey: "accepted_orders" },
  { id: "packed", label: "Packed", query: "packed", statKey: "packed_orders" },
  { id: "in_transit", label: "In Transit", query: "in_transit", statKey: "in_transit_orders" },
  { id: "delivered", label: "Delivered", query: "delivered", statKey: "delivered_orders" },
  { id: "canceled", label: "Canceled", query: "cancelled", statKey: "cancelled_orders" },
  { id: "refund_pending", label: "Refund pending", query: "refund_pending", statKey: "refund_pending_orders" },
  { id: "refunded", label: "Refunded", query: "refunded", statKey: "refunded_orders" },
];

export const ORDER_PERIODS: { id: OrderPeriod; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "all", label: "All time" },
];

export const AVATAR_COLORS = [
  "#F79009",
  "#12B76A",
  "#2F5BDB",
  "#EE46BC",
  "#7A5AF8",
  "#F04438",
];

export const FALLBACK_WAREHOUSES = [
  "Port Harcourt",
  "Abuja North",
  "Kano Main",
  "Lekki",
];

export const FALLBACK_ITEM_NAMES = [
  "Samsung Galaxy A15 128GB",
  "Hisense 43\" Smart TV",
  "Ofada rice 50kg bag",
  "Thermocool 150L Chest Freezer",
];

export const FALLBACK_PHONE = "+234 809 xxx 4412";
export const FALLBACK_HEADER_ORDERS = 188;
export const FALLBACK_HEADER_REVENUE = 2184500;
export const FALLBACK_HEADER_WAITING = 4;

export function fallbackWarehouseName(seed = 0) {
  return FALLBACK_WAREHOUSES[Math.abs(seed) % FALLBACK_WAREHOUSES.length];
}

export function getDateRange(period: OrderPeriod) {
  const end = new Date();
  const toDay = (date: Date) => format(date, "yyyy-MM-dd");
  if (period === "today") {
    return { start: toDay(end), end: toDay(end), label: "Today" };
  }
  if (period === "7d") {
    return {
      start: toDay(subDays(end, 6)),
      end: toDay(end),
      label: "Last 7 days",
    };
  }
  if (period === "30d") {
    return {
      start: toDay(subDays(end, 29)),
      end: toDay(end),
      label: "Last 30 days",
    };
  }
  return { start: undefined, end: undefined, label: "All time" };
}

export function statusQueryValue(tab: OrderStatusTab) {
  return ORDER_STATUS_TABS.find((item) => item.id === tab)?.query;
}

export function normalizeStatus(status: string) {
  return (status ?? "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function statusKey(order: Order) {
  return (order.status ?? "")
    .toLowerCase()
    .replace(/-/g, "_")
    .replace(/\s+/g, "_")
    .trim();
}

export function matchesStatusTab(order: Order, tab: OrderStatusTab) {
  if (tab === "all") return true;
  const status = statusKey(order);
  const display = (order.display_status ?? "")
    .toLowerCase()
    .replace(/-/g, "_")
    .replace(/\s+/g, "_");
  const haystack = `${status} ${display}`;
  switch (tab) {
    case "pending":
      return status === "pending";
    case "processing":
      return status === "processing";
    case "accepted":
      return status === "accepted";
    case "packed":
      return status === "packed";
    case "in_transit":
      return status === "in_transit" || status === "shipped" || haystack.includes("transit");
    case "delivered":
      return (
        status === "delivered" ||
        status === "completed" ||
        haystack.includes("delivered") ||
        haystack.includes("successful")
      );
    case "canceled":
      return status === "cancelled" || status === "canceled";
    case "refund_pending":
      return status === "refund_pending";
    case "refunded":
      return status === "refunded";
    default:
      return true;
  }
}

export function customerInitial(name?: string | null) {
  const letter = (name ?? "").trim().charAt(0);
  return letter ? letter.toUpperCase() : "?";
}

export function itemProductName(item?: OrderItem | null) {
  return item?.product_name || item?.product?.name || "";
}

export function itemProductImage(item?: OrderItem | null) {
  return item?.product?.image_url || item?.product?.image_urls?.[0] || "";
}

export function itemSummary(order: Order) {
  const names = (order.items ?? []).map(itemProductName).filter(Boolean);
  if (names.length === 0) {
    return FALLBACK_ITEM_NAMES[Math.abs(order.id) % FALLBACK_ITEM_NAMES.length];
  }
  if (names.length === 1) return names[0];
  return `${names[0]} + ${names.length - 1}`;
}

export function customerAvatar(order: Order) {
  return order.user?.avatar || order.user?.avatar_url || null;
}

type WarehouseRef = { id: number; name: string };

export function soldBy(order: Order) {
  const provider = (
    order.delivery_provider_label ??
    order.delivery_selection?.provider_label ??
    order.delivery_provider ??
    ""
  ).toLowerCase();
  if (provider && !provider.includes("plenti") && !provider.includes("kwik") && !provider.includes("sendbox")) {
    return { name: order.delivery_provider_label || order.delivery_provider || "Vendor", subtitle: "Waiting on vendor", vendor: true };
  }
  return { name: "Plenti", subtitle: "Plenti stock", vendor: false };
}

function shipmentWarehouseName(order: Order, warehouses?: WarehouseRef[]) {
  const shipment =
    order.shipments?.find((row) => row.pickup_address || row.warehouse_id) ??
    order.shipments?.[0];
  if (shipment?.pickup_address?.trim()) return shipment.pickup_address.trim();
  if (shipment?.warehouse_id && warehouses?.length) {
    const match = warehouses.find((warehouse) => warehouse.id === shipment.warehouse_id);
    if (match?.name) return match.name;
  }
  return null;
}

export function shipsFrom(order: Order, warehouses?: WarehouseRef[]) {
  return (
    shipmentWarehouseName(order, warehouses) ||
    order.kwik_pickup_warehouse?.name ||
    order.shipping_address?.split(",").pop()?.trim() ||
    fallbackWarehouseName(order.id)
  );
}

export function isPaid(order: Order) {
  const status = (order.payment_status || "").toLowerCase();
  return status.includes("paid") || status.includes("success");
}

export function paymentMeta(order: Order) {
  const method = (order.payment_method || "").toLowerCase();
  const paid = isPaid(order);
  const cod =
    method.includes("cash") ||
    method.includes("cod") ||
    method.includes("pay on delivery") ||
    method.includes("pos") ||
    (!paid && !method);
  if (cod) return { key: "delivery" as const, label: "Pay on delivery", paid: false };
  if (method.includes("wallet")) {
    return { key: "wallet" as const, label: "Wallet", paid };
  }
  if (method.includes("transfer") || method.includes("bank")) {
    return { key: "transfer" as const, label: "Transfer", paid };
  }
  return { key: "card" as const, label: "Card", paid };
}

export function matchesPayment(order: Order, payment: string) {
  if (payment === "all") return true;
  return paymentMeta(order).key === payment;
}

export function matchesWarehouse(order: Order, warehouseId: string) {
  if (warehouseId === "all") return true;
  const ids = [
    order.kwik_pickup_warehouse_id,
    order.pickup_warehouse_id,
    order.kwik_pickup_warehouse?.id,
    ...(order.shipments ?? []).map((shipment) => shipment.warehouse_id),
  ]
    .filter((value) => value != null && value !== "")
    .map(String);
  return ids.includes(warehouseId);
}

export function matchesSeller(order: Order, seller: string) {
  if (seller === "all") return true;
  if (seller === "plenti") return !soldBy(order).vendor;
  return soldBy(order).vendor;
}

export function matchesPeriod(order: Order, start?: string, end?: string) {
  if (!start && !end) return true;
  const created = new Date(order.created_at);
  if (!Number.isFinite(created.getTime())) return true;
  const day = format(created, "yyyy-MM-dd");
  if (start && day < start) return false;
  if (end && day > end) return false;
  return true;
}

export function waitingMinutes(iso: string) {
  const created = new Date(iso).getTime();
  if (!Number.isFinite(created)) return 1;
  return Math.max(1, Math.round((Date.now() - created) / 60000));
}

export function waitingLabel(iso: string) {
  const minutes = waitingMinutes(iso);
  if (minutes < 60) return `Waiting ${minutes} min`;
  const hours = Math.round(minutes / 60);
  return `Waiting ${hours} hr`;
}

export function riderName(order: Order) {
  return (
    order.delivery_fulfillment?.plenti_rider_name ||
    order.rider?.name ||
    order.plenti_delivery?.rider_name ||
    order.payment_gateway_response?.rider_info?.rider_name ||
    null
  );
}

export function riderCell(order: Order) {
  const name = riderName(order);
  if (name) return { text: name, tone: "default" as const };
  const seller = soldBy(order);
  if (seller.vendor) {
    return {
      text: `Vendor hasn't accepted · ${waitingMinutes(order.created_at)}`,
      tone: "danger" as const,
    };
  }
  const status = normalizeStatus(`${order.status} ${order.display_status ?? ""}`);
  if (
    status.includes("pending") ||
    status.includes("processing") ||
    status.includes("accepted") ||
    status.includes("packed")
  ) {
    return { text: waitingLabel(order.created_at), tone: "muted" as const };
  }
  return { text: waitingLabel(order.created_at), tone: "muted" as const };
}

export function statusLabel(order: Order) {
  const status = normalizeStatus(order.status || order.display_status || "");
  if (status.includes("refund pending")) return "Refund pending";
  if (status === "refunded") return "Refunded";
  if (status.includes("pending")) return "Pending";
  if (status.includes("accepted")) return "Accepted";
  if (status.includes("packed")) return "Packed";
  if (status.includes("processing")) return "Processing";
  if (status.includes("shipped") || status.includes("transit")) return "In Transit";
  if (status.includes("delivered") || status.includes("completed") || status.includes("successful")) {
    return "Delivered";
  }
  if (status.includes("cancel")) return "Canceled";
  if (!status) return "Pending";
  return status.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function statusTone(label: string) {
  const value = label.toLowerCase();
  if (value === "pending" || value === "refund pending") return "text-[#F79009]";
  if (value === "processing") return "text-[#F38744]";
  if (value === "accepted" || value === "packed" || value === "in transit") {
    return "text-[#2F5BDB]";
  }
  if (value === "delivered" || value === "refunded") return "text-[#12B76A]";
  if (value === "canceled") return "text-[#F04438]";
  return "text-[#667085]";
}

export function formatOrderDay(iso: string) {
  try {
    return format(new Date(iso), "d MMM yyyy");
  } catch {
    return iso;
  }
}

export function formatOrderTime(iso: string) {
  try {
    return format(new Date(iso), "h:mm a");
  } catch {
    return "";
  }
}

export function orderDayLabel(order: Order) {
  return order.order_date || order.date_placed || formatOrderDay(order.created_at);
}

export function orderTimeLabel(order: Order) {
  return order.order_time || order.time_placed || formatOrderTime(order.created_at);
}

function warehouseIdFrom(value?: string | number | null) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function apiErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null) {
    const response = (error as { response?: { data?: { message?: unknown } } })
      .response;
    const message = response?.data?.message;
    if (typeof message === "string" && message.trim()) return message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export async function acceptPlentiOrder(
  order: Order,
  warehouseId?: string | number,
) {
  const warehouse_id =
    warehouseIdFrom(warehouseId) ??
    warehouseIdFrom(order.kwik_pickup_warehouse_id) ??
    warehouseIdFrom(order.pickup_warehouse_id) ??
    warehouseIdFrom(order.shipments?.[0]?.warehouse_id);
  try {
    const { data } = await api.post<{ status?: string; message?: string }>(
      orderAcceptPath(order.id),
      warehouse_id ? { warehouse_id } : {},
    );
    if (data?.status === "error" || data?.status === "failed") {
      throw new Error(data?.message ?? "Failed to accept order");
    }
  } catch (error) {
    throw new Error(apiErrorMessage(error, "Failed to accept order"));
  }
}

export async function declinePlentiOrder(
  order: Order,
  payload: { reason: string; message?: string },
) {
  const body: Record<string, string> = { reason: payload.reason };
  const message = payload.message?.trim();
  if (message) body.message = message;
  try {
    const { data } = await api.post<{ status?: string; message?: string }>(
      orderDeclinePath(order.id),
      body,
    );
    if (data?.status === "error" || data?.status === "failed") {
      throw new Error(data?.message ?? "Failed to decline order");
    }
  } catch (error) {
    throw new Error(apiErrorMessage(error, "Failed to decline order"));
  }
}

export function ordersToCsv(orders: Order[]) {
  const header = [
    "Order",
    "Date",
    "Time",
    "Customer",
    "Items",
    "Sold by",
    "Ships from",
    "Amount",
    "Payment",
    "Status",
    "Rider",
  ];
  const rows = orders.map((order) => {
    const seller = soldBy(order);
    const payment = paymentMeta(order);
    return [
      order.order_number,
      orderDayLabel(order),
      orderTimeLabel(order),
      order.user?.name ?? "",
      itemSummary(order),
      seller.name,
      shipsFrom(order),
      String(Number(order.total) || 0),
      payment.label,
      statusLabel(order),
      riderCell(order).text,
    ];
  });
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  return [header, ...rows].map((row) => row.map(escape).join(",")).join("\n");
}
