import api from "@/lib/api";
import type {
  BestSellingCategory as BestSellingCategoryItem,
  DashboardOverview,
  DashboardState,
  TopProductsFilter,
} from "@/types/DashboardTypes";
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

/** Build overview from API data; now includes revenue_overview and best_selling_categories */
function mapOverview(data: Record<string, unknown>): DashboardOverview | null {
  const stats = data.stats;
  const top_products = data.top_products;
  const cart_analysis = data.cart_analysis;
  const recent_orders = data.recent_orders;
  const revenue_overview = data.revenue_overview;
  const best_selling_categories = data.best_selling_categories;

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
    revenue_overview: Array.isArray(revenue_overview)
      ? (revenue_overview as DashboardOverview["revenue_overview"])
      : [],
    best_selling_categories: Array.isArray(best_selling_categories)
      ? (best_selling_categories as DashboardOverview["best_selling_categories"])
      : [],
  };
}

export const useDashboardStore = create<DashboardState>((set) => ({
  overview: null,
  loadingOverview: false,
  overviewError: null,

  topProducts: null,
  loadingTopProducts: false,

  bestSellingCategories: null,
  loadingBestSellingCategories: false,

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

  fetchTopProducts: async (filter: TopProductsFilter) => {
    set({ loadingTopProducts: true });
    try {
      const { data } = await api.get<{
        status?: string;
        data?: DashboardOverview["top_products"];
      }>("/api/admin/top-products", { params: { filter } });

      if (data?.status !== "success" || !Array.isArray(data?.data)) {
        set({ topProducts: [] });
        return false;
      }

      set({ topProducts: data.data as DashboardOverview["top_products"] });
      return true;
    } catch (error: unknown) {
      console.error("Error fetching top products =>", error);
      set({ topProducts: [] });
      return false;
    } finally {
      set({ loadingTopProducts: false });
    }
  },

  fetchBestSellingCategories: async (filter: TopProductsFilter) => {
    set({ loadingBestSellingCategories: true });
    try {
      const { data } = await api.get<{
        status?: string;
        data?: BestSellingCategoryItem[];
      }>("/api/admin/best-selling-categories", { params: { filter } });

      if (data?.status !== "success" || !Array.isArray(data?.data)) {
        set({ bestSellingCategories: [] });
        return false;
      }

      set({ bestSellingCategories: data.data });
      return true;
    } catch (error: unknown) {
      console.error("Error fetching best selling categories =>", error);
      set({ bestSellingCategories: [] });
      return false;
    } finally {
      set({ loadingBestSellingCategories: false });
    }
  },
}));
