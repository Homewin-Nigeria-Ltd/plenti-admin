"use client";

import * as React from "react";
import api from "@/lib/api";
import { ORDERS_API } from "@/data/orders";
import type { OrderStatistics } from "@/types/OrderTypes";
import OrderStatCard from "@/components/order/OrderStatCard";
import OrderTableWrapper from "@/components/order/OrderTableWrapper";
import { Skeleton } from "@/components/ui/skeleton";

const STAT_CARDS: { key: keyof OrderStatistics; title: string }[] = [
  { key: "pending_orders", title: "Pending Orders" },
  { key: "processing_orders", title: "Processing Orders" },
  { key: "shipped_orders", title: "In Transit Orders" },
  { key: "delivered_orders", title: "Delivered Orders" },
  { key: "cancelled_orders", title: "Canceled Orders" },
];

export default function OrderPage() {
  const [stats, setStats] = React.useState<OrderStatistics | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get<{ data: OrderStatistics }>(
          ORDERS_API.getStatistics
        );
        if (!cancelled) setStats(data.data ?? null);
      } catch (e) {
        console.error("Order statistics:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {loading ? (
          STAT_CARDS.map(({ title }) => (
            <Skeleton key={title} className="h-[120px] rounded-xl" />
          ))
        ) : (
          STAT_CARDS.map(({ key, title }) => (
            <OrderStatCard
              key={title}
              title={title}
              value={Number(stats?.[key] ?? 0)}
              changePercent={0}
            />
          ))
        )}
      </div>
      <OrderTableWrapper />
    </div>
  );
}
