import { create } from "zustand";
import { toast } from "sonner";
import api from "@/lib/api";
import type {
  Campaign,
  CreateCampaignPayload,
  CreateTemplateRequest,
  NotificationApiEntry,
  NotificationData,
  NotificationPreferenceSettings,
  NotificationsResponse,
  NotificationStatsResponse,
  NotificationTemplate,
  SendNotificationPayload,
} from "@/types/NotificationTypes";
import {
  getNotificationPaginationMeta,
  getNotificationRows,
  getUnreadNotificationCount,
  NOTIFICATION_SETTINGS_ENDPOINT,
  NOTIFICATIONS_ENDPOINT,
  NOTIFICATIONS_UNREAD_ENDPOINT,
} from "@/lib/notification";
import { AxiosError } from "axios";

export type NotificationTab = "all" | "unread";

type NotificationsStore = {
  activeTab: NotificationTab;
  notifications: NotificationApiEntry[];
  loading: boolean;
  loadingMore: boolean;
  page: number;
  lastPage: number;
  unreadCount: number;
  notificationStats: NotificationData | null;
  isFetchingStats: boolean;
  creatingTemplate: boolean;
  templates: NotificationTemplate[];
  campaigns: Campaign[] | null;
  notificationSettings: NotificationPreferenceSettings | null;
  loadingNotificationSettings: boolean;
  savingNotificationSettings: boolean;
  notificationSettingsError: string | null;

  setActiveTab: (tab: NotificationTab) => void;
  fetchNotifications: (options?: {
    tab?: NotificationTab;
    page?: number;
    append?: boolean;
  }) => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  getNotificationStats: () => Promise<void>;
  createTemplate: (body: CreateTemplateRequest) => Promise<boolean>;
  editTemplate: (id: number, body: CreateTemplateRequest) => Promise<boolean>;
  deleteTemplate: (id: string) => Promise<boolean>;
  getTemplates: () => Promise<void>;
  toggleTemplate: (id: number) => Promise<boolean>;
  createCampaign: (payload: CreateCampaignPayload) => Promise<boolean>;
  deleteCampaign: (campaignId: string) => Promise<boolean>;
  getCampaigns: () => Promise<void>;
  sendNotification: (payload: SendNotificationPayload) => Promise<boolean>;
  fetchNotificationSettings: () => Promise<boolean>;
  updateNotificationSettings: (
    payload: NotificationPreferenceSettings
  ) => Promise<boolean>;
};

