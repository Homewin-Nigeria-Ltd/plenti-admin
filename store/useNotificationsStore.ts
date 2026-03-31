import { create } from "zustand";
import { toast } from "sonner";
import api from "@/lib/api";
import type { NotificationApiEntry, NotificationsResponse } from "@/types/NotificationTypes";
import {
  getNotificationPaginationMeta,
  getNotificationRows,
  getUnreadNotificationCount,
  NOTIFICATIONS_ENDPOINT,
  NOTIFICATIONS_UNREAD_ENDPOINT,
} from "@/lib/notification";

export type NotificationTab = "all" | "unread";

type NotificationsStore = {
  activeTab: NotificationTab;
  notifications: NotificationApiEntry[];
  loading: boolean;
  loadingMore: boolean;
  page: number;
  lastPage: number;
  unreadCount: number;
  setActiveTab: (tab: NotificationTab) => void;
  fetchNotifications: (options?: { tab?: NotificationTab; page?: number; append?: boolean }) => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
};

export const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  activeTab: "all",
  notifications: [],
  loading: false,
  loadingMore: false,
  page: 1,
  lastPage: 1,
  unreadCount: 0,

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
      const endpoint = tab === "unread" ? NOTIFICATIONS_UNREAD_ENDPOINT : NOTIFICATIONS_ENDPOINT;
      const { data } = await api.get<NotificationsResponse>(endpoint, {
        params: { page, per_page: 20 },
      });

      const rows = getNotificationRows(data);
      const meta = getNotificationPaginationMeta(data);
      const nextUnread = tab === "all" ? getUnreadNotificationCount(data) : get().unreadCount;

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
        ? (typeof target.is_read === "boolean" ? !target.is_read : target.read_at === null)
        : false;
      const unreadCount = wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount;
      const notifications = activeTab === "unread"
        ? state.notifications.filter((n) => n.id !== notificationId)
        : state.notifications.map((n) =>
            n.id === notificationId
              ? { ...n, is_read: true, read_at: n.read_at ?? new Date().toISOString() }
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
      const { data } = await api.get<NotificationsResponse>(NOTIFICATIONS_ENDPOINT, {
        params: { page: 1, per_page: 1 },
      });
      set({ unreadCount: getUnreadNotificationCount(data) });
    } catch (err) {
      console.error("Unread notification count fetch error:", err);
    }
  },
}));

