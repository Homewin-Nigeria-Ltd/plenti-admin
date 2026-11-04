import { FLASH_SALES_API, flashSalePath } from "@/data/flashSales";
import api from "@/lib/api";
import type {
  FlashSale,
  FlashSaleListResponse,
  FlashSaleMutationResponse,
  FlashSalePayload,
  FlashSaleState,
} from "@/types/FlashSaleTypes";
import { create } from "zustand";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getApiErrorMessage(err: unknown): string | null {
  if (!isRecord(err)) return null;
  const response = (err as { response?: unknown }).response;
  if (!isRecord(response)) return null;
  const data = (response as { data?: unknown }).data;
  if (!isRecord(data)) return null;
  if (typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }
  const errors = data.errors;
  if (isRecord(errors)) {
    for (const value of Object.values(errors)) {
      if (Array.isArray(value) && typeof value[0] === "string") return value[0];
      if (typeof value === "string") return value;
    }
  }
  return null;
}

function isSuccessStatus(status?: string) {
  if (!status) return true;
  return status === "success";
}

function unwrapList(payload: FlashSaleListResponse | undefined): FlashSale[] {
  const raw = payload?.data;
  if (Array.isArray(raw)) return raw;
  if (!raw) return [];
  if (Array.isArray(raw.items)) return raw.items;
  if (Array.isArray(raw.data)) return raw.data;
  return [];
}

function unwrapDetail(
  payload: FlashSaleMutationResponse | undefined,
): FlashSale | null {
  const raw = payload?.data;
  if (raw && typeof raw === "object" && "id" in raw) return raw;
  return null;
}

export const useFlashSaleStore = create<FlashSaleState>((set, get) => ({
  flashSales: [],
  loadingFlashSales: false,
  loadingDetail: false,
  savingFlashSale: false,
  flashSalesError: null,
  saveError: null,
  deletingById: {},

  fetchFlashSales: async (search) => {
    set({ loadingFlashSales: true, flashSalesError: null });
    try {
      const { data } = await api.get<FlashSaleListResponse>(FLASH_SALES_API.list, {
        params: search?.trim() ? { search: search.trim() } : undefined,
      });
      set({ flashSales: unwrapList(data) });
      return true;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error) ?? "Failed to fetch flash sales";
      console.error("Error fetching flash sales =>", error);
      set({ flashSalesError: message, flashSales: [] });
      return false;
    } finally {
      set({ loadingFlashSales: false });
    }
  },

  fetchFlashSale: async (id) => {
    set({ loadingDetail: true });
    try {
      const { data } = await api.get<FlashSaleMutationResponse>(
        flashSalePath(id),
      );
      return unwrapDetail(data);
    } catch (error: unknown) {
      console.error("Error fetching flash sale =>", error);
      return null;
    } finally {
      set({ loadingDetail: false });
    }
  },

  createFlashSale: async (payload: FlashSalePayload) => {
    set({ savingFlashSale: true, saveError: null });
    try {
      const { data } = await api.post<FlashSaleMutationResponse>(
        FLASH_SALES_API.list,
        payload,
      );
      if (!isSuccessStatus(data?.status)) {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "Failed to create flash sale";
        set({ saveError: message });
        return false;
      }
      await get().fetchFlashSales();
      return true;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error) ?? "Failed to create flash sale";
      console.error("Error creating flash sale =>", error);
      set({ saveError: message });
      return false;
    } finally {
      set({ savingFlashSale: false });
    }
  },

  updateFlashSale: async (id, payload) => {
    set({ savingFlashSale: true, saveError: null });
    try {
      const { data } = await api.put<FlashSaleMutationResponse>(
        flashSalePath(id),
        payload,
      );
      if (!isSuccessStatus(data?.status)) {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "Failed to update flash sale";
        set({ saveError: message });
        return false;
      }
      await get().fetchFlashSales();
      return true;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error) ?? "Failed to update flash sale";
      console.error("Error updating flash sale =>", error);
      set({ saveError: message });
      return false;
    } finally {
      set({ savingFlashSale: false });
    }
  },

  deleteFlashSale: async (id) => {
    set((state) => ({
      deletingById: { ...state.deletingById, [id]: true },
    }));
    try {
      const { data } = await api.delete<FlashSaleMutationResponse>(
        flashSalePath(id),
      );
      if (!isSuccessStatus(data?.status)) {
        return false;
      }
      await get().fetchFlashSales();
      return true;
    } catch (error: unknown) {
      console.error("Error deleting flash sale =>", error);
      return false;
    } finally {
      set((state) => {
        const next = { ...state.deletingById };
        delete next[id];
        return { deletingById: next };
      });
    }
  },
}));
