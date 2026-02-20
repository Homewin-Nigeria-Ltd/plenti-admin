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
import { ArrowUp } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";

type Range = "week" | "month" | "year";

function useChartData(
  range: Range,
  apiData?: { label: string; value: number }[]
) {
  const [data, setData] = React.useState<{ label: string; value: number }[]>(
    []
  );

  React.useEffect(() => {
    // For month view, use API data if available
    if (range === "month" && apiData && apiData.length > 0) {
      // Create a map of API data by label
      const dataMap = new Map(
        apiData.map((item) => [
          item.label,
          item.value / 1000000, // Convert to millions
        ])
      );

      // Get all months (Jan-Dec) and fill in with 0 for missing months
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const fullYearData = months.map((month) => ({
        label: month,
        value: dataMap.get(month) ?? 0,
      }));

      setData(fullYearData);
    } else if (range === "week" && apiData && apiData.length > 0) {
      // Create a map of API data by day
      const dataMap = new Map(
        apiData.map((item) => [
          item.label,
          item.value / 1000000, // Convert to millions
        ])
      );

      // Get all days of week and fill in with 0 for missing days
      const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

      const fullWeekData = daysOfWeek.map((day) => ({
        label: day,
        value: dataMap.get(day) ?? 0,
      }));

      setData(fullWeekData);
    } else if (range === "year" && apiData && apiData.length > 0) {
      // For year view, use API data as is
      const yearData = apiData.map((item) => ({
        label: item.label,
        value: item.value / 1000000, // Convert to millions
      }));
      setData(yearData);
    } else {
      setData([]);
    }
  }, [range, apiData]);

  return data;
}

const formatYAxisValue = (value: number) => {
  if (value === 0) return "0";
  if (value >= 1) return `${value}M`;
  return `${value}M`;
};

export function RevenueOverviewChart() {
  const { overview, fetchFinanceOverview } = useFinanceStore();
  const [range, setRange] = React.useState<Range>("month");
  const data = useChartData(range, overview?.charts?.revenue_trend);

  // Fetch data when range changes
  React.useEffect(() => {
    fetchFinanceOverview(range);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  // Calculate total revenue from API
  const totalRevenue = React.useMemo(() => {
    if (overview?.summary?.total_revenue) {
      const amount = parseFloat(overview.summary.total_revenue);
      return new Intl.NumberFormat("en-US").format(amount);
    }
    return "0";
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
              {totalRevenue}
            </p>
            <div className="flex items-center gap-1 mb-1">
              <ArrowUp className="w-4 h-4 text-[#10B981]" />
              <span className="text-sm font-medium text-[#10B981]">20%</span>
              <span className="text-[#667085] text-sm">last week</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-[#F4F5F7] border border-[#EAECF0] rounded-full p-1">
          {(["week", "month", "year"] as const).map((r) => {
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
              formatter={(value) => {
                const numericValue = Number(value);
                const displayValue = Number.isFinite(numericValue)
                  ? numericValue
                  : 0;
                return [`${displayValue}M`, "Revenue"];
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
      </div>
    </div>
  );
}
