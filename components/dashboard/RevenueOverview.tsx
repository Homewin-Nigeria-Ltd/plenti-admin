"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format";
import type { TopProductsFilter } from "@/types/DashboardTypes";

const formatYAxisValue = (value: number) => {
  if (value === 0) return "0";
  if (value >= 1) return `${value}M`;
  return `${value}M`;
};

export default function RevenueOverview() {
  const { revenueStats, loadingRevenueStats, fetchRevenueStats } =
    useDashboardStore();
  const [range, setRange] = React.useState<TopProductsFilter>("week");

  React.useEffect(() => {
    fetchRevenueStats(range);
  }, [range, fetchRevenueStats]);

  const chartData = React.useMemo(() => {
    if (!revenueStats?.chart_data) return [];
    return revenueStats.chart_data.map(
      (item: { label: string; value: number }) => ({
        label: item.label,
        value: item.value / 1000000,
      })
    );
  }, [revenueStats]);

  const maxValue = React.useMemo(() => {
    if (chartData.length === 0) return 15;
    const max = Math.max(...chartData.map((d: { value: number }) => d.value));
    return Math.ceil(max * 1.2);
  }, [chartData]);

  const totalRevenue = revenueStats?.total_revenue ?? 0;
  const percentageChange = revenueStats?.percentage_change ?? 0;
  const trend = revenueStats?.trend ?? "up";
  const currency = revenueStats?.currency ?? "NGN";
  const increased = trend === "up";

  const handleRangeChange = (newRange: TopProductsFilter) => {
    setRange(newRange);
  };

  return (
    <div className="bg-white rounded-xl border border-[#EEF1F6] p-6 shadow-xs">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[#98A2B3] text-xs font-medium mb-2">
            Revenue Overview
          </p>
          {loadingRevenueStats && !revenueStats ? (
            <div className="flex items-end gap-3">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-5 w-20" />
            </div>
          ) : (
            <div className="flex items-end gap-3">
              <p className="text-[#0B1E66] text-[36px] font-semibold leading-none">
                {formatCurrency(totalRevenue, {
                  currency,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <div className="flex items-center gap-1 mb-1">
                {increased ? (
                  <ArrowUp className="w-4 h-4 text-[#10B981]" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-[#EF4444]" />
                )}
                <span
                  className={`text-sm font-medium ${
                    increased ? "text-[#10B981]" : "text-[#EF4444]"
                  }`}
                >
                  {Math.abs(percentageChange).toFixed(2)}%
                </span>
                <span className="text-[#667085] text-sm">
                  {range === "day"
                    ? "today"
                    : range === "week"
                    ? "last week"
                    : range === "month"
                    ? "last month"
                    : "last year"}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 bg-[#F4F5F7] border border-[#EAECF0] rounded-full p-1">
          {(["week", "month", "year"] as const).map((r) => {
            const active = range === r;
            return (
              <button
                key={r}
                onClick={() => handleRangeChange(r)}
                disabled={loadingRevenueStats}
                className={
                  active
                    ? "rounded-full bg-white shadow-sm px-4 py-1.5 text-[#0B1E66] text-sm font-medium transition-all disabled:opacity-50"
                    : "rounded-full px-4 py-1.5 text-[#9198AD] text-sm font-medium transition-all hover:text-[#667085] disabled:opacity-50"
                }
              >
                {r[0].toUpperCase() + r.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-75">
        {loadingRevenueStats && !revenueStats ? (
          <Skeleton className="w-full h-full" />
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[#667085] text-sm">
            No revenue data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            >
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#0B1E66" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#0B1E66" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="label"
                tick={{ fill: "#667085", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#EEF1F6" }}
              />
              <YAxis
                tick={{ fill: "#667085", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#EEF1F6" }}
                tickFormatter={formatYAxisValue}
                domain={[0, maxValue]}
              />
              <Tooltip
                cursor={{ stroke: "#EEF1F6", strokeWidth: 1 }}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #EEF1F6",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  backgroundColor: "white",
                }}
                formatter={(value) => {
                  const numericValue = Number(value);
                  if (!Number.isFinite(numericValue)) return ["", ""];
                  const actualValue = numericValue * 1000000;
                  return [
                    formatCurrency(actualValue, {
                      currency,
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }),
                    "Revenue",
                  ];
                }}
              />
              <Area
                type="linear"
                dataKey="value"
                stroke="#0B1E66"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                dot={{ r: 4, fill: "#0B1E66", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#0B1E66" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
