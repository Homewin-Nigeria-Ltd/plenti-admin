"use client";

import { formatCompactNaira, parseNumeric } from "@/lib/mappers/dashboard";
import { cn } from "@/lib/utils";
import type { DashboardOverview } from "@/types/DashboardTypes";
import { TrendingDown, TrendingUp } from "lucide-react";
import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DashboardRevenueTrendProps = {
  overview?: DashboardOverview | null;
};

const DUMMY_CHART = [
  { label: "Jan", revenue: 1800000, orders: 420 },
  { label: "Feb", revenue: 2100000, orders: 468 },
  { label: "Mar", revenue: 1950000, orders: 441 },
  { label: "Apr", revenue: 2480000, orders: 512 },
  { label: "May", revenue: 2360000, orders: 490 },
  { label: "Jun", revenue: 2720000, orders: 538 },
  { label: "Jul", revenue: 2610000, orders: 521 },
  { label: "Aug", revenue: 2980000, orders: 574 },
  { label: "Sep", revenue: 2840000, orders: 556 },
  { label: "Oct", revenue: 3120000, orders: 601 },
  { label: "Nov", revenue: 3060000, orders: 588 },
  { label: "Dec", revenue: 3410000, orders: 640 },
];

export default function DashboardRevenueTrend({
  overview,
}: DashboardRevenueTrendProps) {
  const [metric, setMetric] = React.useState<"revenue" | "orders">("revenue");
  const year = overview?.past_year;
  const liveChart =
    year?.series?.map((item) => ({
      label: item.label.replace(/ 20/, " '"),
      value:
        metric === "revenue"
          ? parseNumeric(item.revenue)
          : parseNumeric(item.orders),
    })) ??
    overview?.revenue_overview.map((item) => ({
      label: item.month,
      value: parseNumeric(item.revenue),
    })) ??
    [];
  const chart =
    liveChart.length > 0
      ? liveChart
      : DUMMY_CHART.map((item) => ({
          label: item.label,
          value: metric === "revenue" ? item.revenue : item.orders,
        }));

  const total = chart.reduce((sum, item) => sum + item.value, 0);
  const peak = chart.reduce(
    (best, item) => (item.value > best.value ? item : best),
    { label: "—", value: 0 },
  );
  const average = chart.length ? total / chart.length : 0;
  const change = year?.revenue_change_percent ?? parseNumeric(overview?.stats.total_revenue.trend);
  const up = change >= 0;
  const yearRevenue = parseNumeric(year?.revenue);

  return (
    <section className="rounded-2xl border border-[#EAECF0] bg-white p-4 sm:p-5 min-w-0">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-[#101828]">Revenue trend</h2>
          <p className="text-[12px] text-[#667085] mt-0.5">
            Last 12 months · best month {peak.label}
            {peak.value
              ? `, ${metric === "revenue" ? formatCompactNaira(peak.value) : peak.value.toLocaleString()}`
              : ""}
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-[#F2F4F7] p-0.5 text-[12px]">
          <button
            type="button"
            className={cn(
              "rounded-md px-2.5 py-1",
              metric === "revenue"
                ? "bg-white font-medium text-[#101828] shadow-xs"
                : "text-[#667085]",
            )}
            onClick={() => setMetric("revenue")}
          >
            Revenue
          </button>
          <button
            type="button"
            className={cn(
              "rounded-md px-2.5 py-1",
              metric === "orders"
                ? "bg-white font-medium text-[#101828] shadow-xs"
                : "text-[#667085]",
            )}
            onClick={() => setMetric("orders")}
          >
            Orders
          </button>
        </div>
      </div>

      <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="dashboardRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#32D583" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#32D583" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#F2F4F7" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#98A2B3" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#98A2B3" }}
                axisLine={false}
                tickLine={false}
                width={44}
                tickFormatter={(value: number) =>
                  metric === "revenue"
                    ? formatCompactNaira(Number(value) || 0)
                    : `${Math.round(Number(value) || 0)}`
                }
              />
              <Tooltip
                formatter={(value: number) =>
                  metric === "revenue"
                    ? formatCompactNaira(Number(value) || 0)
                    : Number(value || 0).toLocaleString()
                }
                contentStyle={{ borderRadius: 12, border: "1px solid #EAECF0" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#2F5BDB"
                strokeWidth={2.5}
                fill="url(#dashboardRevenue)"
                dot={false}
                activeDot={{ r: 5, fill: "#2F5BDB", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3 text-[12px]">
        <div>
          <p className="text-[#98A2B3]">12-month revenue</p>
          <p className="text-sm font-semibold text-[#101828]">
            {formatCompactNaira(
              yearRevenue || total || parseNumeric(overview?.stats.total_revenue.value),
            )}
          </p>
        </div>
        <div>
          <p className="text-[#98A2B3]">Month average</p>
          <p className="text-sm font-semibold text-[#101828]">
            {formatCompactNaira(
              yearRevenue && year?.series?.length
                ? yearRevenue / year.series.length
                : average,
            )}
          </p>
        </div>
        <div>
          <p className="text-[#98A2B3]">vs previous year</p>
          <p
            className={`text-sm font-semibold inline-flex items-center gap-1 ${up ? "text-[#12B76A]" : "text-[#F04438]"}`}
          >
            {up ? (
              <TrendingUp className="size-3.5" />
            ) : (
              <TrendingDown className="size-3.5" />
            )}
            {change > 0 ? "+" : ""}
            {change}%
          </p>
        </div>
      </div>
    </section>
  );
}
