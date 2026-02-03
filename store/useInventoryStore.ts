import api from "@/lib/api";
import { PAGE_SIZE } from "@/lib/constant";
import { INVENTORY_API } from "@/data/inventory";
import type {
  InventoryListResponse,
  InventoryState,
  InventoryStatistics,
} from "@/types/InventoryTypes";
import { create } from "zustand";

function getApiErrorMessage(err: unknown): string | null {
  if (typeof err !== "object" || err === null) return null;
  const response = (err as { response?: unknown }).response;
  if (typeof response !== "object" || response === null) return null;
  const data = (response as { data?: unknown }).data;
  if (typeof data !== "object" || data === null) return null;
  const message = (data as { message?: unknown }).message;
  return typeof message === "string" ? message : null;
}

export type InventoryStoreState = InventoryState & {
  statistics: InventoryStatistics | null;
  loadingStatistics: boolean;
  statisticsError: string | null;
  fetchInventoryStatistics: () => Promise<boolean>;
};

export const useInventoryStore = create<InventoryStoreState>((set) => ({
  items: [],
  loading: false,
  error: null,
  currentPage: 1,
  lastPage: 1,
  perPage: PAGE_SIZE,
  totalItems: 0,
  lastQuery: { page: 1, search: "" },
  statistics: null,
  loadingStatistics: false,
  statisticsError: null,

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

  fetchInventoryStatistics: async () => {
    set({ loadingStatistics: true, statisticsError: null });
    try {
      const { data } = await api.get<{
        status?: string;
        message?: string;
        data?: InventoryStatistics;
      }>(INVENTORY_API.getStatistics);

      if (data?.status !== "success") {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "Failed to load inventory statistics";
        set({ statisticsError: message });
        return false;
      }
      set({ statistics: data?.data ?? null });
      return true;
    } catch (err) {
      const message =
        getApiErrorMessage(err) ?? "Failed to load inventory statistics";
      console.error("Error fetching inventory statistics =>", err);
      set({ statisticsError: message });
      return false;
    } finally {
      set({ loadingStatistics: false });
    }
  },
}));
