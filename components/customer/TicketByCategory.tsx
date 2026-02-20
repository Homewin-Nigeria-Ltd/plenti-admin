"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSupportStore } from "@/store/useSupportStore";
import type { ResolutionPeriod } from "@/types/SupportTypes";

const DEFAULT_CHART_DATA = [
  { category: "Order", value: 0 },
  { category: "Payment", value: 0 },
  { category: "Delivery", value: 0 },
  { category: "General", value: 0 },
];

const PERIOD_OPTIONS: { value: ResolutionPeriod; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
  { value: "yearly", label: "Yearly" },
];

function formatCategoryLabel(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
}

export default function TicketByCategory() {
  const [period, setPeriod] = React.useState<ResolutionPeriod>("monthly");

  const {
    categoryStatistics,
    loadingCategoryStatistics,
    fetchCategoryStatistics,
  } = useSupportStore();

  React.useEffect(() => {
    fetchCategoryStatistics(period);
  }, [period, fetchCategoryStatistics]);

  const chartData = React.useMemo(() => {
    const byCategory = categoryStatistics?.by_category;
    if (!byCategory || Object.keys(byCategory).length === 0) {
      return DEFAULT_CHART_DATA;
    }
    return Object.entries(byCategory)
      .map(([key, value]) => ({
        category: formatCategoryLabel(key),
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [categoryStatistics]);

  const maxValue = React.useMemo(() => {
    const max = Math.max(...chartData.map((d) => d.value), 1);
    return Math.ceil(max / 10) * 10 || 10;
  }, [chartData]);

  const formatValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  if (loadingCategoryStatistics) {
    return (
      <div className="bg-white rounded-xl border border-[#EEF1F6] p-6">
        <div className="h-6 bg-[#EEF1F6] rounded w-2/3 mb-4 animate-pulse" />
        <div className="h-4 bg-[#EEF1F6] rounded w-full mb-6 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-[#EEF1F6] rounded animate-pulse" />
          ))}
        </div>
        <div className="h-[300px] bg-[#EEF1F6] rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#EEF1F6] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#0B1E66] text-lg font-semibold">
          Tickets by Category
        </h3>
        <Select
          value={period}
          onValueChange={(v) => setPeriod(v as ResolutionPeriod)}
        >
          <SelectTrigger className="w-[120px] h-9 border-[#D0D5DD]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-[#667085] text-sm mb-6">
        {categoryStatistics?.period ? (
          <>
            <strong>{categoryStatistics.period}</strong>
            {" · "}
          </>
        ) : null}
        Distribution of support tickets by category.
      </p>

      {/* Summary Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {chartData.slice(0, 4).map((item) => (
          <div key={item.category}>
            <p className="text-[#667085] text-xs mb-1">{item.category}</p>
            <p className="text-[#0B1E66] text-2xl font-semibold">
              {new Intl.NumberFormat("en-US").format(item.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#EEF1F6"
              horizontal={false}
            />
            <XAxis
              type="number"
              domain={[0, maxValue]}
              tick={{ fill: "#667085", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#EEF1F6" }}
              tickFormatter={formatValue}
            />
            <YAxis
              type="category"
              dataKey="category"
              tick={{ fill: "#667085", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#EEF1F6" }}
              width={100}
            />
            <Tooltip
              formatter={(value) => {
                const numericValue = Number(value);
                return new Intl.NumberFormat("en-US").format(
                  Number.isFinite(numericValue) ? numericValue : 0
                );
              }}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #EEF1F6",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />
            <Bar
              dataKey="value"
              fill="#0B1E66"
              radius={[0, 8, 8, 0]}
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
