import api from "@/lib/api";
import { PAGE_SIZE } from "@/lib/constant";
import { ORDERS_API } from "@/data/orders";
import {
  Order,
  OrderState,
  OrderStatusCounts,
  OrdersListResponse,
  OrderStatistics,
} from "@/types/OrderTypes";
import { create } from "zustand";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function parseStatusCounts(value: unknown): OrderStatusCounts | null {
  const obj = asRecord(value);
  if (!obj) return null;
  const keys: (keyof OrderStatusCounts)[] = [
    "all",
    "pending",
    "processing",
    "accepted",
    "packed",
    "in_transit",
    "delivered",
    "cancelled",
    "canceled",
    "refund_pending",
    "refunded",
  ];
  const counts: OrderStatusCounts = {};
  let found = false;
  for (const key of keys) {
    const n = Number(obj[key]);
    if (Number.isFinite(n)) {
      counts[key] = n;
      found = true;
    }
  }
  return found ? counts : null;
}

function extractStatusCounts(body: unknown, depth = 0): OrderStatusCounts | null {
  if (depth > 4) return null;
  const direct = parseStatusCounts(body);
  if (direct) return direct;
  const root = asRecord(body);
  if (!root) return null;
  return (
    parseStatusCounts(root.status_counts) ??
    extractStatusCounts(root.data, depth + 1)
  );
}

