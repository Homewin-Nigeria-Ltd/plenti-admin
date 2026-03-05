import { create } from "zustand";
import api from "@/lib/api";

export type PeriodType = "monthly" | "quarterly" | "yearly";

export interface SalesTarget {
  id: number;
  sales_team_id: number | null;
  user_id: number;
  commission_structure_id: number | null;
  target_amount: string;
  achieved_amount: string;
  period: string;
  start_date: string;
  end_date: string;
  status: string;
  created_by: {
    id: number;
    name: string;
    amount_spent: string;
    total_orders: number;
    permissions_list: any[];
    roles: any[];
  };
  created_at: string;
  updated_at: string;
  progress_percentage: number;
  team: any | null;
  user: {
    id: number;
    name: string;
    email: string;
    amount_spent: string;
    total_orders: number;
    permissions_list: any[];
    roles: any[];
  };
}

export type CreateTargetPayload = {
  user_id: number | number[];
  sales_team_id?: number | null;
  commission_type_id?: number | null;
  target_amount: number;
  period: PeriodType;
  start_date: string;
  end_date: string;
};

export type UpdateTargetPayload = Partial<CreateTargetPayload>;

export interface SalesTargetsResponse {
  status: string;
  message: string;
  data: {
    data: SalesTarget[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

interface TargetsParams {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
  period?: string;
  userId?: number;
  statusBadge?: string;
}

interface TargetsStore {
  targets: SalesTarget[];
  loading: boolean;
  saving: boolean;
  deletingId: number | null;
  error: string | null;
  pagination: SalesTargetsResponse["data"] | null;
  requestKey: string | null;
  fetchTargets: (params?: TargetsParams) => Promise<void>;
  createTarget: (payload: CreateTargetPayload) => Promise<boolean>;
  updateTarget: (id: number, payload: UpdateTargetPayload) => Promise<boolean>;
  deleteTarget: (id: number) => Promise<boolean>;
}

function getApiErrorMessage(err: unknown): string {
  if (typeof err !== "object" || err === null) return "Request failed";
  const response = (err as { response?: unknown }).response;
  if (typeof response !== "object" || response === null)
    return "Request failed";
  const data = (response as { data?: unknown }).data;
  if (typeof data !== "object" || data === null) return "Request failed";
  const message = (data as { message?: unknown }).message;
  return typeof message === "string" ? message : "Request failed";
}

export const useTargetsStore = create<TargetsStore>((set, get) => ({
  targets: [],
  loading: false,
  saving: false,
  deletingId: null,
  error: null,
  pagination: null,
  requestKey: null,
  fetchTargets: async (params = {}) => {
    const {
      page = 1,
      perPage = 15,
      search,
      status,
      period,
      userId,
      statusBadge,
    } = params;

    const currentRequestKey = `${page}|${perPage}|${search || ""}|${status || ""}|${period || ""}|${userId || ""}|${statusBadge || ""}`;
    if (get().requestKey === currentRequestKey && get().targets.length > 0) {
      return;
    }

    set({ loading: true, error: null });
    try {
      const query = new URLSearchParams({
        page: String(page),
        per_page: String(perPage),
      });

      if (search && search.trim()) query.set("search", search.trim());
      if (status && status.trim()) query.set("status", status.trim());
      if (period && period.trim()) query.set("period", period.trim());
      if (typeof userId === "number") query.set("user_id", String(userId));
      if (statusBadge && statusBadge.trim()) {
        query.set("status_badge", statusBadge.trim());
      }

      const res = await api.get<SalesTargetsResponse>(
        `/api/admin/sales/targets?${query.toString()}`,
      );

      set({
        targets: res.data.data.data,
        pagination: res.data.data,
        requestKey: query.toString(),
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch sales targets",
        loading: false,
      });
    }
  },
  createTarget: async (payload: CreateTargetPayload) => {
    set({ saving: true, error: null });
    try {
      await api.post("/api/admin/sales/targets", payload);
      set({ requestKey: null });
      await get().fetchTargets();
      return true;
    } catch (err: unknown) {
      set({ error: getApiErrorMessage(err) });
      return false;
    } finally {
      set({ saving: false });
    }
  },
  updateTarget: async (id: number, payload: UpdateTargetPayload) => {
    set({ saving: true, error: null });
    try {
      await api.put(`/api/admin/sales/targets/${id}`, payload);
      set({ requestKey: null });
      await get().fetchTargets();
      return true;
    } catch (err: unknown) {
      set({ error: getApiErrorMessage(err) });
      return false;
    } finally {
      set({ saving: false });
    }
  },
  deleteTarget: async (id: number) => {
    set({ deletingId: id, error: null });
    try {
      await api.delete(`/api/admin/sales/targets/${id}`);
      set({
        targets: get().targets.filter((item: SalesTarget) => item.id !== id),
      });
      return true;
    } catch (err: unknown) {
      set({ error: getApiErrorMessage(err) });
      return false;
    } finally {
      set({ deletingId: null });
    }
  },
}));
