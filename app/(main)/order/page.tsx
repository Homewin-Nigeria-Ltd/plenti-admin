"use client";

import * as React from "react";
import type { OrderStatistics } from "@/types/OrderTypes";
import OrderStatCard from "@/components/order/OrderStatCard";
import OrderTableWrapper from "@/components/order/OrderTableWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrderPermissions } from "@/lib/modulePermissions";
import { useAccountStore } from "@/store/useAccountStore";
import { useOrderStore } from "@/store/useOrderStore";

const STAT_CARDS: { key: keyof OrderStatistics; title: string }[] = [
  { key: "pending_orders", title: "Pending Orders" },
  { key: "processing_orders", title: "Processing Orders" },
  { key: "shipped_orders", title: "In Transit Orders" },
  { key: "delivered_orders", title: "Delivered Orders" },
  { key: "cancelled_orders", title: "Canceled Orders" },
];

export default function OrderPage() {
  const account = useAccountStore((state) => state.account);
  const { orderStats, loadingStats, fetchOrderStats } = useOrderStore();
  const { canViewOrderModule, canViewOrderStats } = React.useMemo(
    () => getOrderPermissions(account),
    [account],
  );

  React.useEffect(() => {
    if (!canViewOrderModule || !canViewOrderStats) return;
    fetchOrderStats();
  }, [fetchOrderStats, canViewOrderModule, canViewOrderStats]);

  return (
    <div className="space-y-6">
      {!canViewOrderModule ? (
        <div className="rounded-xl border border-[#EAECF0] bg-[#F9FAFB] p-12 text-center">
          <p className="text-sm text-[#667085]">
            You do not have permission to view order management.
          </p>
        </div>
      ) : (
        <>
          {canViewOrderStats && (
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
          )}
          <OrderTableWrapper />
        </>
      )}
    </div>
  );
}
