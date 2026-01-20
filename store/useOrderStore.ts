import api from "@/lib/api";
import { Order, OrderState } from "@/types/OrderTypes";
import { create } from "zustand";

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  singleOrder: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  pageSize: 10,

  fetchOrders: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get<{ data: { orders: Order[] } }>(
        "/api/admin/orders"
      );
      console.log("Orders fetched successfully =>", data.data);
      set({ orders: data.data.orders });
      return true;
    } catch (error) {
      console.error("Error fetching orders =>", error);
      set({ loading: false, error: "Failed to fetch orders" });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // GET SINGLE ORDER
  fetchSingleOrders: async (id: number) => {
    set({ loading: true });
    console.log("Fetching single order");
    try {
      const { data } = await api.get<{ data: Order }>(
        "/api/admin/orders/" + id
      );
      console.log("Orders fetched successfully =>", data.data);
      set({ singleOrder: data.data });
      return true;
    } catch (error) {
      console.error("Error fetching orders =>", error);
      set({ loading: false, error: "Failed to fetch orders" });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  setSingleOrder: () => {
    set({ singleOrder: null });
  },
}));
