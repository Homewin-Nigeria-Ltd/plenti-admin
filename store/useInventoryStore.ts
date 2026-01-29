import api from "@/lib/api";
import { PAGE_SIZE } from "@/lib/constant";
import { INVENTORY_API } from "@/data/inventory";
import type { InventoryState, InventoryListResponse } from "@/types/InventoryTypes";
import { create } from "zustand";

export const useInventoryStore = create<InventoryState>((set) => ({
  items: [],
  loading: false,
  error: null,
  currentPage: 1,
  lastPage: 1,
  perPage: PAGE_SIZE,
  totalItems: 0,
  lastQuery: { page: 1, search: "" },

  fetchInventory: async (params) => {
    const page = params?.page ?? 1;
    const search = params?.search?.trim() ?? "";
    set({ loading: true, error: null, lastQuery: { page, search } });

    try {
      const query: Record<string, string | number> = {
        page,
        search,
        per_page: PAGE_SIZE,
      };
      const { data } = await api.get<InventoryListResponse>(
        INVENTORY_API.getInventory,
        { params: query }
      );

      const paginated = data?.data;
      const rows = paginated?.data ?? [];
      const currentPage = paginated?.current_page ?? 1;
      const lastPage = paginated?.last_page ?? 1;
      const perPage = paginated?.per_page ?? PAGE_SIZE;
      const totalItems = paginated?.total ?? 0;

      set({
        items: rows ?? [],
        currentPage,
        lastPage,
        perPage,
        totalItems,
      });
      return true;
    } catch (error) {
      console.error("Error fetching inventory =>", error);
      set({ error: "Failed to fetch inventory" });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
