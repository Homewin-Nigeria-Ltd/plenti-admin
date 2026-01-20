"use client";

import * as React from "react";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import RevenueOverview from "@/components/dashboard/RevenueOverview";
import MetricCard from "@/components/dashboard/MetricCard";
import TopProducts from "@/components/dashboard/TopProducts";
import BestSellingCategory from "@/components/dashboard/BestSellingCategory";
import CartMetrics from "@/components/dashboard/CartMetrics";
import OrderTableWrapper from "@/components/order/OrderTableWrapper";

const DashboardPage = () => {
  // Mock trend data for each metric (simulating the wavy line graphs)
  const revenueTrend = [20, 5, 30];
  const ordersTrend = [100, 79, 20];
  const usersTrend = [10, 50, 110];
  const conversionTrend = [25, 70, 75];

  const stats = [
    {
      title: "Total Revenue",
      value: "₦2,980,000",
      changePercent: 22,
      increased: true,
      trendData: revenueTrend,
    },
    {
      title: "Total Orders",
      value: "920",
      changePercent: 25,
      increased: false,
      trendData: ordersTrend,
    },
    {
      title: "Active Users",
      value: "15.5K",
      changePercent: 49,
      increased: true,
      trendData: usersTrend,
    },
    {
      title: "Conversion Rate",
      value: "28%",
      changePercent: 1.9,
      increased: true,
      trendData: conversionTrend,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
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

      <RevenueOverview />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Total Deliveries"
          value="45,678"
          changePercent={10}
        />
        <MetricCard
          title="Today's Revenue"
          value="₦234,500"
          changePercent={10}
        />
        <MetricCard title="Number of Products" value="678" changePercent={10} />
        <MetricCard
          title="Top Weekly Category"
          value="Instant Foods"
          changePercent={10}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TopProducts />
        <BestSellingCategory />
        <CartMetrics />
      </div>

      <OrderTableWrapper />
    </div>
  );
};

export default DashboardPage;
