import api from "@/lib/api";
import { PAGE_SIZE } from "@/lib/constant";
import { ORDERS_API } from "@/data/orders";
import { Order, OrderState, OrdersListResponse } from "@/types/OrderTypes";
import { create } from "zustand";

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  singleOrder: null,
  loading: false,
  loadingSingle: false,
  error: null,
  currentPage: 1,
  lastPage: 1,
  perPage: PAGE_SIZE,
  totalItems: 0,
  lastQuery: { page: 1, search: "" },

  fetchOrders: async (params) => {
    const page = params?.page ?? 1;
    const search = params?.search?.trim() ?? "";
    set({ loading: true, error: null, lastQuery: { page, search } });

    try {
      const query: Record<string, string | number> = {
        page,
        search,
        per_page: PAGE_SIZE,
      };

      const { data } = await api.get<OrdersListResponse>(ORDERS_API.getOrders, {
        params: query,
      });

      const paginated = data.data;
      set({
        orders: paginated.data ?? [],
        currentPage: paginated.current_page ?? 1,
        lastPage: paginated.last_page ?? 1,
        perPage: paginated.per_page ?? PAGE_SIZE,
        totalItems: paginated.total ?? 0,
      });
      return true;
    } catch (error) {
      console.error("Error fetching orders =>", error);
      set({ error: "Failed to fetch orders" });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  fetchSingleOrders: async (id: number) => {
    set({ loadingSingle: true });
    try {
      const { data } = await api.get<{ data: Order }>(
        `${ORDERS_API.getOrder}/${id}`
      );
      set({ singleOrder: data.data ?? null });
      return true;
    } catch (error) {
      console.error("Error fetching order =>", error);
      set({ error: "Failed to fetch order" });
      return false;
    } finally {
      set({ loadingSingle: false });
    }
  },

  setSingleOrder: () => {
    set({ singleOrder: null });
  },
}));
