"use client";

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
import { useFinanceStore } from "@/store/useFinanceStore";

type Range = "day" | "week" | "month" | "year";

function useChartData(
  range: Range,
  apiData?: { month: string; total: string }[]
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
          value: parseFloat(item.total) / 1000000, // Convert to millions
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

export function RevenueOverviewChart() {
  const { overview } = useFinanceStore();
  const [range, setRange] = React.useState<Range>("month");
  const data = useChartData(range, overview?.charts?.revenue_trend);

  // Calculate total revenue from API
  const totalRevenue = React.useMemo(() => {
    if (overview?.summary?.total_revenue) {
      const amount = parseFloat(overview.summary.total_revenue);
      return new Intl.NumberFormat("en-US").format(amount);
    }
    return "0";
  }, [overview]);

  return (
    <div className="bg-white rounded-[12px] border border-[#EEF1F6] p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[#667085] text-sm">Revenue Overview</p>
          <div className="flex items-end gap-3">
            <p className="text-[#0B1E66] text-[36px] font-semibold leading-none">
              {totalRevenue}
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs">
                ↑ 20%
              </span>
              <span className="text-[#667085] text-xs">last week</span>
            </div>
          </div>
        </div>

        <div className="bg-[#F4F5F7] border border-[#EAECF0] rounded-full p-1 py-2 flex items-center gap-1">
          {(["day", "week", "month", "year"] as const).map((r) => {
            const active = range === r;
            return (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={
                  active
                    ? "rounded-full bg-white shadow-sm px-6 py-1 text-[#0B1E66] text-sm"
                    : "rounded-full px-6 py-1 text-[#9198AD] text-sm"
                }
              >
                {r[0].toUpperCase() + r.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 8, right: 8 }}>
            <defs>
              <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0B1E66" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#0B1E6600" stopOpacity={0.05} />
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
            />
            <Tooltip
              cursor={{ stroke: "#EEF1F6" }}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #EEF1F6",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />
            <Area
              type="linear"
              dataKey="value"
              stroke="#0B1E66"
              strokeWidth={3}
              fill="url(#revGradient)"
              dot={{ r: 4, stroke: "#0B1E66", fill: "#F4F9FF" }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
