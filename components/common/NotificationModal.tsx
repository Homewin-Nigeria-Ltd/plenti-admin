"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Ghost, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import type {
  NotificationApiEntry,
  NotificationModalProps,
} from "@/types/NotificationTypes";
import {
  formatNotificationTime,
  getNotificationCategory,
  getInitials,
  resolveNotificationActionUrl,
} from "@/lib/notification";
import { useNotificationsStore } from "@/store/useNotificationsStore";

const AVATAR_BG = ["bg-[#E8EEFF]", "bg-[#EEF2FF]", "bg-[#F2F4F7]"] as const;

export function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const router = useRouter();
  const {
    activeTab,
    notifications,
    loading,
    loadingMore,
    page,
    lastPage,
    setActiveTab,
    fetchNotifications,
    markAsRead,
  } = useNotificationsStore();
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    void fetchNotifications({ tab: activeTab, page: 1, append: false });
  }, [isOpen, activeTab, fetchNotifications]);

  const isUnread = React.useCallback(
    (n: NotificationApiEntry) =>
      typeof n.is_read === "boolean" ? !n.is_read : n.read_at === null,
    [],
  );

  const items = React.useMemo(() => {
    if (activeTab === "all") return notifications;
    return notifications;
  }, [activeTab, notifications]);

  const loadMore = React.useCallback(async () => {
    if (!isOpen || loading || loadingMore || page >= lastPage) return;
    const nextPage = page + 1;
    await fetchNotifications({ tab: activeTab, page: nextPage, append: true });
  }, [isOpen, loading, loadingMore, page, lastPage, fetchNotifications, activeTab]);

  const handleScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el || loading || loadingMore || page >= lastPage) return;
    const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (remaining < 120) {
      void loadMore();
    }
  }, [loadMore, loading, loadingMore, page, lastPage]);

  const handleItemClick = (item: NotificationApiEntry) => {
    const url = resolveNotificationActionUrl(item);
    if (!url) return;
    if (isUnread(item)) {
      void markAsRead(item.id);
    }

    router.push(url);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="p-0 w-full max-w-[640px] h-screen max-h-screen overflow-hidden border-t-2 border-t-[#0B1E66] rounded-none top-0! right-0! left-auto! translate-x-0! translate-y-0! data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right data-[state=open]:duration-300 data-[state=closed]:duration-200 grid-rows-[auto_1fr] items-start"
        showCloseButton={false}
      >
        <DialogHeader className="px-8 pt-8 pb-4">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-[24px] font-semibold text-[#101928]">
              Notification
            </DialogTitle>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close notifications"
              className="size-9 rounded-full bg-[#E8EEFF] flex items-center justify-center"
            >
              <X className="size-5 text-[#0B1E66]" />
            </button>
          </div>
        </DialogHeader>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="px-8 pb-6 h-full overflow-y-auto flex flex-col"
        >
          <div className="sticky top-0 z-20 bg-white pt-2 pb-3 flex items-center gap-2 mb-2">
            <Button
              type="button"
              onClick={() => setActiveTab("all")}
              variant="ghost"
              className={cn(
                "h-10 px-7 rounded-lg font-medium",
                activeTab === "all"
                  ? "bg-[#E8EEFF] text-[#0B1E66]"
                  : "text-[#98A2B3] hover:text-[#667085]"
              )}
            >
              All
            </Button>
            <Button
              type="button"
              onClick={() => setActiveTab("unread")}
              variant="ghost"
              className={cn(
                "h-10 px-7 rounded-lg font-medium",
                activeTab === "unread"
                  ? "bg-[#E8EEFF] text-[#0B1E66]"
                  : "text-[#98A2B3] hover:text-[#667085]"
              )}
            >
              Unread
            </Button>
          </div>

          {loading ? (
            <div className="space-y-3 pb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-[#EAECF0] p-4 sm:p-5 animate-pulse"
                >
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-full bg-neutral-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-neutral-200 rounded w-36" />
                      <div className="h-3 bg-neutral-100 rounded w-64" />
                      <div className="h-3 bg-neutral-100 rounded w-32" />
                    </div>
                    <div className="h-8 w-16 bg-neutral-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="h-[70vh] min-h-[520px] flex flex-col items-center justify-center text-center -mt-12">
              <Ghost className="size-36 text-[#11297A]" strokeWidth={1.8} />
              <p className="mt-6 text-[24px] leading-tight font-semibold text-[#101928]">
                No Notifications yet
              </p>
              <p className="mt-3 text-lg leading-7 text-[#98A2B3] max-w-[420px]">
                System alerts, activity logs, and critical updates will appear here as they come in.
              </p>
            </div>
          ) : (
            <div className="space-y-3 pb-6">
              {items.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center rounded-md bg-[#EEF2FF] px-3 py-1 text-sm text-[#0B1E66] font-medium">
                      {item.module ?? getNotificationCategory(item.type)}
                    </span>
                    <span className="text-sm text-[#98A2B3]">
                      {item.display_time ??
                        item.relative_time ??
                        formatNotificationTime(item.delivered_at ?? item.created_at)}
                    </span>
                  </div>

                  <div
                    className={cn(
                      " bg-[#F9FAFB] px-4 py-3 flex items-center justify-between gap-4",
                      isUnread(item) && "border-l-4 border-l-[#0B1E66]"
                    )}
                  >
                    <div className="min-w-0 flex items-center gap-3">
                      <Avatar className="size-8 shrink-0 border border-[#E4E7EC]">
                        <AvatarFallback
                          className={cn(
                            "text-[#0B1E66] text-xs font-semibold",
                            AVATAR_BG[item.id % AVATAR_BG.length]
                          )}
                        >
                          {getInitials(item.title)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm text-[#101928] font-medium min-w-0">
                        {item.title}
                        <span className="font-normal text-[#98A2B3]">: {item.message}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleItemClick(item)}
                      className="text-sm text-[#0B1E66] underline text-left shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!resolveNotificationActionUrl(item)}
                    >
                     Open
                    </button>
                  </div>
                </div>
              ))}
              {loadingMore && (
                <div className="text-center text-sm text-[#98A2B3] py-2">Loading more...</div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
