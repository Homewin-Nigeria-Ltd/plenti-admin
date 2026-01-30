import api from "@/lib/api";
import type { DashboardOverview, DashboardState } from "@/types/DashboardTypes";
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
  const message = data.message;
  return typeof message === "string" ? message : null;
}

/** Build overview from API data; exclude revenue_overview (use separate endpoint for that). */
function mapOverview(data: Record<string, unknown>): DashboardOverview | null {
  const stats = data.stats;
  const top_products = data.top_products;
  const cart_analysis = data.cart_analysis;
  const recent_orders = data.recent_orders;

  if (!stats || typeof stats !== "object") return null;

  return {
    stats: stats as DashboardOverview["stats"],
    top_products: Array.isArray(top_products)
      ? (top_products as DashboardOverview["top_products"])
      : [],
    cart_analysis:
      cart_analysis && typeof cart_analysis === "object"
        ? (cart_analysis as DashboardOverview["cart_analysis"])
        : {
            abandoned_rate_percentage: 0,
            abandoned_cart_count: 0,
            abandoned_revenue: "0",
          },
    recent_orders: Array.isArray(recent_orders)
      ? (recent_orders as DashboardOverview["recent_orders"])
      : [],
  };
}

export const useDashboardStore = create<DashboardState>((set) => ({
  overview: null,
  loadingOverview: false,
  overviewError: null,

  fetchDashboardOverview: async () => {
    set({ loadingOverview: true, overviewError: null });
    try {
      const { data } = await api.get<{
        status?: string;
        data?: Record<string, unknown>;
      }>("/api/admin/dashboard/overview");

      if (data?.status !== "success" || !data?.data) {
        set({ overview: null });
        return false;
      }

      const overview = mapOverview(data.data as Record<string, unknown>);
      set({ overview });
      return overview != null;
    } catch (error: unknown) {
      const message =
        getApiErrorMessage(error) ?? "Failed to fetch dashboard overview";
      console.error("Error fetching dashboard overview =>", error);
      set({ overviewError: message, overview: null });
      return false;
    } finally {
      set({ loadingOverview: false });
    }
  },
}));
