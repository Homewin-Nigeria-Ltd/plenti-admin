"use client";

import StatCard from "./StatCard";
import InfoCard from "./InfoCard";
import SalesByCategoryChart from "./SalesByCategoryChart";
import LeaderboardChart from "./LeaderboardChart";
// import SalesTrendChart from "./SalesTrendChart";
import SalesTransactionsTable from "./SalesTransactionsTable";
import { useEffect } from "react";
import { useSalesStore } from "@/store/useSalesStore";
import { formatLargeAmount } from "@/lib/formatAmount";
import SalesTrendChart from "./SalesTrendChart";
import { Skeleton } from "@/components/ui/skeleton";

export default function OverviewTab() {
  const { overview, loading, error, fetchSalesOverview } = useSalesStore();

  console.log("Sales Overview Data:", overview);

  useEffect(() => {
    void fetchSalesOverview();
  }, [fetchSalesOverview]);

  // Transform API data to UI data shape
  const stats = overview
    ? [
        {
          title: "Total Sales",
          value: `₦${formatLargeAmount(overview.summary.total_sales.amount)}`,
          change: `${overview.summary.total_sales.change_percent > 0 ? "+" : ""}${overview.summary.total_sales.change_percent}%`,
          isPositive: overview.summary.total_sales.change_percent >= 0,
          subtitle: `${overview.summary.total_sales.transaction_count} Transactions`,
          trendIcon:
            overview.summary.total_sales.change_percent >= 0
              ? "/icons/sales/trend-up-green.svg"
              : "/icons/sales/trend-down-red.svg",
          changeColor:
            overview.summary.total_sales.change_percent > 0
              ? ("green" as const)
              : overview.summary.total_sales.change_percent < 0
                ? ("red" as const)
                : ("orange" as const),
        },
        {
          title: "Avg Order Value",
          value: `₦${formatLargeAmount(overview.summary.avg_order_value.amount)}`,
          change: `${overview.summary.avg_order_value.change_percent > 0 ? "+" : ""}${overview.summary.avg_order_value.change_percent}%`,
          isPositive: overview.summary.avg_order_value.change_percent >= 0,
          subtitle: "Per transaction",
          trendIcon:
            overview.summary.avg_order_value.change_percent >= 0
              ? "/icons/sales/trend-up-green.svg"
              : "/icons/sales/trend-down-red.svg",
          changeColor:
            overview.summary.avg_order_value.change_percent > 0
              ? ("green" as const)
              : overview.summary.avg_order_value.change_percent < 0
                ? ("red" as const)
                : ("orange" as const),
        },
        {
          title: "Commission Earned",
          value: `₦${formatLargeAmount(overview.summary.commission_earned.amount)}`,
          change: `${overview.summary.commission_earned.change_percent > 0 ? "+" : ""}${overview.summary.commission_earned.change_percent}%`,
          isPositive: overview.summary.commission_earned.change_percent >= 0,
          subtitle: `₦${formatLargeAmount(overview.summary.commission_earned.pending_amount)} pending`,
          trendIcon:
            overview.summary.commission_earned.change_percent >= 0
              ? "/icons/sales/trend-up-green-2.svg"
              : "/icons/sales/trend-down-red.svg",
          changeColor:
            overview.summary.commission_earned.change_percent > 0
              ? ("green" as const)
              : overview.summary.commission_earned.change_percent < 0
                ? ("red" as const)
                : ("orange" as const),
        },
        {
          title: "Transactions",
          value: `${overview.summary.completed_transactions.count}`,
          change: `${overview.summary.completed_transactions.change_percent > 0 ? "+" : ""}${overview.summary.completed_transactions.change_percent}%`,
          isPositive:
            overview.summary.completed_transactions.change_percent >= 0,
          subtitle: "Completed orders",
          trendIcon:
            overview.summary.completed_transactions.change_percent >= 0
              ? "/icons/sales/trend-up-orange.svg"
              : "/icons/sales/trend-down-red.svg",
          changeColor:
            overview.summary.completed_transactions.change_percent > 0
              ? ("green" as const)
              : overview.summary.completed_transactions.change_percent < 0
                ? ("red" as const)
                : ("orange" as const),
        },
      ]
    : [];

  const categoryData = overview
    ? overview.sales_by_category.slice(0, 6).map((cat, i) => ({
        name: cat.category,
        value: cat.amount,
        percentage: cat.percent,
        color: [
          "#FFA500",
          "#0B1E66",
          "#28A745",
          "#D3E9FE",
          "#FF392B",
          "#FFA000",
        ][i % 6],
      }))
    : [];

  // Info cards
  const infoCardsData = overview
    ? [
        {
          title: "Bonus Paid",
          value: `₦${formatLargeAmount(overview.bonus_paid)}`,
        },
        {
          title: "Total Sales Reps",
          value: overview.sales_reps.members.length.toString(),
          // subtitle: "Achieve ₦2.50M to earn ₦50k bonus!",
        },
        {
          title: "Total Sale Manager",
          value: overview.sales_managers.members.length.toString(),
          // subtitle: "Achieve ₦2.50M to earn ₦50k bonus!",
        },
      ]
    : [];

  // Leaderboard
  const leaderboardData = overview
    ? [...(overview.leaderboard ?? [])]
        .map((entry: any) => ({
          name: entry?.name ?? "Unknown",
          total_achieved: Number(entry?.total_achieved ?? 0),
        }))
        .sort((a, b) => b.total_achieved - a.total_achieved)
    : [];

  // Placeholder for salesTrendData and ordersData (not in API response)

  if (loading && !overview)
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-88 w-full rounded-xl" />
          <Skeleton className="h-88 w-full rounded-xl" />
        </div>
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Charts Row - Sales by Category and Leaderboard */}
      <div className="grid grid-cols-2 gap-6">
        <SalesByCategoryChart data={categoryData} />
        <LeaderboardChart data={leaderboardData} />
      </div>

      {/* Sales Trend Chart */}
      <SalesTrendChart />

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {infoCardsData.map((data, index) => (
          <InfoCard key={index} data={data} />
        ))}
      </div>

      {/* Sales Transactions Table */}
      <SalesTransactionsTable />
    </div>
  );
}
