import api from "@/lib/api";
import {
  INVENTORY_API,
  inventoryTransferApprovePath,
  inventoryTransferRejectPath,
} from "@/data/inventory";
import type {
  TransferRequestsResponse,
  TransferRequestApiEntry,
} from "@/types/InventoryTypes";
import { parseTransferRequestsResponse } from "@/types/InventoryTypes";
import { toast } from "sonner";
import { create } from "zustand";

function getApiErrorMessage(err: unknown): string | null {
  if (typeof err !== "object" || err === null) return null;
  const response = (err as { response?: { data?: { message?: unknown } } }).response;
  const msg = response?.data?.message;
  return typeof msg === "string" ? msg : null;
}

type TransferActionResponse = { status?: string; message?: string };

export type TransferRequestRow = {
  apiId: number;
  id: string;
  status: "awaiting_approval" | "approved" | "rejected" | "complete";
  product: string;
  quantity: number;
  sourceWarehouse: string;
  destinationWarehouse: string;
  date: string;
  note: string;
};

function formatRequestDate(iso: string | undefined): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return "—";
  }
}

function mapStatus(raw: string | undefined): TransferRequestRow["status"] {
  const s = (raw ?? "").toLowerCase();
  if (s.includes("reject") || s.includes("declin")) return "rejected";
  if (s === "complete" || s === "completed") return "complete";
  if (
    s === "approved" ||
    s.includes("approved")
  )
    return "approved";
  if (
    s.includes("pending") ||
    s.includes("await") ||
    s.includes("request") ||
    !s
  )
    return "awaiting_approval";
  return "awaiting_approval";
}

export function mapTransferRequestApiToRow(entry: TransferRequestApiEntry): TransferRequestRow {
  const source =
    entry.source_warehouse?.name ??
    entry.from_warehouse?.name ??
    "—";
  const dest =
    entry.destination_warehouse?.name ??
    entry.to_warehouse?.name ??
    "—";

  let product = "—";
  let quantity = 0;
  if (entry.items?.length) {
    const names = entry.items
      .map((i) => i.product?.name)
      .filter((n): n is string => Boolean(n));
    product =
      names.length === 1
        ? names[0]!
        : names.length > 1
          ? `${names.length} products`
          : "Multiple items";
    quantity = entry.items.reduce(
      (sum, i) => sum + (Number(i.quantity ?? i.qty) || 0),
      0,
    );
  } else {
    product = entry.product?.name ?? "—";
    quantity = Number(entry.quantity) || 0;
  }

  const idLabel =
    entry.reference ??
    entry.request_number ??
    `TRF ${String(entry.id).padStart(3, "0")}`;

  return {
    apiId: entry.id,
    id: idLabel,
    status: mapStatus(entry.ui_status ?? entry.status),
    product,
    quantity,
    sourceWarehouse: source,
    destinationWarehouse: dest,
    date: formatRequestDate(entry.created_at),
    note: (entry.note ?? entry.notes ?? "").trim() || "—",
  };
}

type TransferRequestsStore = {
  requests: TransferRequestRow[];
  loading: boolean;
  page: number;
  lastPage: number;
  total: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  fetchTransferRequests: (pageNum: number) => Promise<void>;
  refreshTransferRequests: () => void;
  approveTransferRequest: (transferId: number, reason?: string) => Promise<boolean>;
  rejectTransferRequest: (transferId: number, reason: string) => Promise<boolean>;
};

export const useTransferRequestsStore = create<TransferRequestsStore>((set, get) => ({
  requests: [],
  loading: false,
  page: 1,
  lastPage: 1,
  total: 0,

  setPage: (next) => {
    const current = get().page;
    const page = typeof next === "function" ? next(current) : next;
    set({ page });
  },

  fetchTransferRequests: async (pageNum: number) => {
    set({ loading: true });
    try {
      const { data } = await api.get<TransferRequestsResponse>(
        INVENTORY_API.transferRequests,
        { params: { page: pageNum, per_page: 20 } },
      );
      const ok = data?.status === "success" || data?.data != null;
      if (ok && data?.data != null) {
        const { rows, lastPage, total } = parseTransferRequestsResponse(data);
        set({
          requests: rows.map(mapTransferRequestApiToRow),
          lastPage,
          total,
        });
      } else {
        set({ requests: [] });
      }
    } catch (err) {
      console.error("Transfer requests fetch error:", err);
      toast.error("Failed to load transfer requests");
      set({ requests: [] });
    } finally {
      set({ loading: false });
    }
  },

  refreshTransferRequests: () => {
    set({ page: 1 });
    get().fetchTransferRequests(1);
  },

  approveTransferRequest: async (transferId: number, reason?: string) => {
    try {
      const trimmed = reason?.trim() ?? "";
      const body = trimmed ? { reason: trimmed } : {};
      const { data } = await api.post<TransferActionResponse>(
        inventoryTransferApprovePath(transferId),
        body,
      );
      if (data?.status !== "success") {
        toast.error(
          typeof data?.message === "string" ? data.message : "Failed to approve transfer",
        );
        return false;
      }
      toast.success("Transfer approved");
      await get().fetchTransferRequests(get().page);
      return true;
    } catch (err) {
      console.error("Approve transfer error:", err);
      toast.error(getApiErrorMessage(err) ?? "Failed to approve transfer");
      return false;
    }
  },

  rejectTransferRequest: async (transferId: number, reason: string) => {
    try {
      const trimmed = reason.trim();
      const { data } = await api.post<TransferActionResponse>(
        inventoryTransferRejectPath(transferId),
        { reason: trimmed },
      );
      if (data?.status !== "success") {
        toast.error(
          typeof data?.message === "string" ? data.message : "Failed to reject transfer",
        );
        return false;
      }
      toast.success("Transfer rejected");
      await get().fetchTransferRequests(get().page);
      return true;
    } catch (err) {
      console.error("Reject transfer error:", err);
      toast.error(getApiErrorMessage(err) ?? "Failed to reject transfer");
      return false;
    }
  },
}));
