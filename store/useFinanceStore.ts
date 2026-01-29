import api from "@/lib/api";
import type {
  FinanceState,
  Refund,
  RefundPagination,
} from "@/types/FinanceTypes";
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

export const useFinanceStore = create<FinanceState>((set) => ({
  refunds: [],
  refundPagination: null,
  loadingRefunds: false,
  refundsError: null,

  fetchRefunds: async (page = 1, pageSize = 10) => {
    set({ loadingRefunds: true, refundsError: null });
    try {
      const { data } = await api.get<{
        status?: string;
        data?: {
          refunds?: Refund[];
          page?: number;
          pageSize?: number;
          totalCount?: number;
        };
      }>("/api/admin/finance/refunds", {
        params: { page, size: pageSize },
      });

      const payload = data?.data;
      const refunds = Array.isArray(payload?.refunds) ? payload.refunds : [];
      const refundPagination: RefundPagination | null =
        payload != null
          ? {
              page: payload.page ?? page,
              pageSize: payload.pageSize ?? pageSize,
              totalCount: payload.totalCount ?? 0,
            }
          : null;

      set({ refunds, refundPagination });
      return true;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error) ?? "Failed to fetch refunds";
      console.error("Error fetching refunds =>", error);
      set({ refundsError: message, refunds: [], refundPagination: null });
      return false;
    } finally {
      set({ loadingRefunds: false });
    }
  },
}));
