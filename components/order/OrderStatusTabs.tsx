"use client";

import { cn } from "@/lib/utils";
import {
  ORDER_STATUS_TABS,
  type OrderStatusTab,
} from "@/components/order/orderManagementView";
import type { OrderStatusCounts } from "@/types/OrderTypes";

type OrderStatusTabsProps = {
  value: OrderStatusTab;
  onChange: (tab: OrderStatusTab) => void;
  statusCounts?: OrderStatusCounts | null;
};

function tabCount(
  tab: (typeof ORDER_STATUS_TABS)[number],
  statusCounts?: OrderStatusCounts | null,
) {
  if (!statusCounts) return null;
  const key = tab.id === "all" ? "all" : tab.query ?? tab.id;
  const value =
    statusCounts[key as keyof OrderStatusCounts] ??
    (tab.id === "canceled" ? statusCounts.cancelled : undefined);
  return value == null ? null : Number(value);
}

export default function OrderStatusTabs({
  value,
  onChange,
  statusCounts,
}: OrderStatusTabsProps) {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-end gap-1 border-b border-[#EAECF0]">
        {ORDER_STATUS_TABS.map((tab) => {
          const active = value === tab.id;
          const count = tabCount(tab, statusCounts);
          const label = count == null ? "-" : count.toLocaleString("en-US");
          const isPending = tab.id === "pending" || tab.id === "refund_pending";
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative flex items-center gap-2 px-3 pb-3 pt-1 text-sm whitespace-nowrap",
                active
                  ? "font-semibold text-[#2F5BDB]"
                  : "font-medium text-[#667085] hover:text-[#344054]",
              )}
            >
              <span>{tab.label}</span>
              {isPending ? (
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-[11px] font-semibold",
                    active
                      ? "bg-[#FFF6ED] text-[#F38744]"
                      : "bg-[#F2F4F7] text-[#667085]",
                  )}
                >
                  {label}
                </span>
              ) : (
                <span
                  className={cn(
                    "text-[13px] font-medium",
                    active ? "text-[#2F5BDB]" : "text-[#98A2B3]",
                  )}
                >
                  {label}
                </span>
              )}
              {active ? (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#2F5BDB]" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
