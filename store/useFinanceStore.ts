import api from "@/lib/api";
import type {
  FinanceState,
  FinanceOverview,
  FinanceTransaction,
  FinanceTransactionPagination,
  PaymentDistribution,
  Refund,
  RefundDetail,
  RefundFilter,
  RefundMetrics,
  RefundPagination,
  RevenueTrend,
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

function toNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function mapRevenueTrend(raw: unknown): RevenueTrend[] {
  if (Array.isArray(raw)) {
    return raw
      .map((item) => {
        if (!isRecord(item)) return null;
        const label = typeof item.label === "string" ? item.label : "";
        if (!label) return null;
        return { label, value: toNumber(item.value) };
      })
      .filter((item): item is RevenueTrend => item !== null);
  }

  if (isRecord(raw) && Array.isArray(raw.labels) && Array.isArray(raw.values)) {
    return raw.labels.map((label, index) => ({
      label: String(label ?? ""),
      value: toNumber(raw.values[index]),
    }));
  }

  return [];
}

function mapPaymentDistribution(raw: unknown): PaymentDistribution[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!isRecord(item)) return null;
      const method =
        typeof item.method === "string"
          ? item.method
          : typeof item.payment_method === "string"
            ? item.payment_method
            : "";
      if (!method) return null;
      const percentage =
        typeof item.percentage === "number" && Number.isFinite(item.percentage)
          ? item.percentage
          : undefined;
      return {
        method,
        amount: toNumber(item.amount ?? item.total),
        percentage,
      };
    })
    .filter((item): item is PaymentDistribution => item !== null);
}

function mapRefund(raw: unknown): Refund | null {
  if (!isRecord(raw)) return null;
  const refundId = raw.refundId ?? raw.id;
  if (refundId == null) return null;
  return {
    refundId: refundId as number | string,
    orderId:
      typeof raw.orderId === "string"
        ? raw.orderId
        : typeof raw.order_number === "string"
          ? raw.order_number
          : undefined,
    customerName:
      typeof raw.customerName === "string"
        ? raw.customerName
        : typeof raw.customer_name === "string"
          ? raw.customer_name
          : "",
    customerEmail:
      typeof raw.customerEmail === "string"
        ? raw.customerEmail
        : typeof raw.customer_email === "string"
          ? raw.customer_email
          : "",
    amount: Number(raw.amount) || 0,
    status: typeof raw.status === "string" ? raw.status : "",
    reason: typeof raw.reason === "string" ? raw.reason : undefined,
    requestedAt:
      typeof raw.requestedAt === "string"
        ? raw.requestedAt
        : typeof raw.created_at === "string"
          ? raw.created_at
          : undefined,
  };
}

function mapRefundDetail(raw: unknown): RefundDetail | null {
  if (!isRecord(raw)) return null;
  const id = raw.id ?? raw.refundId;
  if (id == null) return null;
  return {
    id: id as number | string,
    order_id:
      typeof raw.order_id === "number" || typeof raw.order_id === "string"
        ? raw.order_id
        : undefined,
    order_number:
      typeof raw.order_number === "string"
        ? raw.order_number
        : typeof raw.orderId === "string"
          ? raw.orderId
          : undefined,
    customer_name:
      typeof raw.customer_name === "string"
        ? raw.customer_name
        : typeof raw.customerName === "string"
          ? raw.customerName
          : undefined,
    customer_email:
      typeof raw.customer_email === "string"
        ? raw.customer_email
        : typeof raw.customerEmail === "string"
          ? raw.customerEmail
          : undefined,
    amount: Number(raw.amount) || 0,
    status: typeof raw.status === "string" ? raw.status : "",
    reason: typeof raw.reason === "string" ? raw.reason : undefined,
    created_at:
      typeof raw.created_at === "string"
        ? raw.created_at
        : typeof raw.requestedAt === "string"
          ? raw.requestedAt
          : undefined,
  };
}