function unwrapIncoming(body: unknown): {
  orders: Order[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
} {
  const root = asRecord(body);
  const data = root && "data" in root ? root.data : body;

  if (Array.isArray(data)) {
    return {
      orders: data as Order[],
      currentPage: 1,
      lastPage: 1,
      perPage: data.length || PAGE_SIZE,
      total: data.length,
    };
  }

  const obj = asRecord(data);
  const rows = Array.isArray(obj?.data)
    ? (obj.data as Order[])
    : Array.isArray(obj?.orders)
      ? (obj.orders as Order[])
      : Array.isArray(obj?.items)
        ? (obj.items as Order[])
        : [];
  return {
    orders: rows,
    currentPage: Number(obj?.current_page ?? 1) || 1,
    lastPage: Number(obj?.last_page ?? 1) || 1,
    perPage: Number(obj?.per_page ?? rows.length) || PAGE_SIZE,
    total: Number(obj?.total ?? rows.length) || rows.length,
  };
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  incomingOrders: [],
  singleOrder: null,
  orderStats: null,
  statusCounts: null,
  loading: false,
  loadingIncoming: false,
  loadingSingle: false,
  loadingStats: false,
  exporting: false,
  error: null,
  incomingError: null,
  statsError: null,
  currentPage: 1,
  lastPage: 1,
  perPage: PAGE_SIZE,
  totalItems: 0,
  incomingPage: 1,
  incomingLastPage: 1,
  incomingPerPage: PAGE_SIZE,
  incomingTotal: 0,
  lastQuery: { page: 1, search: "", delivery_provider: "" },
  lastIncomingQuery: { page: 1, search: "", per_page: PAGE_SIZE },

  fetchOrders: async (params) => {
    const page = params?.page ?? 1;
    const search = params?.search?.trim() ?? "";
    const deliveryProvider = params?.delivery_provider?.trim() ?? "";
    const status = params?.status?.trim() ?? "";
    const warehouseId = params?.warehouse_id?.trim() ?? "";
    const paymentMethod = params?.payment_method?.trim() ?? "";
    const startDate = params?.start_date?.trim() ?? "";
    const endDate = params?.end_date?.trim() ?? "";
    set({
      loading: true,
      error: null,
      lastQuery: {
        page,
        search,
        delivery_provider: deliveryProvider,
        status,
        warehouse_id: warehouseId,
        payment_method: paymentMethod,
        start_date: startDate,
        end_date: endDate,
      },
    });

    try {
      const query: Record<string, string | number> = {
        page,
        search,
        per_page: PAGE_SIZE,
      };
      if (deliveryProvider) {
        query.delivery_provider = deliveryProvider;
      }
      if (status) query.status = status;
      if (warehouseId) query.warehouse_id = warehouseId;
      if (paymentMethod) query.payment_method = paymentMethod;
      if (startDate) query.start_date = startDate;
      if (endDate) query.end_date = endDate;

      const { data } = await api.get<OrdersListResponse>(ORDERS_API.getOrders, {
        params: query,
      });

      const paginated = data.data;
      const statusCounts = extractStatusCounts(data);
      set({
        orders: paginated.data ?? [],
        currentPage: paginated.current_page ?? 1,
        lastPage: paginated.last_page ?? 1,
        perPage: paginated.per_page ?? PAGE_SIZE,
        totalItems: paginated.total ?? 0,
        ...(statusCounts ? { statusCounts } : {}),
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

  fetchIncomingOrders: async (params) => {
    const page = params?.page ?? 1;
    const search = params?.search?.trim() ?? "";
    const perPage = params?.per_page ?? PAGE_SIZE;
    set({
      loadingIncoming: true,
      incomingError: null,
      lastIncomingQuery: { page, search, per_page: perPage },
    });

    try {
      const query: Record<string, string | number> = {
        page,
        per_page: perPage,
      };
      if (search) query.search = search;

      const { data } = await api.get(ORDERS_API.getIncoming, { params: query });
      const parsed = unwrapIncoming(data);
      set({
        incomingOrders: parsed.orders,
        incomingPage: parsed.currentPage,
        incomingLastPage: parsed.lastPage,
        incomingPerPage: parsed.perPage,
        incomingTotal: parsed.total,
      });
      return true;
    } catch (error) {
      console.error("Error fetching incoming orders =>", error);
      set({
        incomingError: "Failed to fetch incoming orders",
        incomingOrders: [],
        incomingTotal: 0,
      });
      return false;
    } finally {
      set({ loadingIncoming: false });
    }
  },

  fetchSingleOrders: async (id, options) => {
    const silent = options?.silent === true;
    if (!silent) set({ loadingSingle: true });
    try {
      const { data: body } = await api.get<{ status?: string; data?: Order } | Order>(
        `${ORDERS_API.getOrder}/${id}`,
      );
      const order =
        body &&
        typeof body === "object" &&
        "data" in body &&
        body.data != null &&
        typeof body.data === "object"
          ? body.data
          : (body as Order);
      set({ singleOrder: order?.id != null ? order : null });
      return true;
    } catch (error) {
      console.error("Error fetching order =>", error);
      set({ error: "Failed to fetch order" });
      return false;
    } finally {
      if (!silent) set({ loadingSingle: false });
    }
  },

  fetchOrderStats: async (params) => {
    set({ loadingStats: true, statsError: null });
    try {
      const query: Record<string, string> = {};
      const startDate = params?.start_date?.trim() ?? "";
      const endDate = params?.end_date?.trim() ?? "";
      if (startDate) query.start_date = startDate;
      if (endDate) query.end_date = endDate;
      const { data } = await api.get<{ data: OrderStatistics }>(
        ORDERS_API.getStatistics,
        { timeout: 8000, params: query }
      );
      set({ orderStats: data.data ?? null });
      return true;
    } catch (error) {
      console.error("Order statistics:", error);
      set({ statsError: "Failed to fetch order statistics", orderStats: null });
      return false;
    } finally {
      set({ loadingStats: false });
    }
  },

  exportOrders: async (params) => {
    const search = params?.search?.trim() ?? "";
    const deliveryProvider = params?.delivery_provider?.trim() ?? "";
    const status = params?.status?.trim() ?? "";
    const warehouseId = params?.warehouse_id?.trim() ?? "";
    const paymentMethod = params?.payment_method?.trim() ?? "";
    const startDate = params?.start_date?.trim() ?? "";
    const endDate = params?.end_date?.trim() ?? "";
    set({ exporting: true });
    try {
      const query: Record<string, string> = {};
      if (search) query.search = search;
      if (deliveryProvider) query.delivery_provider = deliveryProvider;
      if (status) query.status = status;
      if (warehouseId) query.warehouse_id = warehouseId;
      if (paymentMethod) query.payment_method = paymentMethod;
      if (startDate) query.start_date = startDate;
      if (endDate) query.end_date = endDate;

      const response = await api.get(ORDERS_API.exportOrders, {
        params: query,
        responseType: "blob",
        headers: { Accept: "text/csv, application/octet-stream, */*" },
      });

      const blob =
        response.data instanceof Blob
          ? response.data
          : new Blob([response.data], { type: "text/csv" });

      if (blob.type.includes("application/json")) {
        const text = await blob.text();
        let message = "Failed to export orders";
        try {
          const parsed = JSON.parse(text) as { message?: string };
          if (parsed.message?.trim()) message = parsed.message;
        } catch {
          if (text.trim()) message = text;
        }
        throw new Error(message);
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
    } catch (error) {
      console.error("Error exporting orders =>", error);
      throw new Error(await messageFromExportBlob(error));
    } finally {
      set({ exporting: false });
    }
  },

  setSingleOrder: () => {
    set({ singleOrder: null });
  },
}));

function filenameFromDisposition(header: unknown): string {
  if (typeof header !== "string" || !header) return "orders.csv";
  const utfMatch = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (utfMatch?.[1]) {
    try {
      return decodeURIComponent(utfMatch[1].trim());
    } catch {
      return utfMatch[1].trim();
    }
  }
  const match = header.match(/filename="?([^"]+)"?/i);
  return match?.[1]?.trim() || "orders.csv";
}

async function messageFromExportBlob(error: unknown): Promise<string> {
  if (typeof error === "object" && error !== null) {
    const data = (error as { response?: { data?: unknown } }).response?.data;
    if (data instanceof Blob) {
      const text = await data.text();
      try {
        const parsed = JSON.parse(text) as { message?: string };
        if (parsed.message?.trim()) return parsed.message;
      } catch {
        if (text.trim()) return text;
      }
    }
    const message = (error as { message?: string }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return "Failed to export orders";
}
