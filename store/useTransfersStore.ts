import api from "@/lib/api";
import { INVENTORY_API } from "@/data/inventory";
import type { TransferHistoryEntry, TransfersResponse } from "@/types/InventoryTypes";
import { toast } from "sonner";
import { create } from "zustand";

type TransfersStore = {
  transfers: TransferHistoryEntry[];
  loading: boolean;
  page: number;
  lastPage: number;
  total: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  fetchTransfers: (pageNum: number) => Promise<void>;
  refreshTransfers: () => void;
};

export const useTransfersStore = create<TransfersStore>((set, get) => ({
  transfers: [],
  loading: false,
  page: 1,
  lastPage: 1,
  total: 0,

  setPage: (next) => {
    const current = get().page;
    const page = typeof next === "function" ? next(current) : next;
    set({ page });
  },

  fetchTransfers: async (pageNum: number) => {
    set({ loading: true });
    try {
      const { data } = await api.get<TransfersResponse>(INVENTORY_API.transfers, {
        params: { page: pageNum, per_page: 20 },
      });
      if (data?.status === "success" && data?.data) {
        set({
          transfers: data.data.data ?? [],
          lastPage: data.data.last_page ?? 1,
          total: data.data.total ?? 0,
        });
      } else {
        set({ transfers: [] });
      }
    } catch (err) {
      console.error("Transfers fetch error:", err);
      toast.error("Failed to load transfers");
      set({ transfers: [] });
    } finally {
      set({ loading: false });
    }
  },

  refreshTransfers: () => {
    set({ page: 1 });
    get().fetchTransfers(1);
  },
}));
