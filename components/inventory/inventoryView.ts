import type { InventoryItemApi, WarehouseApi } from "@/types/InventoryTypes";

export type StockCellTone = "out" | "low" | "ok" | "elsewhere";

export const FALLBACK_WAREHOUSES = [
  { id: 1, name: "Abuja North" },
  { id: 2, name: "Port Harcourt" },
  { id: 3, name: "Kano Main" },
] as const;

export const MOCK_SUPPLIERS = [
  {
    id: "primeline",
    name: "Primeline Electronics",
    contact: "Emeka Nwosu",
    phone: "+234 803 ••• 1190",
    address: "[Supplier address], Wuse II, Abuja",
    pastDeliveries: 14,
    lastOn: "28 Oct",
  },
  {
    id: "northstar",
    name: "Northstar Foods",
    contact: "Amina Bello",
    phone: "+234 802 ••• 4410",
    address: "[Supplier address], Ikeja, Lagos",
    pastDeliveries: 9,
    lastOn: "12 Oct",
  },
] as const;

export const TRANSFER_REASONS = [
  "Restock destination",
  "Balancing stock",
  "Customer demand",
  "Damaged or short at destination",
  "Other",
] as const;

export function warehouseColumns(warehouses: WarehouseApi[]) {
  if (warehouses.length > 0) {
    return warehouses.map((w) => ({ id: w.id, name: w.name }));
  }
  return FALLBACK_WAREHOUSES.map((w) => ({ id: w.id, name: w.name }));
}

export function qtyAtWarehouse(
  item: InventoryItemApi,
  warehouseId: number,
  warehouses?: Array<{ id: number }>,
): number {
  const list = item.warehouses_list;
  if (Array.isArray(list) && list.length > 0) {
    const match = list.find((w) => Number(w.id) === Number(warehouseId));
    return Number(match?.quantity) || 0;
  }
  if (warehouses?.[0] && Number(warehouses[0].id) === Number(warehouseId)) {
    return Number(item.stock) || 0;
  }
  return 0;
}

export function stockCellTone(qty: number): StockCellTone {
  if (qty <= 0) return "out";
  if (qty < 40) return "low";
  return "ok";
}

export function stockCellClass(tone: StockCellTone): string {
  if (tone === "out") return "text-[#B42318] font-semibold";
  if (tone === "low") return "text-[#B54708] font-semibold";
  if (tone === "elsewhere") return "text-[#B42318] font-semibold";
  return "text-[#027A48] font-semibold";
}

export function stockChipClass(tone: StockCellTone): string {
  if (tone === "out") return "border-[#FECDCA] bg-[#FEF3F2] text-[#B42318]";
  if (tone === "low") return "border-[#FEDF89] bg-[#FFFAEB] text-[#B54708]";
  if (tone === "elsewhere") return "border-[#A6F4C5] bg-[#ECFDF3] text-[#027A48]";
  return "border-[#A6F4C5] bg-[#ECFDF3] text-[#027A48]";
}

export function relativeTimeLabel(iso: string | null | undefined): string {
  if (!iso) return "2 hours ago";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "2 hours ago";
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function transferStatusLabel(status: string): {
  label: string;
  className: string;
} {
  const value = (status || "").toLowerCase();
  if (value === "pending" || value === "waiting" || value === "requested") {
    return {
      label: "Waiting for approval",
      className: "bg-[#FFFAEB] text-[#B54708]",
    };
  }
  if (value === "in_transit" || value === "on_the_road") {
    return {
      label: "On the road",
      className: "bg-[#EEF4FF] text-[#3538CD]",
    };
  }
  if (value === "completed" || value === "received") {
    return { label: "Received", className: "bg-[#ECFDF3] text-[#027A48]" };
  }
  if (value === "rejected" || value === "cancelled") {
    return { label: "Rejected", className: "bg-[#FEF3F2] text-[#B42318]" };
  }
  return {
    label: status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "-",
    className: "bg-[#F2F4F7] text-[#344054]",
  };
}

export function naira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "P";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
