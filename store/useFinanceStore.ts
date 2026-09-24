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
    const labels = raw.labels;
    const values = raw.values;
    return labels.map((label, index) => ({
      label: String(label ?? ""),
      value: toNumber(values[index]),
    }));
  }

  return [];
}

function mapPaymentDistribution(raw: unknown): PaymentDistribution[] {
  if (!Array.isArray(raw)) return [];
  const items: PaymentDistribution[] = [];
  for (const item of raw) {
    if (!isRecord(item)) continue;
    const method =
      typeof item.method === "string"
        ? item.method
        : typeof item.payment_method === "string"
          ? item.payment_method
          : "";
    if (!method) continue;
    const mapped: PaymentDistribution = {
      method,
      amount: toNumber(item.amount ?? item.total),
    };
    if (typeof item.percentage === "number" && Number.isFinite(item.percentage)) {
      mapped.percentage = item.percentage;
    }
    items.push(mapped);
  }
  return items;
}

function mapRefund(raw: unknown): Refund | null {
  if (!isRecord(raw)) return null;
  if (raw.id == null) return null;
  const displayId = raw.refundId ?? raw.refund_id ?? raw.id;
  return {
    id: raw.id as number | string,
    refundId: displayId as number | string,
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
    status:
      typeof raw.backend_status === "string"
        ? raw.backend_status
        : typeof raw.status === "string"
          ? raw.status
          : "",
    reason:
      typeof raw.reason === "string"
        ? raw.reason
        : typeof raw.orderStatus === "string"
          ? raw.orderStatus
          : undefined,
    requestedAt:
      typeof raw.requestedAt === "string"
        ? raw.requestedAt
        : typeof raw.refundDate === "string"
          ? raw.refundDate
          : typeof raw.created_at === "string"
            ? raw.created_at
            : undefined,
  };
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function mapRefundDetail(raw: unknown): RefundDetail | null {
  if (!isRecord(raw)) return null;

  const refund = isRecord(raw.refund) ? raw.refund : raw;
  const customer = isRecord(raw.customer_info) ? raw.customer_info : null;
  const orderDetails = isRecord(raw.order_details) ? raw.order_details : null;
  const user = isRecord(refund.user) ? refund.user : null;
  const order = isRecord(refund.order) ? refund.order : null;

  if (refund.id == null) return null;

  return {
    id: refund.id as number | string,
    refund_id: asString(refund.refund_id) ?? asString(refund.refundId),
    order_id:
      typeof refund.order_id === "number" || typeof refund.order_id === "string"
        ? refund.order_id
        : typeof order?.id === "number" || typeof order?.id === "string"
          ? order.id
          : undefined,
    order_number:
      asString(orderDetails?.order_id) ?? asString(order?.order_number),
    customer_name: asString(customer?.name) ?? asString(user?.name),
    customer_email: asString(customer?.email) ?? asString(user?.email),
    customer_phone: asString(customer?.phone) ?? asString(user?.phone),
    amount: toNumber(
      orderDetails?.refund_amount ?? refund.amount ?? orderDetails?.amount
    ),
    status: asString(refund.status) ?? "",
    reason: asString(refund.reason),
    description: asString(refund.description),
    payment_method: asString(orderDetails?.payment_method),
    gateway: asString(orderDetails?.gateway),
    created_at:
      asString(refund.requested_at) ?? asString(refund.created_at),
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

  fetchRefunds: async (
    page = 1,
    pageSize = 10,
    filter: RefundFilter = "all",
    search = ""
  ) => {
    set({ loadingRefunds: true, refundsError: null });
    try {
      const params: Record<string, string | number> = {
        page,
        size: pageSize,
        search: search.trim(),
      };
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
      console.error(
        "Error fetching refund detail =>",
        getApiErrorMessage(error) ?? "Failed to fetch refund detail"
      );
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
