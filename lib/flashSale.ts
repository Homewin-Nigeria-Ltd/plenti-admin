import type { FlashSale, FlashSaleItem, FlashSaleStatus } from "@/types/FlashSaleTypes";

export function toDateInput(value?: string | null) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value.slice(0, 10);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
}

export function toApiDate(value: string) {
  return value.slice(0, 10);
}

export function formatSaleDateTime(value?: string | null) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function resolveFlashSaleStatus(sale: {
  is_active: boolean;
  starts_at: string;
  ends_at: string;
  status?: string | null;
}): FlashSaleStatus {
  const raw = sale.status?.toLowerCase().trim();
  if (
    raw === "scheduled" ||
    raw === "running" ||
    raw === "ended" ||
    raw === "off"
  ) {
    return raw;
  }

  if (!sale.is_active) return "off";

  const now = Date.now();
  const start = new Date(sale.starts_at).getTime();
  const end = new Date(sale.ends_at).getTime();
  if (!Number.isNaN(end) && now > end) return "ended";
  if (!Number.isNaN(start) && now < start) return "scheduled";
  return "running";
}

export function flashSaleItemName(item: FlashSaleItem) {
  return (
    item.product?.name?.trim() ||
    item.product_name?.trim() ||
    `Product #${item.product_id}`
  );
}

export function flashSaleItemsCount(sale: FlashSale) {
  if (typeof sale.items_count === "number") return sale.items_count;
  if (Array.isArray(sale.items)) return sale.items.length;
  return 0;
}
