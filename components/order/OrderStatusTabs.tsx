"use client";

import { cn } from "@/lib/utils";
import {
  ORDER_STATUS_TABS,
  type OrderStatusTab,
} from "@/components/order/orderManagementView";
import type { OrderStatistics } from "@/types/OrderTypes";

const FALLBACK_TAB_COUNTS: Record<OrderStatusTab, number> = {
  all: 188,
  pending: 4,
  processing: 12,
  accepted: 9,
  packed: 6,
  in_transit: 8,
  delivered: 142,
  canceled: 3,
  refund_pending: 2,
  refunded: 1,
};

type OrderStatusTabsProps = {
  value: OrderStatusTab;
  onChange: (tab: OrderStatusTab) => void;
  stats: OrderStatistics | null;
  pendingCount?: number;
};

function tabCount(
  tab: (typeof ORDER_STATUS_TABS)[number],
  stats: OrderStatistics | null,
  pendingCount?: number,
) {
  const fallback = FALLBACK_TAB_COUNTS[tab.id];
  if (tab.id === "pending" && pendingCount != null) return pendingCount;
  if (!stats) return fallback;
  if (tab.id === "all") {
    if (stats.total_orders != null) return stats.total_orders;
    return (
      Number(stats.pending_orders ?? 0) +
      Number(stats.processing_orders ?? 0) +
      Number(stats.accepted_orders ?? 0) +
      Number(stats.packed_orders ?? 0) +
      Number(stats.in_transit_orders ?? stats.shipped_orders ?? 0) +
      Number(stats.delivered_orders ?? 0) +
      Number(stats.cancelled_orders ?? 0) +
      Number(stats.refund_pending_orders ?? 0) +
      Number(stats.refunded_orders ?? 0) || fallback
    );
  }
  if (tab.id === "in_transit") {
    const count = stats.in_transit_orders ?? stats.shipped_orders;
    return count == null ? fallback : Number(count);
  }
  if (!tab.statKey) return fallback;
  const count = stats[tab.statKey];
  return count == null ? fallback : Number(count);
}

export default function OrderStatusTabs({
  value,
  onChange,
  stats,
  pendingCount,
}: OrderStatusTabsProps) {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-end gap-1 border-b border-[#EAECF0]">
        {ORDER_STATUS_TABS.map((tab) => {
          const active = value === tab.id;
          const count = tabCount(tab, stats, pendingCount);
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
                  {count.toLocaleString("en-US")}
                </span>
              ) : (
                <span
                  className={cn(
                    "text-[13px] font-medium",
                    active ? "text-[#2F5BDB]" : "text-[#98A2B3]",
                  )}
                >
                  {count.toLocaleString("en-US")}
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