export const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  activeTab: "all",
  notifications: [],
  loading: false,
  loadingMore: false,
  page: 1,
  lastPage: 1,
  unreadCount: 0,
  notificationStats: null,
  isFetchingStats: false,
  creatingTemplate: false,
  templates: [] as NotificationTemplate[],
  campaigns: null,
  notificationSettings: null,
  loadingNotificationSettings: false,
  savingNotificationSettings: false,
  notificationSettingsError: null,

  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },

  fetchNotifications: async (options) => {
    const tab = options?.tab ?? get().activeTab;
    const page = options?.page ?? 1;
    const append = options?.append ?? false;

    if (append) set({ loadingMore: true });
    else set({ loading: true });

    try {
      const endpoint =
        tab === "unread"
          ? NOTIFICATIONS_UNREAD_ENDPOINT
          : NOTIFICATIONS_ENDPOINT;
      const { data } = await api.get<NotificationsResponse>(endpoint, {
        params: { page, per_page: 20 },
      });

      const rows = getNotificationRows(data);
      const meta = getNotificationPaginationMeta(data);
      const nextUnread =
        tab === "all" ? getUnreadNotificationCount(data) : get().unreadCount;

      set((state) => {
        const notifications = append
          ? (() => {
              const seen = new Set(state.notifications.map((n) => n.id));
              const merged = [...state.notifications];
              for (const row of rows) {
                if (!seen.has(row.id)) merged.push(row);
              }
              return merged;
            })()
          : rows;

        return {
          notifications,
          page: meta.currentPage,
          lastPage: meta.lastPage,
          unreadCount: nextUnread,
        };
      });
    } catch (err) {
      console.error("Notifications fetch error:", err);
      if (!append) {
        set({ notifications: [], page: 1, lastPage: 1 });
      }
    } finally {
      if (append) set({ loadingMore: false });
      else set({ loading: false });
    }
  },

  markAsRead: async (notificationId) => {
    const { activeTab } = get();
    let wasUnread = false;
    set((state) => {
      const target = state.notifications.find((n) => n.id === notificationId);
      wasUnread = target
        ? typeof target.is_read === "boolean"
          ? !target.is_read
          : target.read_at === null
        : false;
      const unreadCount = wasUnread
        ? Math.max(0, state.unreadCount - 1)
        : state.unreadCount;
      const notifications =
        activeTab === "unread"
          ? state.notifications.filter((n) => n.id !== notificationId)
          : state.notifications.map((n) =>
              n.id === notificationId
                ? {
                    ...n,
                    is_read: true,
                    read_at: n.read_at ?? new Date().toISOString(),
                  }
                : n,
            );
      return { notifications, unreadCount };
    });

    try {
      await api.post(`/api/notifications/${notificationId}/mark-read`, {});
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      toast.error("Failed to mark notification as read");
    }
  },

  refreshUnreadCount: async () => {
    try {
      const { data } = await api.get<NotificationsResponse>(
        NOTIFICATIONS_ENDPOINT,
        {
          params: { page: 1, per_page: 1 },
        },
      );
      set({ unreadCount: getUnreadNotificationCount(data) });
    } catch (err) {
      console.error("Unread notification count fetch error:", err);
    }
  },

  getNotificationStats: async () => {
    const { notificationStats, isFetchingStats } = get();

    if (notificationStats || isFetchingStats) return;
    try {
      set({ isFetchingStats: true });
      const res = await api.get<NotificationStatsResponse>(
        "/api/admin/notifications/stats",
      );

      if (res.data) {
        set({ notificationStats: res.data.data });
      }
    } catch (err) {
      console.error("Error getting notification stats:", err);
    } finally {
      set({ isFetchingStats: false });
    }
  },

  createTemplate: async (body: CreateTemplateRequest) => {
    try {
      set({ creatingTemplate: true });
      const response = await api.post<{ success: boolean; message?: string }>(
        "/api/admin/notifications/templates",
        body,
      );

      if (response.data.success || response.status === 201) {
        toast.success("New Template Created");
        return true;
      }
      return true;
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<{
        message: string;
        errors: Record<string, string[]>;
      }>;

      if (axiosError.response) {
        if (axiosError.response.status === 422) {
          const validationErrors = axiosError.response.data.errors;
          const firstError = Object.values(validationErrors)[0];

          console.error("Validation failed:", validationErrors);
          toast.error(firstError);
        } else {
          const message =
            axiosError.response.data.message || "An un expected error occured";
          toast.error(message);
        }
      } else {
        console.error("Network error:", axiosError.message);
        toast.error("Check your internet connection");
      }

      return false;
    } finally {
      set({ creatingTemplate: false });
    }
  },

  editTemplate: async (id: number, body: CreateTemplateRequest) => {
    try {
      set({ creatingTemplate: true });

      const response = await api.put<{
        success: boolean;
        data: NotificationTemplate;
      }>(`/api/admin/notifications/templates/${id}`, body);

      if (response.data.success || response.status === 200) {
        // 2. Update the local state array
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id.toString() === id.toString()
              ? { ...t, ...body, ...response.data.data }
              : t,
          ),
        }));

        toast.success("Template updated successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<{
        message: string;
        errors: Record<string, string[]>;
      }>;

      if (axiosError.response) {
        if (axiosError.response.status === 422) {
          const validationErrors = axiosError.response.data.errors;
          const firstError = Object.values(validationErrors)[0];

          console.error("Validation failed:", validationErrors);
          toast.error(firstError);
        } else {
          const message =
            axiosError.response.data.message || "An un expected error occured";
          toast.error(message);
        }
      } else {
        console.error("Network error:", axiosError.message);
        toast.error("Check your internet connection");
      }

      return false;
    } finally {
      set({ creatingTemplate: false });
    }
  },

  getTemplates: async () => {
    try {
      const { data } = await api.get(
        "/api/admin/notifications/templates?is_active=true",
      );
      set({ templates: data.data });
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  },

  toggleTemplate: async (id: number) => {
    try {
      const response = await api.patch<{
        success: boolean;
        data: { is_active: boolean };
      }>(`/api/admin/notifications/templates/${id}/toggle`);

      if (response.data.success) {
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, is_active: response.data.data.is_active } : t,
          ),
        }));

        toast.success(
          response.data.data.is_active
            ? "Template Enabled"
            : "Template Disabled",
        );
        return true;
      }
      return false;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to toggle template";
      toast.error(errorMessage);
      console.error("Toggle error:", error);
      return false;
    }
  },

  deleteTemplate: async (id: string) => {
    try {
      const response = await api.delete<{ success: boolean }>(
        `/api/admin/notifications/templates/${id}`,
      );

      if (response.data.success || response.status === 200) {
        set((state) => ({
          templates: state.templates.filter((t) => t.id.toString() !== id),
        }));
        toast.success("Template deleted successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete template");
      return false;
    }
  },

  createCampaign: async (payload: CreateCampaignPayload) => {
    try {
      const response = await api.post<{
        success: boolean;
        message: string;
        data: any;
      }>(`/api/admin/notifications/campaigns`, payload);

      toast.success(response.data.message || "Campaign created successfully");
      return true;
    } catch (error) {
      console.error("create campaign:", error);
      toast.error("Failed to create campaign");
      return false;
    }
  },

  deleteCampaign: async (campaignId: string) => {
    const { campaigns } = get();
    try {
      const response = await api.delete<{
        success: boolean;
        message: string;
        data: any;
      }>(`/api/admin/notifications/campaigns/${campaignId}`);

      toast.success(response.data.message || "Campaign delete successfully");
      const newCampaigns = campaigns?.filter(
        (c) => c.id !== Number(campaignId),
      );
      set({ campaigns: newCampaigns });
      return true;
    } catch (error) {
      console.error("delete campaign:", error);
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data.message || "Failed to delete campaign",
        );
      } else {
        toast.error("Failed to delete campaign");
      }
      return false;
    }
  },

  getCampaigns: async () => {
    try {
      const response = await api.get<{
        success: boolean;
        data: { data: Campaign[] };
      }>("/api/admin/notifications/campaigns");

      if (response.data.success) {
        set({ campaigns: response.data.data.data }); // update your store state
      }
    } catch (error) {
      console.error("Get campaigns error:", error);
      set({ campaigns: [] });
    }
  },

  sendNotification: async (payload: SendNotificationPayload) => {
    try {
      const response = await api.post<{
        success: boolean;
        data: any;
        message: string;
        code: number;
      }>("/api/admin/notifications/send", payload);

      toast.success(response.data.message || "Notification sent successfully");
      return true;
    } catch (error) {
      console.error("Get campaigns error:", error);
      toast.error("Failed to send notification");
      set({ campaigns: [] });
      return false;
    }
  },

  fetchNotificationSettings: async () => {
    set({
      loadingNotificationSettings: true,
      notificationSettingsError: null,
    });
    try {
      const { data } = await api.get<{
        status?: string;
        success?: boolean;
        message?: string;
        data?: NotificationPreferenceSettings;
      }>(NOTIFICATION_SETTINGS_ENDPOINT);

      if (data?.status && data.status !== "success") {
        const message =
          typeof data.message === "string"
            ? data.message
            : "Failed to load notification settings";
        set({ notificationSettingsError: message });
        return false;
      }

      const settings = parseNotificationSettings(data?.data ?? data);
      if (!settings) {
        set({
          notificationSettingsError: "Failed to load notification settings",
        });
        return false;
      }

      set({ notificationSettings: settings });
      return true;
    } catch (error: unknown) {
      const message =
        getNotificationSettingsError(error) ??
        "Failed to load notification settings";
      console.error("Error fetching notification settings =>", error);
      set({ notificationSettingsError: message });
      return false;
    } finally {
      set({ loadingNotificationSettings: false });
    }
  },

  updateNotificationSettings: async (payload) => {
    set({ savingNotificationSettings: true, notificationSettingsError: null });
    try {
      const { data } = await api.put<{
        status?: string;
        success?: boolean;
        message?: string;
        data?: NotificationPreferenceSettings;
      }>(NOTIFICATION_SETTINGS_ENDPOINT, payload);

      if (data?.status && data.status !== "success") {
        const message =
          typeof data.message === "string"
            ? data.message
            : "Failed to save notification settings";
        toast.error(message);
        set({ notificationSettingsError: message });
        return false;
      }

      const settings =
        parseNotificationSettings(data?.data ?? data) ?? payload;
      set({ notificationSettings: settings });
      return true;
    } catch (error: unknown) {
      const message =
        getNotificationSettingsError(error) ??
        "Failed to save notification settings";
      console.error("Error updating notification settings =>", error);
      toast.error(message);
      set({ notificationSettingsError: message });
      return false;
    } finally {
      set({ savingNotificationSettings: false });
    }
  },
}));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function parseNotificationSettings(
  raw: unknown
): NotificationPreferenceSettings | null {
  if (!isRecord(raw)) return null;
  const login = raw.login_attempts;
  const push = raw.push_notifications;
  const reminders = raw.reminders;
  if (!isRecord(login) || !isRecord(push) || !isRecord(reminders)) return null;
  return {
    login_attempts: {
      email: asBoolean(login.email),
      push: asBoolean(login.push),
      sms: asBoolean(login.sms),
    },
    push_notifications: {
      do_not_notify: asBoolean(push.do_not_notify),
      all_reminders: asBoolean(push.all_reminders),
    },
    reminders: {
      do_not_notify: asBoolean(reminders.do_not_notify),
      important_reminders_only: asBoolean(reminders.important_reminders_only),
      all_reminders: asBoolean(reminders.all_reminders),
    },
  };
}

function getNotificationSettingsError(err: unknown): string | null {
  if (!isRecord(err)) return null;
  const response = err.response;
  if (!isRecord(response)) return null;
  const data = response.data;
  if (!isRecord(data)) return null;
  return typeof data.message === "string" ? data.message : null;
}
