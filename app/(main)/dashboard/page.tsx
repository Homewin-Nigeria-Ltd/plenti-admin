"use client";

import BestSellingCategory from "@/components/dashboard/BestSellingCategory";
import CartMetrics from "@/components/dashboard/CartMetrics";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import MetricCard from "@/components/dashboard/MetricCard";
import TopProducts from "@/components/dashboard/TopProducts";
import { RevenueOverviewChart } from "@/components/finance/RevenueOverviewChart";
import OrderTableWrapper from "@/components/order/OrderTableWrapper";
import {
  getDisplayDate,
  mapOverviewToMetricCards,
  mapOverviewToStatCards,
} from "@/lib/mappers/dashboard";
import { useDashboardStore } from "@/store/useDashboardStore";
import type { TopProductsFilter } from "@/types/DashboardTypes";
import * as React from "react";
// import RecentOrdersTable from "@/components/dashboard/RecentOrdersTable";

const DashboardPage = () => {
  const {
    overview,
    loadingOverview,
    overviewError,
    fetchDashboardOverview,
    topProducts,
    loadingTopProducts,
    fetchTopProducts,
    bestSellingCategories,
    loadingBestSellingCategories,
    fetchBestSellingCategories,
  } = useDashboardStore();

  const [topProductsFilter, setTopProductsFilter] =
    React.useState<TopProductsFilter>("month");
  const [bestSellingFilter, setBestSellingFilter] =
    React.useState<TopProductsFilter>("month");

  React.useEffect(() => {
    fetchDashboardOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    fetchTopProducts(topProductsFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topProductsFilter]);

  React.useEffect(() => {
    fetchBestSellingCategories(bestSellingFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bestSellingFilter]);

  const stats = React.useMemo(
    () => mapOverviewToStatCards(overview),
    [overview]
  );
  const metricCards = React.useMemo(
    () => mapOverviewToMetricCards(overview),
    [overview]
  );
  const displayDate = React.useMemo(() => getDisplayDate(), []);

  if (loadingOverview && !overview) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-35 bg-[#EEF1F6] rounded-xl animate-pulse"
            />
          ))}
        </div>
        <div className="h-75 bg-[#EEF1F6] rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-30 bg-[#EEF1F6] rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (overviewError && !overview) {
    return <p className="text-[#D42620] text-sm py-4">{overviewError}</p>;
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{displayDate}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats?.map((stat) => (
          <DashboardStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            changePercent={stat.changePercent}
            increased={stat.increased}
            trendData={stat.trendData}
          />
        ))}
      </div>

      <RevenueOverviewChart />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metricCards?.map((m) => (
          <MetricCard
            key={m.title}
            title={m.title}
            value={m.value}
            changePercent={0}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        <TopProducts
          products={topProducts}
          loading={loadingTopProducts}
          filter={topProductsFilter}
          onFilterChange={setTopProductsFilter}
        />
        <BestSellingCategory
          categories={bestSellingCategories}
          loading={loadingBestSellingCategories}
          filter={bestSellingFilter}
          onFilterChange={setBestSellingFilter}
        />
        <CartMetrics
          percentage={overview?.cart_analysis.abandoned_rate_percentage}
          abandonedCart={overview?.cart_analysis.abandoned_cart_count}
          abandonedRevenue={overview?.cart_analysis.abandoned_revenue}
        />
      </div>

      <OrderTableWrapper />
    </div>
  );
};

export default DashboardPage;
