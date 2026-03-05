import api from "@/lib/api";
import { create } from "zustand";

export type CommissionType = "FLAT_COMMISSION" | "TIER";

export type CommissionStructure = {
  id: number;
  name: string;
  commission_type: CommissionType;
  rate: number;
  bonus_amount: number;
  min_threshold: number;
  max_threshold: number;
  minimum_level: number | null;
  maximum_level: number | null;
  created_at?: string;
  updated_at?: string;
};

export type CreateCommissionStructurePayload = {
  name: string;
  commission_type: CommissionType;
  rate: number;
  bonus_amount: number;
  min_threshold: number;
  max_threshold: number;
  minimum_level?: number | null;
  maximum_level?: number | null;
};

export type UpdateCommissionStructurePayload =
  Partial<CreateCommissionStructurePayload>;

type State = {
  structures: CommissionStructure[];
  loading: boolean;
  saving: boolean;
  deletingId: number | null;
  error: string | null;
  fetchStructures: () => Promise<boolean>;
  fetchStructureById: (id: number) => Promise<CommissionStructure | null>;
  createStructure: (
    payload: CreateCommissionStructurePayload,
  ) => Promise<boolean>;
  updateStructure: (
    id: number,
    payload: UpdateCommissionStructurePayload,
  ) => Promise<boolean>;
  deleteStructure: (id: number) => Promise<boolean>;
};

function getApiErrorMessage(err: unknown): string {
  if (typeof err !== "object" || err === null) return "Request failed";
  const response = (err as { response?: unknown }).response;
  if (typeof response !== "object" || response === null)
    return "Request failed";
  const data = (response as { data?: unknown }).data;
  if (typeof data !== "object" || data === null) return "Request failed";
  const errorMessage = (data as { message?: unknown }).message;
  return typeof errorMessage === "string" ? errorMessage : "Request failed";
}

function extractListPayload(payload: unknown): {
  items: CommissionStructure[];
  message?: string;
} {
  if (Array.isArray(payload)) {
    return { items: payload as CommissionStructure[] };
  }

  if (typeof payload !== "object" || payload === null) {
    return { items: [] };
  }

  const payloadObj = payload as {
    data?: unknown;
    message?: unknown;
  };

  if (Array.isArray(payloadObj.data)) {
    return {
      items: payloadObj.data as CommissionStructure[],
      message:
        typeof payloadObj.message === "string" ? payloadObj.message : undefined,
    };
  }

  if (
    typeof payloadObj.data === "object" &&
    payloadObj.data !== null &&
    Array.isArray((payloadObj.data as { data?: unknown }).data)
  ) {
    return {
      items: (payloadObj.data as { data: CommissionStructure[] }).data,
      message:
        typeof payloadObj.message === "string" ? payloadObj.message : undefined,
    };
  }

  return {
    items: [],
    message:
      typeof payloadObj.message === "string" ? payloadObj.message : undefined,
  };
}

function extractSinglePayload(payload: unknown): CommissionStructure | null {
  if (typeof payload !== "object" || payload === null) return null;

  if ("id" in payload) {
    return payload as CommissionStructure;
  }

  const data = (payload as { data?: unknown }).data;
  if (typeof data === "object" && data !== null && "id" in data) {
    return data as CommissionStructure;
  }

  return null;
}

export const useCommissionStructuresStore = create<State>((set, get) => ({
  structures: [],
  loading: false,
  saving: false,
  deletingId: null,
  error: null,

  fetchStructures: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get("/api/admin/commissions/structures");
      const { items } = extractListPayload(data);
      set({ structures: items });
      return true;
    } catch (err: unknown) {
      set({ error: getApiErrorMessage(err) });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  fetchStructureById: async (id: number) => {
    try {
      const { data } = await api.get(`/api/admin/commissions/structures/${id}`);
      return extractSinglePayload(data);
    } catch {
      return null;
    }
  },

  createStructure: async (payload: CreateCommissionStructurePayload) => {
    set({ saving: true, error: null });
    try {
      const { data } = await api.post(
        "/api/admin/commissions/structures",
        payload,
      );
      const created = extractSinglePayload(data);

      if (created) {
        set({ structures: [created, ...get().structures] });
      } else {
        await get().fetchStructures();
      }

      return true;
    } catch (err: unknown) {
      set({ error: getApiErrorMessage(err) });
      return false;
    } finally {
      set({ saving: false });
    }
  },

  updateStructure: async (
    id: number,
    payload: UpdateCommissionStructurePayload,
  ) => {
    set({ saving: true, error: null });
    try {
      const { data } = await api.put(
        `/api/admin/commissions/structures/${id}`,
        payload,
      );
      const updated = extractSinglePayload(data);

      if (updated) {
        set({
          structures: get().structures.map((item) =>
            item.id === id ? updated : item,
          ),
        });
      } else {
        await get().fetchStructures();
      }

      return true;
    } catch (err: unknown) {
      set({ error: getApiErrorMessage(err) });
      return false;
    } finally {
      set({ saving: false });
    }
  },

  deleteStructure: async (id: number) => {
    set({ deletingId: id, error: null });
    try {
      await api.delete(`/api/admin/commissions/structures/${id}`);
      set({ structures: get().structures.filter((item) => item.id !== id) });
      return true;
    } catch (err: unknown) {
      set({ error: getApiErrorMessage(err) });
      return false;
    } finally {
      set({ deletingId: null });
    }
  },
}));
