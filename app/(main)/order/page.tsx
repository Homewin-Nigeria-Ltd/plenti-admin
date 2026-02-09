"use client";

import * as React from "react";
import type { OrderStatistics } from "@/types/OrderTypes";
import OrderStatCard from "@/components/order/OrderStatCard";
import OrderTableWrapper from "@/components/order/OrderTableWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrderStore } from "@/store/useOrderStore";

const STAT_CARDS: { key: keyof OrderStatistics; title: string }[] = [
  { key: "pending_orders", title: "Pending Orders" },
  { key: "processing_orders", title: "Processing Orders" },
  { key: "shipped_orders", title: "In Transit Orders" },
  { key: "delivered_orders", title: "Delivered Orders" },
  { key: "cancelled_orders", title: "Canceled Orders" },
];

export default function OrderPage() {
  const { orderStats, loadingStats, fetchOrderStats } = useOrderStore();

  React.useEffect(() => {
    fetchOrderStats();
  }, [fetchOrderStats]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {loadingStats
          ? STAT_CARDS.map(({ title }) => (
              <Skeleton key={title} className="h-[120px] rounded-xl" />
            ))
          : STAT_CARDS.map(({ key, title }) => (
              <OrderStatCard
                key={title}
                title={title}
                value={Number(orderStats?.[key] ?? 0)}
                changePercent={0}
              />
            ))}
      </div>
      <OrderTableWrapper />
    </div>
  );
}
