"use client";

import * as React from "react";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";

const DashboardPage = () => {
  // Mock trend data for each metric (simulating the wavy line graphs)
  const revenueTrend = [20, 25, 22, 28, 25, 30, 28, 32, 30, 35, 32, 38];
  const ordersTrend = [100, 120, 110, 130, 125, 140, 135, 150, 145, 160, 155, 170];
  const usersTrend = [10, 12, 11, 13, 12, 14, 13, 15, 14, 16, 15, 17];
  const conversionTrend = [25, 26, 25.5, 27, 26.5, 27.5, 27, 28, 27.5, 28.5, 28, 29];

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
    </div>
  );
};

export default DashboardPage;
