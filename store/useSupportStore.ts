import api from "@/lib/api";
import type {
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

  statistics: null,
  loadingStatistics: false,
  statisticsError: null,

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
      set({ singleTicket: updated });
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
      set({ singleTicket: updated });
      return true;
    } catch (error: unknown) {
      console.error("Error updating ticket status =>", error);
      return false;
    } finally {
      set({ updatingStatus: false });
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
}));
