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

type Range = "day" | "week" | "month" | "year";

function useChartData(
  range: Range,
  apiData?: { month: string; revenue: number }[]
) {
  const [data, setData] = React.useState<{ label: string; value: number }[]>(
    []
  );

  React.useEffect(() => {
    // For month view, use API data if available
    if (range === "month" && apiData && apiData.length > 0) {
      setData(
        apiData.map((item) => ({
          label: item.month,
          value: item.revenue / 1000000, // Convert to millions
        }))
      );
    } else if (range === "week") {
      setData([
        { label: "Mon", value: 2 },
        { label: "Tue", value: 2.5 },
        { label: "Wed", value: 3.2 },
        { label: "Thu", value: 2.8 },
        { label: "Fri", value: 3.6 },
        { label: "Sat", value: 3.1 },
        { label: "Sun", value: 3.0 },
      ]);
    } else if (range === "day") {
      setData([
        { label: "8a", value: 0.5 },
        { label: "10a", value: 0.9 },
        { label: "12p", value: 1.2 },
        { label: "2p", value: 2.4 },
        { label: "4p", value: 2.0 },
        { label: "6p", value: 1.6 },
        { label: "8p", value: 1.8 },
      ]);
    } else {
      setData([
        { label: "2020", value: 50 },
        { label: "2021", value: 65 },
        { label: "2022", value: 80 },
        { label: "2023", value: 72 },
        { label: "2024", value: 90 },
      ]);
    }
  }, [range, apiData]);

  return data;
}

const formatYAxisValue = (value: number) => {
  if (value === 0) return "0";
  if (value >= 1) return `${value}M`;
  return `${value}M`;
};

export default function RevenueOverview() {
  const { overview } = useDashboardStore();
  const [range, setRange] = React.useState<Range>("month");
  const data = useChartData(range, overview?.revenue_overview);

  // Calculate total revenue and trend from API data
  const totalRevenue = React.useMemo(() => {
    if (overview?.stats?.total_revenue) {
      return typeof overview.stats.total_revenue.value === "number"
        ? overview.stats.total_revenue.value
        : 0;
    }
    return 3000;
  }, [overview]);

  const revenueTrend = React.useMemo(() => {
    if (overview?.stats?.total_revenue?.trend) {
      const trend = overview.stats.total_revenue.trend;
      const cleanTrend = trend.replace("%", "").trim();
      const percent = parseFloat(cleanTrend);
      return {
        value: isNaN(percent) ? 0 : Math.abs(percent),
        increased: percent >= 0,
      };
    }
    return { value: 20, increased: true };
  }, [overview]);

  return (
    <div className="bg-white rounded-xl border border-[#EEF1F6] p-6 shadow-xs">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[#98A2B3] text-xs font-medium mb-2">
            Revenue Overview
          </p>
          <div className="flex items-end gap-3">
            <p className="text-[#0B1E66] text-[36px] font-semibold leading-none">
              {new Intl.NumberFormat("en-US").format(totalRevenue)}
            </p>
            <div className="flex items-center gap-1 mb-1">
              {revenueTrend.increased ? (
                <ArrowUp className="w-4 h-4 text-[#10B981]" />
              ) : (
                <ArrowDown className="w-4 h-4 text-[#EF4444]" />
              )}
              <span
                className={`text-sm font-medium ${
                  revenueTrend.increased ? "text-[#10B981]" : "text-[#EF4444]"
                }`}
              >
                {revenueTrend.value}%
              </span>
              <span className="text-[#667085] text-sm">last week</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-[#F4F5F7] border border-[#EAECF0] rounded-full p-1">
          {(["day", "week", "month", "year"] as const).map((r) => {
            const active = range === r;
            return (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={
                  active
                    ? "rounded-full bg-white shadow-sm px-4 py-1.5 text-[#0B1E66] text-sm font-medium transition-all"
                    : "rounded-full px-4 py-1.5 text-[#9198AD] text-sm font-medium transition-all hover:text-[#667085]"
                }
              >
                {r[0].toUpperCase() + r.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-75">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
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
              domain={[0, 15]}
              ticks={[0, 1, 5, 10, 15]}
            />
            <Tooltip
              cursor={{ stroke: "#EEF1F6", strokeWidth: 1 }}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #EEF1F6",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                backgroundColor: "white",
              }}
              formatter={(value: number | undefined) => [
                `${value}M`,
                "Revenue",
              ]}
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
      </div>
    </div>
  );
}
