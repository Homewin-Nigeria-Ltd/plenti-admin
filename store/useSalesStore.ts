import { create } from "zustand";
import api from "@/lib/api";
import {
  SalesOverviewResponse,
  SalesTrendPeriod,
  SalesTrendResponse,
} from "../types/sales";

interface SalesStore {
  overview: SalesOverviewResponse["data"] | null;
  trend: SalesTrendResponse["data"] | null;
  trendRequestKey: string | null;
  trendLoading: boolean;
  trendError: string | null;
  loading: boolean;
  error: string | null;
  fetchSalesOverview: () => Promise<void>;
  fetchSalesTrend: (
    period: SalesTrendPeriod,
    year?: number,
    userId?: number,
  ) => Promise<void>;
}

export const useSalesStore = create<SalesStore>((set, get) => ({
  overview: null,
  trend: null,
  trendRequestKey: null,
  trendLoading: false,
  trendError: null,
  loading: false,
  error: null,
  fetchSalesOverview: async () => {
    if (get().overview) {
      return;
    }
    set({ loading: true, error: null });
    try {
      const res = await api.get("/api/admin/sales/overview");
      set({ overview: res.data.data, loading: false });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch sales overview",
        loading: false,
      });
    }
  },
  fetchSalesTrend: async (period, year, userId) => {
    set({ trendLoading: true, trendError: null });
    try {
      const requestKey = `${period}|${typeof year === "number" ? year : "all"}|${typeof userId === "number" ? userId : "all"}`;
      const res = await api.get<SalesTrendResponse>("/api/admin/sales/trend", {
        params: {
          period,
          ...(typeof year === "number" ? { year } : {}),
          ...(typeof userId === "number" ? { userId } : {}),
        },
      });
      set({
        trend: res.data.data,
        trendRequestKey: requestKey,
        trendLoading: false,
      });
    } catch (error: any) {
      set({
        trendError: error?.message || "Failed to fetch sales trend",
        trendLoading: false,
      });
    }
  },
}));
