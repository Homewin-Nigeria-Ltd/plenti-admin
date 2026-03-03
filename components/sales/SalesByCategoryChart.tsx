"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { CategoryData } from "@/types/sales";

interface SalesByCategoryChartProps {
  data: CategoryData[];
}

export default function SalesByCategoryChart({
  data,
}: SalesByCategoryChartProps) {
  console.log("Rendering SalesByCategoryChart with data:", data);

  const chartConfig = data.reduce(
    (config, item) => {
      config[item.name.toLowerCase().replace(/\s+/g, "_")] = {
        label: item.name,
        color: item.color,
      };
      return config;
    },
    {} as Record<string, { label: string; color: string }>,
  );

  const chartData = data.map((item) => ({
    category: item.name,
    value: item.value,
    fill: item.color,
  }));

  return (
    <div className="rounded-[25px] border border-[#EAECF0] bg-white p-6">
      <div className="mb-4">
        <h3 className="text-[25px] font-semibold text-[#0B1E66] leading-tight">
          Sales by Category
        </h3>
        <p className="text-[15px] text-[#808080]">Based on the user purchase</p>
      </div>

      <div className="flex flex-col">
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="category"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>

        {/* <div className="flex flex-wrap items-center justify-center gap-5 mt-6 bg-white rounded-xl px-5 py-2 shadow-[0px_18px_40px_0px_rgba(112,144,176,0.12)]">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[15px] font-medium text-[#808080]">
                  {item.name}
                </span>
              </div>
              <span className="text-[23px] font-bold text-[#0B1E66]">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}
