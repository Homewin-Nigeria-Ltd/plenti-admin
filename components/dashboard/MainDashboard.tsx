"use client";

import {
  getDisplayDate,
  mapOverviewToMetricCards,
  mapOverviewToStatCards,
} from "@/lib/mappers/dashboard";
import { useDashboardStore } from "@/store/useDashboardStore";
import { TopProductsFilter } from "@/types/DashboardTypes";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import MetricCard from "./MetricCard";
import TopProducts from "./TopProducts";
import BestSellingCategory from "./BestSellingCategory";
import CartMetrics from "./CartMetrics";
import OrderTableWrapper from "../order/OrderTableWrapper";

const DashboardStatCard = dynamic(
  () => import("@/components/dashboard/DashboardStatCard"),
  {
    ssr: false,
    loading: () => (
      <div className="h-30 bg-[#EEF1F6] rounded-lg animate-pulse" />
    ),
  }
);

const RevenueOverviewChart = dynamic(
  () =>
    import("@/components/finance/RevenueOverviewChart").then(
      (mod) => mod.RevenueOverviewChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-75 bg-[#EEF1F6] rounded-xl animate-pulse" />
    ),
  }
);

const MainDashboard = () => {
  const router = useRouter();
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
  }, []);

  React.useEffect(() => {
    fetchTopProducts(topProductsFilter);
  }, [topProductsFilter]);

  React.useEffect(() => {
    fetchBestSellingCategories(bestSellingFilter);
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

  // show if error or no overview
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

export default MainDashboard;
