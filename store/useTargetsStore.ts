import { create } from "zustand";
import api from "@/lib/api";
import type { TargetStatus } from "@/types/sales";

export interface SalesTarget {
  id: number;
  createdDate: string;
  period: string;
  status: TargetStatus;
  teamMemberName: string;
  teamMemberRole: string;
  target: string;
  achieved: string;
  progress: number;
  percentage: string;
  status_badge?: string;
}

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
  error: string | null;
  pagination: SalesTargetsResponse["data"] | null;
  requestKey: string | null;
  fetchTargets: (params?: TargetsParams) => Promise<void>;
}

export const useTargetsStore = create<TargetsStore>((set) => ({
  targets: [],
  loading: false,
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
}));
