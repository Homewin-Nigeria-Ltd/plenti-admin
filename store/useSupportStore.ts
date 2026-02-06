import api from "@/lib/api";
import type {
  CategoryStatistics,
  CreateTicketRequest,
  CreateTicketResult,
  ResolutionPeriod,
  ResolutionStatistics,
  SupportState,
  SupportStatistics,
  SupportTicketApi,
  SupportTicketDetail,
  SupportTicketsPagination,
} from "@/types/SupportTypes";
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

export const useSupportStore = create<SupportState>((set, get) => ({
  tickets: [],
  pagination: null,
  loadingTickets: false,
  ticketsError: null,

  singleTicket: null,
  loadingSingleTicket: false,
  singleTicketError: null,

  updatingPriority: false,
  updatingStatus: false,
  addingReply: false,
  creatingTicket: false,

  statistics: null,
  loadingStatistics: false,
  statisticsError: null,

  resolutionStatistics: null,
  loadingResolutionStatistics: false,
  resolutionStatisticsError: null,

  categoryStatistics: null,
  loadingCategoryStatistics: false,
  categoryStatisticsError: null,

  fetchTickets: async (page = 1, perPage = 10) => {
    set({ loadingTickets: true, ticketsError: null });
    try {
      const { data } = await api.get<{
        status?: string;
        data?: {
          tickets?: SupportTicketApi[];
          pagination?: SupportTicketsPagination;
        };
      }>("/api/admin/support/tickets", {
        params: { page, per_page: perPage },
      });

      const payload = data?.data;
      const tickets = Array.isArray(payload?.tickets) ? payload.tickets : [];
      const pagination = payload?.pagination ?? null;
      set({ tickets, pagination });
      return true;
    } catch (error: unknown) {
      const message =
        getApiErrorMessage(error) ?? "Failed to fetch support tickets";
      console.error("Error fetching support tickets =>", error);
      set({ ticketsError: message, tickets: [], pagination: null });
      return false;
    } finally {
      set({ loadingTickets: false });
    }
  },

  fetchSingleTicket: async (id: string | number) => {
    const ticketId = String(id);
    set({ loadingSingleTicket: true, singleTicketError: null });
    try {
      const { data } = await api.get<{
        status?: string;
        data?: SupportTicketDetail;
      }>(`/api/admin/support/tickets/${ticketId}`);

      const ticket = data?.data ?? null;
      set({ singleTicket: ticket });
      return !!ticket;
    } catch (error: unknown) {
      const message =
        getApiErrorMessage(error) ?? "Failed to fetch ticket details";
      console.error("Error fetching single ticket =>", error);
      set({ singleTicketError: message, singleTicket: null });
      return false;
    } finally {
      set({ loadingSingleTicket: false });
    }
  },

  clearSingleTicket: () => {
    set({ singleTicket: null, singleTicketError: null });
  },

  updateTicketPriority: async (ticketId: string | number, priority: string) => {
    const id = String(ticketId);
    set({ updatingPriority: true });
    try {
      const { data } = await api.patch<{
        status?: string;
        data?: Partial<SupportTicketDetail>;
      }>(`/api/admin/support/tickets/${id}/priority`, { priority });

      if (data?.status !== "success" || !data?.data) {
        return false;
      }
      const current = get().singleTicket;
      const updated =
        current != null
          ? { ...current, ...data.data }
          : (data.data as SupportTicketDetail);
      const idNum = Number(id);
      set({
        singleTicket: updated,
        tickets: get().tickets.map((t) =>
          t.id === idNum ? { ...t, priority: data.data!.priority ?? t.priority } : t
        ),
      });
      return true;
    } catch (error: unknown) {
      console.error("Error updating ticket priority =>", error);
      return false;
    } finally {
      set({ updatingPriority: false });
    }
  },

  updateTicketStatus: async (ticketId: string | number, status: string) => {
    const id = String(ticketId);
    set({ updatingStatus: true });
    try {
      const { data } = await api.patch<{
        status?: string;
        data?: Partial<SupportTicketDetail>;
      }>(`/api/admin/support/tickets/${id}/status`, { status });

      if (data?.status !== "success" || !data?.data) {
        return false;
      }
      const current = get().singleTicket;
      const updated =
        current != null
          ? { ...current, ...data.data }
          : (data.data as SupportTicketDetail);
      const idNum = Number(id);
      set({
        singleTicket: updated,
        tickets: get().tickets.map((t) =>
          t.id === idNum ? { ...t, status: (data.data!.status ?? t.status) as SupportTicketApi["status"] } : t
        ),
      });
      return true;
    } catch (error: unknown) {
      console.error("Error updating ticket status =>", error);
      return false;
    } finally {
      set({ updatingStatus: false });
    }
  },

  addTicketReply: async (ticketId: string | number, message: string) => {
    const id = String(ticketId);
    set({ addingReply: true });
    try {
      const { data } = await api.post<{
        status?: string;
        message?: string;
        data?: unknown;
      }>(`/api/admin/support/tickets/${id}/reply`, { message });

      if (data?.status !== "success") {
        return false;
      }
      await get().fetchSingleTicket(id);
      return true;
    } catch (error: unknown) {
      console.error("Error adding ticket reply =>", error);
      return false;
    } finally {
      set({ addingReply: false });
    }
  },

  createTicket: async (
    payload: CreateTicketRequest
  ): Promise<CreateTicketResult> => {
    set({ creatingTicket: true });
    try {
      const { data } = await api.post<{
        status?: string;
        message?: string;
        data?: unknown;
      }>("/api/admin/support/tickets", payload);

      if (data?.status !== "success") {
        return {
          ok: false,
          message:
            (typeof data?.message === "string" && data.message) ||
            "Failed to create ticket",
        };
      }
      await get().fetchTickets(1, 10);
      return { ok: true, data: data?.data };
    } catch (error: unknown) {
      const message =
        getApiErrorMessage(error) ?? "Failed to create ticket";
      console.error("Error creating ticket =>", error);
      return { ok: false, message };
    } finally {
      set({ creatingTicket: false });
    }
  },

  fetchSupportStatistics: async () => {
    set({ loadingStatistics: true, statisticsError: null });
    try {
      const { data } = await api.get<{
        status?: string;
        data?: SupportStatistics;
      }>("/api/admin/support/tickets/statistics");

      const statistics = data?.data ?? null;
      set({ statistics });
      return true;
    } catch (error: unknown) {
      const message =
        getApiErrorMessage(error) ?? "Failed to fetch support statistics";
      console.error("Error fetching support statistics =>", error);
      set({ statisticsError: message, statistics: null });
      return false;
    } finally {
      set({ loadingStatistics: false });
    }
  },

  fetchResolutionStatistics: async (period: ResolutionPeriod = "monthly") => {
    set({ loadingResolutionStatistics: true, resolutionStatisticsError: null });
    try {
      const { data } = await api.get<{
        status?: string;
        data?: ResolutionStatistics;
      }>("/api/admin/support/tickets/statistics/resolution", {
        params: { period },
      });

      const resolutionStatistics = data?.data ?? null;
      set({ resolutionStatistics });
      return true;
    } catch (error: unknown) {
      const message =
        getApiErrorMessage(error) ??
        "Failed to fetch resolution statistics";
      console.error("Error fetching resolution statistics =>", error);
      set({
        resolutionStatisticsError: message,
        resolutionStatistics: null,
      });
      return false;
    } finally {
      set({ loadingResolutionStatistics: false });
    }
  },

  fetchCategoryStatistics: async (period: ResolutionPeriod = "monthly") => {
    set({ loadingCategoryStatistics: true, categoryStatisticsError: null });
    try {
      const { data } = await api.get<{
        status?: string;
        data?: CategoryStatistics;
      }>("/api/admin/support/tickets/statistics/categories", {
        params: { period },
      });

      const categoryStatistics = data?.data ?? null;
      set({ categoryStatistics });
      return true;
    } catch (error: unknown) {
      const message =
        getApiErrorMessage(error) ?? "Failed to fetch category statistics";
      console.error("Error fetching category statistics =>", error);
      set({
        categoryStatisticsError: message,
        categoryStatistics: null,
      });
      return false;
    } finally {
      set({ loadingCategoryStatistics: false });
    }
  },
}));
