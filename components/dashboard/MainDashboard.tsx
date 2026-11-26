"use client";

import DashboardGreetingBar from "@/components/dashboard/DashboardGreetingBar";
import DashboardIncomingOrders from "@/components/dashboard/DashboardIncomingOrders";
import DashboardOutToRiders from "@/components/dashboard/DashboardOutToRiders";
import DashboardPeriodCards from "@/components/dashboard/DashboardPeriodCards";
import DashboardProductLists from "@/components/dashboard/DashboardProductLists";
import DashboardQuickStats from "@/components/dashboard/DashboardQuickStats";
import DashboardRevenueTrend from "@/components/dashboard/DashboardRevenueTrend";
import DashboardSalesByCategory from "@/components/dashboard/DashboardSalesByCategory";
import DashboardWarehouses from "@/components/dashboard/DashboardWarehouses";
import { Button } from "@/components/ui/button";
import { useAccountStore } from "@/store/useAccountStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useInventoryStore } from "@/store/useInventoryStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useRiderStore } from "@/store/useRiderStore";
import { useRouter } from "next/navigation";
import * as React from "react";

export default function MainDashboard() {
  const router = useRouter();
  const account = useAccountStore((state) => state.account);
  const {
    overview,
    loadingOverview,
    overviewError,
    fetchDashboardOverview,
    topProducts,
    fetchTopProducts,
    bestSellingCategories,
    loadingBestSellingCategories,
    fetchBestSellingCategories,
  } = useDashboardStore();
  const fetchOrders = useOrderStore((state) => state.fetchOrders);
  const fetchIncomingOrders = useOrderStore((state) => state.fetchIncomingOrders);
  const fetchOrderStats = useOrderStore((state) => state.fetchOrderStats);
  const orders = useOrderStore((state) => state.orders);
  const incomingOrdersList = useOrderStore((state) => state.incomingOrders);
  const incomingTotal = useOrderStore((state) => state.incomingTotal);
  const orderStats = useOrderStore((state) => state.orderStats);
  const fetchWarehouses = useInventoryStore((state) => state.fetchWarehouses);
  const warehouses = useInventoryStore((state) => state.warehouses);
  const fetchInventoryStatistics = useInventoryStore(
    (state) => state.fetchInventoryStatistics,
  );
  const statistics = useInventoryStore((state) => state.statistics);
  const fetchRiders = useRiderStore((state) => state.fetchRiders);
  const riders = useRiderStore((state) => state.riders);
  const ridersTotal = useRiderStore((state) => state.totalItems);

  const [warehouseId, setWarehouseId] = React.useState("all");

  React.useEffect(() => {
    fetchDashboardOverview();
    fetchTopProducts("month");
    fetchBestSellingCategories("month");
    fetchOrders({ page: 1 });
    fetchIncomingOrders({ page: 1, per_page: 4 });
    fetchOrderStats();
    fetchWarehouses({ per_page: 100 });
    fetchInventoryStatistics();
    fetchRiders({ page: 1 });
  }, [
    fetchDashboardOverview,
    fetchTopProducts,
    fetchBestSellingCategories,
    fetchOrders,
    fetchIncomingOrders,
    fetchOrderStats,
    fetchWarehouses,
    fetchInventoryStatistics,
    fetchRiders,
  ]);

  const incomingOrders = React.useMemo(() => {
    return incomingOrdersList.slice(0, 4);
  }, [incomingOrdersList]);

  const waitingCount =
    overview?.today?.to_accept ??
    incomingTotal ??
    orderStats?.pending_orders ??
    incomingOrders.length;

  const outToRiders = React.useMemo(() => {
    return orders
      .filter((order) => {
        const status = `${order.status} ${order.display_status || ""}`.toLowerCase();
        return (
          Boolean(order.rider_id || order.rider || order.plenti_delivery) ||
          status.includes("ship") ||
          status.includes("deliver") ||
          status.includes("transit")
        );
      })
      .slice(0, 4);
  }, [orders]);

  const ridersFree = riders.filter((rider) => {
    const status = `${rider.rider_status || ""} ${rider.status || ""}`.toLowerCase();
    return (
      !status.includes("offline") &&
      !status.includes("busy") &&
      !status.includes("suspend")
    );
  }).length;

  const products =
    topProducts && topProducts.length > 0
      ? topProducts
      : overview?.top_products ?? [];
  const categories =
    bestSellingCategories && bestSellingCategories.length > 0
      ? bestSellingCategories
      : overview?.best_selling_categories ?? [];

  if (loadingOverview && !overview) {
    return (
      <div className="space-y-4">
        <div className="h-16 bg-[#EEF1F6] rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-52 bg-[#EEF1F6] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (overviewError && !overview) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="text-sm py-4">An Error Occured</p>
        <Button onClick={() => router.refresh()} className="h-10">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-5">
      <DashboardGreetingBar
        name={account?.name}
        warehouses={warehouses}
        warehouseId={warehouseId}
        onWarehouseChange={setWarehouseId}
      />
      <DashboardPeriodCards overview={overview} waitingCount={waitingCount} />
      <DashboardQuickStats
        overview={overview}
        ridersFree={ridersFree}
        ridersTotal={ridersTotal || riders.length}
      />
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] gap-4">
        <DashboardIncomingOrders
          orders={incomingOrders}
          warehouses={warehouses}
          waitingCount={waitingCount}
        />
        <DashboardOutToRiders orders={outToRiders} riders={riders} />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-4">
        <DashboardRevenueTrend overview={overview} />
        <DashboardSalesByCategory
          categories={categories}
          loading={loadingBestSellingCategories && categories.length === 0}
        />
      </div>
      <DashboardWarehouses warehouses={warehouses} />
      <DashboardProductLists
        products={products}
        recentStocks={statistics?.recent_stocks}
      />
    </div>
  );
}
