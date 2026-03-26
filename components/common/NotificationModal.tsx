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
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type {
  NotificationItem,
  NotificationModalProps,
  NotificationsResponse,
} from "@/types/NotificationTypes";
import {
  getInitials,
  getNotificationRows,
  mapNotification,
  NOTIFICATIONS_UNREAD_PATH,
  parseNotificationRowsFromEnvelope,
} from "@/lib/notification";

const AVATAR_BG = ["bg-[#E8EEFF]", "bg-[#EEF2FF]", "bg-[#F2F4F7]"] as const;

export function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const router = useRouter();
  const [tab, setTab] = React.useState<"all" | "unread">("all");
  const [loading, setLoading] = React.useState(false);
  const [markingReadId, setMarkingReadId] = React.useState<number | null>(null);
  const [allNotifications, setAllNotifications] = React.useState<NotificationItem[]>([]);
  const [unreadNotifications, setUnreadNotifications] = React.useState<NotificationItem[]>([]);

  React.useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const [allResult, unreadResult] = await Promise.allSettled([
          api.get<NotificationsResponse>("/api/admin/notifications", {
            params: { page: 1, per_page: 20 },
          }),
          api.get<NotificationsResponse>(NOTIFICATIONS_UNREAD_PATH, {
            params: { page: 1, per_page: 50 },
          }),
        ]);

        if (cancelled) return;

        if (allResult.status === "fulfilled") {
          const mappedAll = getNotificationRows(allResult.value.data).map(mapNotification);
          setAllNotifications(mappedAll);
        } else {
          console.error("All notifications fetch error:", allResult.reason);
          setAllNotifications([]);
        }

        if (unreadResult.status === "fulfilled") {
          const mappedUnread = parseNotificationRowsFromEnvelope(
            unreadResult.value.data,
          ).map((n) => mapNotification({ ...n, read_at: n.read_at ?? null }));
          setUnreadNotifications(mappedUnread.map((n) => ({ ...n, unread: true })));
        } else {
          console.error("Unread notifications fetch error:", unreadResult.reason);
          setUnreadNotifications([]);
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Notifications fetch error:", err);
        setAllNotifications([]);
        setUnreadNotifications([]);
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    };

    fetchNotifications();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const items = React.useMemo(() => {
    if (tab === "all") return allNotifications;
    return unreadNotifications;
  }, [tab, allNotifications, unreadNotifications]);

  const handleItemClick = (item: NotificationItem) => {
    const url = item.actionUrl;
    if (!url) return;

    const run = async () => {
      if (item.unread) {
        try {
          setMarkingReadId(item.id);
          await api.patch(`/api/notifications/${item.id}/read`, {});
          setAllNotifications((prev) =>
            prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n)),
          );
          setUnreadNotifications((prev) => prev.filter((n) => n.id !== item.id));
        } catch (err) {
          console.error("Failed to mark notification as read:", err);
          toast.error("Failed to mark notification as read");
        } finally {
          setMarkingReadId(null);
        }
      }

      router.push(url);
      onClose();
    };

    void run();
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

        <div className="px-8 pb-6 h-full overflow-y-auto flex flex-col">
          <div className="sticky top-0 z-20 bg-white pt-2 pb-3 flex items-center gap-2 mb-2">
            <Button
              type="button"
              onClick={() => setTab("all")}
              variant="ghost"
              className={cn(
                "h-10 px-7 rounded-lg font-medium",
                tab === "all"
                  ? "bg-[#E8EEFF] text-[#0B1E66]"
                  : "text-[#98A2B3] hover:text-[#667085]"
              )}
            >
              All
            </Button>
            <Button
              type="button"
              onClick={() => setTab("unread")}
              variant="ghost"
              className={cn(
                "h-10 px-7 rounded-lg font-medium",
                tab === "unread"
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
                      {item.category}
                    </span>
                    <span className="text-sm text-[#98A2B3]">{item.time}</span>
                  </div>

                  <div
                    className={cn(
                      " bg-[#F9FAFB] px-4 py-3 flex items-center justify-between gap-4",
                      item.unread && "border-l-4 border-l-[#0B1E66]"
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
                      disabled={!item.actionUrl || markingReadId === item.id}
                    >
                     Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
