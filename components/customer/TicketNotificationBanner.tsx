"use client";

import * as React from "react";
import { X } from "lucide-react";
import Image from "next/image";

type TicketNotificationBannerProps = {
  ticketNumber: string;
  timeRemaining: string;
  onView?: () => void;
  onClose?: () => void;
};

export default function TicketNotificationBanner({
  ticketNumber,
  timeRemaining,
  onView,
  onClose,
}: TicketNotificationBannerProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <div className="bg-[#FBEAE9] rounded-[8px] p-4 flex items-center gap-4">
      {/* Alarm Clock Icon */}
      <Image
        src={"/icons/clock.png"}
        alt="clock"
        width={100}
        height={100}
        className="size-[35px]"
      />

      {/* Text Content */}
      <div className="flex-1">
        <p className="text-sm mb-1">
          <span className="font-medium text-[#101928]">
            Ticket #{ticketNumber}
          </span>{" "}
          <span className="font-medium text-red-600">{timeRemaining}</span>
        </p>
        <p className="text-sm font-normal text-gray-500">
          Ticket #{ticketNumber} is approaching its deadline and requires urgent
          attention.
        </p>
      </div>

      {/* View Ticket Link */}
      <button
        onClick={onView}
        className="text-[#1F3A78] underline text-sm font-medium hover:text-[#1F3A78]/80 transition-colors"
      >
        View Ticket
      </button>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="shrink-0 text-[#101928] hover:text-gray-600 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
