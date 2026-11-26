"use client";

import { formatCompactNaira, parseNumeric } from "@/lib/mappers/dashboard";
import type { BestSellingCategory } from "@/types/DashboardTypes";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

type DashboardSalesByCategoryProps = {
  categories?: BestSellingCategory[] | null;
  loading?: boolean;
};

const COLORS = ["#0B1E66", "#2F5BDB", "#98B3FF", "#F7B84B", "#E4E7EC"];

const PLACEHOLDER_ROWS = 5;

export default function DashboardSalesByCategory({
  categories,
  loading = false,
}: DashboardSalesByCategoryProps) {
  const waiting = loading || !categories?.length;
  const data = (categories ?? []).map((category, index) => {
    const value = parseNumeric(category.total_income);
    return {
      id: category.category_id ?? category.category_name,
      name: category.category_name,
      value,
      percent: category.percent,
      color: COLORS[index % COLORS.length],
    };
  });
  const chartData = waiting
    ? [{ id: "placeholder", name: "-", value: 1, percent: null, color: "#E4E7EC" }]
    : data.filter((item) => item.value > 0);
  const total = waiting ? 0 : data.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="rounded-2xl border border-[#E4E6EB] bg-white p-4 sm:p-5 min-w-0">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h2 className="text-sm font-semibold text-[#101828]">Sales by category</h2>
        <span className="text-[12px] text-[#667085]">Past month</span>
      </div>

      <div className="relative h-48 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={80}
              strokeWidth={0}
              paddingAngle={1}
            >
              {chartData.map((entry) => (
                <Cell key={String(entry.id)} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[11px] text-[#98A2B3]">Total</p>
          <p className="text-sm font-semibold text-[#101828]">
            {waiting ? "-" : formatCompactNaira(total)}
          </p>
        </div>
      </div>

      <div className="space-y-2.5 mt-1">
        {(waiting
          ? Array.from({ length: PLACEHOLDER_ROWS }, (_, index) => ({
              id: `placeholder-${index}`,
              name: "-",
              value: 0,
              percent: null as number | null,
              color: "#E4E7EC",
            }))
          : data
        ).map((item) => (
          <div
            key={String(item.id)}
            className="flex items-center justify-between gap-3 text-[12px]"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="size-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="truncate text-[#344054]">{item.name}</span>
            </div>
            <div className="flex items-center gap-4 shrink-0 text-[#667085]">
              <span>{waiting ? "-" : formatCompactNaira(item.value)}</span>
              <span className="w-8 text-right">
                {waiting
                  ? "-"
                  : item.percent != null
                    ? `${item.percent}%`
                    : `${total ? Math.round((item.value / total) * 100) : 0}%`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
