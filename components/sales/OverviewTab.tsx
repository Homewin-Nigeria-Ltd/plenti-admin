"use client";

import StatCard from "./StatCard";
import InfoCard from "./InfoCard";
import SalesByCategoryChart from "./SalesByCategoryChart";
import LeaderboardChart from "./LeaderboardChart";
import SalesTrendChart from "./SalesTrendChart";
import OrdersTable from "./OrdersTable";
import {
  salesStats,
  categoryData,
  leaderboardData,
  salesTrendData,
  infoCardsData,
  ordersData,
} from "@/data/sales";

export default function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {salesStats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Charts Row - Sales by Category and Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesByCategoryChart data={categoryData} />
        <LeaderboardChart data={leaderboardData} />
      </div>

      {/* Sales Trend Chart */}
      <SalesTrendChart data={salesTrendData} />

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {infoCardsData.map((data, index) => (
          <InfoCard key={index} data={data} />
        ))}
      </div>

      {/* Orders Table */}
      <OrdersTable orders={ordersData} />
    </div>
  );
}
