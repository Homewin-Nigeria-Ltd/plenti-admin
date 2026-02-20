"use client";

import { Cell, Pie, PieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { CategoryData } from "@/types/sales";

interface SalesByCategoryChartProps {
  data: CategoryData[];
}

export default function SalesByCategoryChart({ data }: SalesByCategoryChartProps) {
  const chartConfig = data.reduce((config, item, index) => {
    config[`category${index}`] = {
      label: item.name,
      color: item.color,
    };
    return config;
  }, {} as Record<string, { label: string; color: string }>);

  const chartData = data.map((item, index) => ({
    category: `category${index}`,
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

      <div className="flex flex-col items-center">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={100}
              dataKey="value"
              label={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="flex flex-wrap items-center justify-center gap-5 mt-6">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-[10px] h-[10px] rounded-full"
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
        </div>
      </div>
    </div>
  );
}
