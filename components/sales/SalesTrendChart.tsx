"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useSalesStore } from "@/store/useSalesStore";
import type { SalesTrendData, TimePeriod } from "@/types/sales";
import { formatLargeAmount } from "@/lib/formatAmount";
import { ArrowDown, ArrowUp } from "lucide-react";

interface SalesTrendChartProps {
  data?: SalesTrendData[];
  userId?: number;
}

const chartConfig = {
  value: {
    label: "Sales",
    color: "#0B1E66",
  },
};

const timePeriods: TimePeriod[] = ["Day", "Week", "Month", "Year"];

const periodMap: Record<TimePeriod, string> = {
  Day: "day",
  Week: "week",
  Month: "month",
  Year: "year",
};

export default function SalesTrendChart({
  data = [],
  userId,
}: SalesTrendChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("Month");
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined,
  );
  const { trend, trendRequestKey, trendLoading, fetchSalesTrend } =
    useSalesStore();

  const currentRequestKey = `${periodMap[selectedPeriod]}|${typeof selectedYear === "number" ? selectedYear : "all"}|${typeof userId === "number" ? userId : "all"}`;

  useEffect(() => {
    if (trend && trendRequestKey === currentRequestKey) {
      return;
    }
    void fetchSalesTrend(
      periodMap[selectedPeriod] as TimePeriod,
      selectedYear,
      userId,
    );
  }, [
    currentRequestKey,
    selectedPeriod,
    selectedYear,
    userId,
    trend,
    trendRequestKey,
    fetchSalesTrend,
  ]);

  const chartData = useMemo(() => {
    if (trend?.data?.length) {
      return trend.data.map((item: any) => ({
        label: item.month || item.label || "",
        value: item.value,
      }));
    }

    return data.map((item: SalesTrendData) => ({
      label: item.month ?? "",
      value: item.value,
    }));
  }, [trend?.data, data]);

  const trendSummary = trend?.trend;
  const availableYears = trend?.chart_config?.available_years ?? [];
  const minValue = trend?.chart_config?.min_value;
  const maxValue = trend?.chart_config?.max_value;

  const formatYAxis = (value: number) => {
    // if (value >= 1000000) return `${value / 1000000}M`;
    // if (value >= 1000) return `${value / 1000}K`;
    return formatLargeAmount(value);
  };

  return (
    <div className="rounded-4xl border border-[#EAECF0] bg-white p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-[#98A2B3]">Sales Trend</p>
          <div className="flex items-baseline gap-2">
            <p className="text-[34px] font-bold text-[#2B3674] leading-tight">
              {trendSummary ? `₦${formatLargeAmount(trendSummary.value)}` : "-"}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {trendSummary?.direction === "up" ? (
                  <ArrowUp color="#027a48" />
                ) : (
                  <ArrowDown color="#D42620" />
                )}
                <span
                  className={`text-sm font-medium ${
                    trendSummary?.direction === "down"
                      ? "text-[#D42620]"
                      : "text-[#027A48]"
                  }`}
                >
                  {trendSummary ? `${trendSummary.percent}%` : "-"}
                </span>
              </div>
              <span className="text-sm font-medium text-[#667085]">
                {trendSummary?.label ?? "-"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* <select
            className="h-9 rounded-full border border-[#EAECF0] bg-white px-3 text-sm text-[#0B1E66]"
            value={selectedYear ?? ""}
            onChange={(e) => {
              const year = e.target.value;
              setSelectedYear(year ? Number(year) : undefined);
            }}
          >
            <option value="">All years</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select> */}

          <div className="flex items-center gap-1 bg-[#F4F5F7] border border-[#EAECF0] rounded-full p-1">
            {timePeriods.map((period) => {
              const active = selectedPeriod === period;
              return (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={
                    active
                      ? "rounded-full bg-white shadow-sm px-4 py-1.5 text-[#0B1E66] text-sm font-medium transition-all"
                      : "rounded-full px-4 py-1.5 text-[#9198AD] text-sm font-medium transition-all hover:text-[#667085]"
                  }
                >
                  {period}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {trendLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-75 w-full rounded-xl" />
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-75 w-full flex items-center justify-center rounded-xl border border-[#EAECF0] bg-gray-50">
          <div className="text-center">
            <p className="text-gray-500 text-lg">
              No sales trend data available
            </p>
          </div>
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="h-75 w-full">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 30, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0B1E66" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#0B1E66" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="0"
              stroke="#F4F7FE"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#253B4B", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(0, 0, 0, 0.4)", fontSize: 12 }}
              tickFormatter={formatYAxis}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="linear"
              dataKey="value"
              stroke="#0B1E66"
              strokeWidth={2}
              fill="url(#colorValue)"
              dot={{ fill: "#0B1E66", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ChartContainer>
      )}
    </div>
  );
}