export const useFinanceStore = create<FinanceState>((set) => ({
  refunds: [],
  refundPagination: null,
  loadingRefunds: false,
  refundsError: null,
  refundMetrics: null,
  loadingRefundMetrics: false,
  selectedRefundDetail: null,
  loadingRefundDetail: false,
  refundActionLoading: false,

  overview: null,
  loadingOverview: false,
  overviewError: null,

  financeTransactions: [],
  financeTransactionPagination: null,
  loadingTransactions: false,
  transactionsError: null,
  exportingTransactions: false,

  fetchRefunds: async (page = 1, pageSize = 10, filter: RefundFilter = "all") => {
    set({ loadingRefunds: true, refundsError: null });
    try {
      const params: Record<string, string | number> = { page, size: pageSize };
      if (filter && filter !== "all") params.filter = filter;

      const { data } = await api.get<{
        status?: string;
        data?: {
          refunds?: unknown[];
          page?: number;
          pageSize?: number;
          totalCount?: number;
        };
      }>("/api/admin/finance/refunds", { params });

      const payload = data?.data;
      const refunds = Array.isArray(payload?.refunds)
        ? payload.refunds
            .map(mapRefund)
            .filter((item): item is Refund => item !== null)
        : [];
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

  fetchRefundMetrics: async () => {
    set({ loadingRefundMetrics: true });
    try {
      const { data } = await api.get<{
        status?: string;
        data?: Partial<RefundMetrics>;
      }>("/api/admin/finance/refunds/metrics");

      const payload = data?.data;
      const refundMetrics: RefundMetrics = {
        awaiting_approval: Number(payload?.awaiting_approval) || 0,
        awaiting_processing: Number(payload?.awaiting_processing) || 0,
        approved: Number(payload?.approved) || 0,
        rejected: Number(payload?.rejected) || 0,
        total: Number(payload?.total) || 0,
      };
      set({ refundMetrics });
      return true;
    } catch (error: unknown) {
      console.error("Error fetching refund metrics =>", error);
      set({ refundMetrics: null });
      return false;
    } finally {
      set({ loadingRefundMetrics: false });
    }
  },

  fetchRefundDetail: async (id) => {
    set({ loadingRefundDetail: true, selectedRefundDetail: null });
    try {
      const { data } = await api.get<{
        status?: string;
        data?: unknown;
      }>(`/api/admin/finance/refunds/${id}`);
      const detail = mapRefundDetail(data?.data);
      set({ selectedRefundDetail: detail });
      return detail;
    } catch (error: unknown) {
      console.error("Error fetching refund detail =>", error);
      set({ selectedRefundDetail: null });
      return null;
    } finally {
      set({ loadingRefundDetail: false });
    }
  },

  approveRefund: async (id) => {
    set({ refundActionLoading: true });
    try {
      const { data } = await api.patch<{
        status?: string;
        message?: string;
      }>(`/api/admin/finance/refunds/${id}/approve`);
      return data?.status === "success" || !data?.status;
    } catch (error: unknown) {
      console.error("Error approving refund =>", error);
      return false;
    } finally {
      set({ refundActionLoading: false });
    }
  },

  rejectRefund: async (id, reason) => {
    set({ refundActionLoading: true });
    try {
      const { data } = await api.patch<{
        status?: string;
        message?: string;
      }>(`/api/admin/finance/refunds/${id}/reject`, { reason });
      return data?.status === "success" || !data?.status;
    } catch (error: unknown) {
      console.error("Error rejecting refund =>", error);
      return false;
    } finally {
      set({ refundActionLoading: false });
    }
  },

  markRefundProcessed: async (id) => {
    set({ refundActionLoading: true });
    try {
      const { data } = await api.patch<{
        status?: string;
        message?: string;
      }>(`/api/admin/finance/refunds/${id}/status`, { status: "Approved" });
      return data?.status === "success" || !data?.status;
    } catch (error: unknown) {
      console.error("Error marking refund processed =>", error);
      return false;
    } finally {
      set({ refundActionLoading: false });
    }
  },

  fetchFinanceOverview: async (filter: "month" | "week" | "year" = "month") => {
    set({ loadingOverview: true, overviewError: null });
    try {
      const { data } = await api.get<{
        status?: string;
        data?: Record<string, unknown>;
      }>("/api/admin/revenue-stats", {
        params: { filter },
      });

      if (data?.status !== "success" || !data?.data) {
        set({ overview: null });
        return false;
      }

      const apiData = data.data;

      const overview: FinanceOverview = {
        summary: {
          total_revenue: String(toNumber(apiData.total_revenue)),
          pending_refunds: toNumber(apiData.pending_refunds),
          total_transactions: toNumber(apiData.total_transactions),
          average_order_value: toNumber(apiData.average_order_value),
          percentage_change:
            typeof apiData.percentage_change === "number"
              ? apiData.percentage_change
              : undefined,
          trend:
            apiData.trend === "up"
              ? "up"
              : apiData.trend === "down"
              ? "down"
              : undefined,
        },
        charts: {
          revenue_trend: mapRevenueTrend(apiData.chart_data),
          payment_distribution: mapPaymentDistribution(
            apiData.payment_distribution
          ),
        },
        transactions: [],
        transactionPagination: null,
      };

      set({ overview });
      return true;
    } catch (error: unknown) {
      const message =
        getApiErrorMessage(error) ?? "Failed to fetch finance overview";
      console.error("Error fetching finance overview =>", error);
      set({ overviewError: message, overview: null });
      return false;
    } finally {
      set({ loadingOverview: false });
    }
  },

  fetchTransactions: async (page = 1, pageSize = 10) => {
    set({ loadingTransactions: true, transactionsError: null });
    try {
      const { data } = await api.get<{
        status?: string;
        data?: {
          transactions?: FinanceTransaction[];
          page?: number;
          pageSize?: number;
          totalCount?: number;
        };
      }>("/api/admin/finance/transactions", {
        params: { page, size: pageSize },
      });

      const payload = data?.data;
      const financeTransactions = Array.isArray(payload?.transactions)
        ? payload.transactions
        : [];
      const financeTransactionPagination: FinanceTransactionPagination | null =
        payload != null
          ? {
              page: payload.page ?? page,
              pageSize: payload.pageSize ?? pageSize,
              totalCount: payload.totalCount ?? 0,
            }
          : null;

      set({ financeTransactions, financeTransactionPagination });
      return true;
    } catch (error: unknown) {
      const message =
        getApiErrorMessage(error) ?? "Failed to fetch transactions";
      console.error("Error fetching transactions =>", error);
      set({
        transactionsError: message,
        financeTransactions: [],
        financeTransactionPagination: null,
      });
      return false;
    } finally {
      set({ loadingTransactions: false });
    }
  },

  exportTransactions: async () => {
    set({ exportingTransactions: true });
    try {
      const response = await api.get("/api/admin/finance/transactions/export", {
        responseType: "blob",
        headers: { Accept: "text/csv, application/octet-stream, */*" },
      });

      const blob =
        response.data instanceof Blob
          ? response.data
          : new Blob([response.data], { type: "text/csv" });

      if (blob.type.includes("application/json")) {
        const text = await blob.text();
        try {
          const parsed = JSON.parse(text) as { message?: string };
          console.error("Error exporting transactions =>", parsed);
        } catch {
          console.error("Error exporting transactions =>", text);
        }
        return false;
      }

      const disposition = response.headers["content-disposition"];
      const filename = filenameFromDisposition(disposition);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      return true;
    } catch (error: unknown) {
      console.error("Error exporting transactions =>", error);
      return false;
    } finally {
      set({ exportingTransactions: false });
    }
  },
}));

function filenameFromDisposition(header: unknown): string {
  if (typeof header !== "string" || !header) return "transactions.csv";
  const utfMatch = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (utfMatch?.[1]) {
    try {
      return decodeURIComponent(utfMatch[1].trim());
    } catch {
      return utfMatch[1].trim();
    }
  }
  const match = header.match(/filename="?([^"]+)"?/i);
  return match?.[1]?.trim() || "transactions.csv";
}
