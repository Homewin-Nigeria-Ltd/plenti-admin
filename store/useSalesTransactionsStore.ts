import { create } from "zustand";
import api from "@/lib/api";

export interface SalesTransactionUser {
  id: number;
  name: string;
  email: string;
  amount_spent: string;
  total_orders: number;
  permissions_list: string[];
  roles: string[];
}

export interface SalesTransaction {
  id: number;
  user_id: number;
  assigned_to: number | null;
  subtotal: string;
  tax: string;
  total: number;
  status: string;
  payment_status: string;
  payment_method: string;
  payment_reference: string | null;
  payment_gateway_response: string | null;
  paid_at: string | null;
  assigned_at: string | null;
  shipping_address: string;
  phone_number: string;
  delivery_type: string;
  shipping_fee: string;
  delivery_notes: string | null;
  order_number: string;
  created_at: string;
  updated_at: string;
  in_transit_at: string | null;
  refund_requested_at: string | null;
  display_status: string;
  user: SalesTransactionUser;
}

export interface SalesTransactionsResponse {
  status: string;
  code: number;
  message: string;
  data: {
    current_page: number;
    data: SalesTransaction[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  timestamp: string;
}

interface SalesTransactionsStore {
  transactions: SalesTransaction[];
  loading: boolean;
  error: string | null;
  pagination: SalesTransactionsResponse["data"] | null;
  fetchTransactions: (
    page?: number,
    perPage?: number,
    search?: string,
    userId?: number,
  ) => Promise<void>;
}

export const useSalesTransactionsStore = create<SalesTransactionsStore>(
  (set) => ({
    transactions: [],
    loading: false,
    error: null,
    pagination: null,
    fetchTransactions: async (page = 1, perPage = 10, search = "", userId) => {
      set({ loading: true, error: null });
      try {
        const query = new URLSearchParams({
          per_page: String(perPage),
          page: String(page),
          search,
        });

        if (typeof userId === "number") {
          query.set("userId", String(userId));
        }

        const res = await api.get<SalesTransactionsResponse>(
          `/api/admin/sales/transactions?${query.toString()}`,
        );
        set({
          transactions: res.data.data.data,
          pagination: res.data.data,
          loading: false,
        });
      } catch (error: any) {
        set({
          error: error?.message || "Failed to fetch sales transactions",
          loading: false,
        });
      }
    },
  }),
);
