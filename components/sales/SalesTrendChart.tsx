"use client";

import { useState } from "react";
import Image from "next/image";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { SalesTrendData, TimePeriod } from "@/types/sales";

interface SalesTrendChartProps {
  data: SalesTrendData[];
}

const chartConfig = {
  value: {
    label: "Sales",
    color: "#0B1E66",
  },
};

const timePeriods: TimePeriod[] = ["Day", "Week", "Month", "Year"];

export default function SalesTrendChart({ data }: SalesTrendChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("Month");

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${value / 1000000}M`;
    if (value >= 1000) return `${value / 1000}K`;
    return value.toString();
  };

  return (
    <div className="rounded-4xl border border-[#EAECF0] bg-white p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-[#98A2B3]">Sales Trend</p>
          <div className="flex items-baseline gap-2">
            <p className="text-[34px] font-bold text-[#2B3674] leading-tight">
              3,000
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Image
                  src="/icons/sales/arrow-up-icon.svg"
                  alt="up"
                  width={14}
                  height={14}
                />
                <span className="text-sm font-medium text-[#027A48]">20%</span>
              </div>
              <span className="text-sm font-medium text-[#667085]">
                last 14 days
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {timePeriods.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`text-base font-medium ${
                selectedPeriod === period ? "text-[#253B4B]" : "text-[#9198AD]"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <ChartContainer config={chartConfig} className="h-75 w-full">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
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
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#253B4B", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgba(0, 0, 0, 0.4)", fontSize: 12 }}
            tickFormatter={formatYAxis}
            domain={[0, 15000000]}
            ticks={[0, 1000000, 5000000, 10000000, 15000000]}
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
    </div>
  );
}
