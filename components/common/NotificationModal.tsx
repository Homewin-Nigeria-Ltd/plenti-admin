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

type NotificationItem = {
  id: string;
  category: string;
  title: string;
  message: string;
  time: string;
  linkLabel: string;
  unread?: boolean;
};

const AVATAR_BG = ["bg-[#E8EEFF]", "bg-[#EEF2FF]", "bg-[#F2F4F7]"] as const;

const DUMMY_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    category: "Menu Management",
    title: "Delivery",
    message: "Ogabi Michel has just picked up meal from Home town",
    time: "February 2, 2024 | 11:32AM",
    linkLabel: "Check out Menu Management",
  },
  {
    id: "2",
    category: "Order Management",
    title: "New Order",
    message: "Oluwanifemi Osunsanya has ordered a meal from Home Town Eat hub",
    time: "February 2, 2024 | 11:32AM",
    linkLabel: "Check out Order Management",
    unread: true,
  },
  {
    id: "3",
    category: "Meal Management",
    title: "New Meal",
    message: "A new meal has been added to Chinese World",
    time: "February 2, 2024 | 11:32AM",
    linkLabel: "Check out Meal Management",
  },
  {
    id: "4",
    category: "Menu Management",
    title: "New Meal",
    message: "A new meal has been added to Chinese World",
    time: "February 2, 2024 | 11:32AM",
    linkLabel: "Check out Menu Management",
    unread: true,
  },
  {
    id: "5",
    category: "Inventory",
    title: "Low Stock Alert",
    message: "Rice 50kg in Abuja Central is below threshold",
    time: "February 2, 2024 | 11:32AM",
    linkLabel: "Check out Stock Alerts",
  },
];

type NotificationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const [tab, setTab] = React.useState<"all" | "unread">("all");

  const items = React.useMemo(() => {
    if (tab === "all") return DUMMY_NOTIFICATIONS;
    return DUMMY_NOTIFICATIONS.filter((item) => item.unread);
  }, [tab]);

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

          {items.length === 0 ? (
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
                            AVATAR_BG[Number(item.id) % AVATAR_BG.length]
                          )}
                        >
                          RU
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm text-[#101928] font-medium min-w-0">
                        {item.title}
                        <span className="font-normal text-[#98A2B3]">: {item.message}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-[#0B1E66] underline text-left shrink-0"
                    >
                      {item.linkLabel}
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
