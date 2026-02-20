"use client";

import Image from "next/image";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { LeaderboardEntry } from "@/types/sales";

interface LeaderboardChartProps {
  data: LeaderboardEntry[];
}

const chartConfig = {
  value: {
    label: "Sales",
    color: "#0B1E66",
  },
};

export default function LeaderboardChart({ data }: LeaderboardChartProps) {
  const topSalesRep = data[0];

  const chartData = data.map((entry) => ({
    name: entry.name,
    value: entry.value,
  }));

  const formatXAxis = (value: number) => {
    if (value >= 1000) return `${value / 1000}K`;
    return value.toString();
  };

  return (
    <div className="rounded-lg border border-[#EFEFEF] bg-white p-6">
      <div className="flex items-center gap-1.5 mb-4">
        <Image
          src="/icons/sales/person-group.svg"
          alt="leaderboard"
          width={18}
          height={18}
        />
        <h3 className="text-base font-bold text-[#101828]">Leaderboard</h3>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] text-[#A3AED0]">Top Sales Rep</p>
          <p className="text-[33px] font-bold text-[#2B3674] leading-tight">
            {topSalesRep.name}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 rounded-[10px] bg-[#E7F6EC] px-2 py-0.5 border-[0.21px] border-[#027A48]">
            <Image
              src="/icons/sales/arrow-up.svg"
              alt="up"
              width={5}
              height={10}
            />
            <span className="text-[12px] font-medium text-[#036B26]">5%</span>
          </div>
          <span className="text-[12px] font-medium text-[#878787]">
            vs last month
          </span>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="h-70 w-full">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#878787", fontSize: 12 }}
            tickFormatter={formatXAxis}
            domain={[0, 100000]}
            ticks={[0, 20000, 40000, 60000, 80000, 100000]}
          />
          <YAxis
            type="category"
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#878787", fontSize: 10 }}
            width={100}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="value"
            fill="#0B1E66"
            radius={[0, 6, 6, 0]}
            barSize={28}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
