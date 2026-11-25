"use client";

import { formatCompactNaira, parseNumeric } from "@/lib/mappers/dashboard";
import type { BestSellingCategory } from "@/types/DashboardTypes";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

type DashboardSalesByCategoryProps = {
  categories?: BestSellingCategory[] | null;
};

const COLORS = ["#0B1E66", "#2F5BDB", "#98B3FF", "#F7B84B", "#E4E7EC"];

const DUMMY_CATEGORIES: BestSellingCategory[] = [
  { category_name: "Groceries", total_income: 4200000, units_sold: 820, order_frequency: 310, percent: 38 },
  { category_name: "Phones", total_income: 2800000, units_sold: 94, order_frequency: 88, percent: 25 },
  { category_name: "Electronics", total_income: 1900000, units_sold: 61, order_frequency: 54, percent: 17 },
  { category_name: "Appliances", total_income: 1400000, units_sold: 28, order_frequency: 22, percent: 13 },
  { category_name: "Other", total_income: 780000, units_sold: 40, order_frequency: 19, percent: 7 },
];

export default function DashboardSalesByCategory({
  categories,
}: DashboardSalesByCategoryProps) {
  const mapped = (categories && categories.length > 0 ? categories : DUMMY_CATEGORIES)
    .map((category, index) => {
      const value = parseNumeric(category.total_income);
      return {
        id: category.category_id ?? category.category_name,
        name: category.category_name,
        value,
        percent: category.percent,
        color: COLORS[index % COLORS.length],
      };
    })
    .filter((item) => item.value > 0);
  const data =
    mapped.length > 0
      ? mapped
      : DUMMY_CATEGORIES.map((category, index) => ({
          id: category.category_name,
          name: category.category_name,
          value: parseNumeric(category.total_income),
          percent: category.percent,
          color: COLORS[index % COLORS.length],
        }));
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="rounded-2xl border border-[#EAECF0] bg-white p-4 sm:p-5 min-w-0">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h2 className="text-sm font-semibold text-[#101828]">Sales by category</h2>
        <span className="text-[12px] text-[#667085]">Past month</span>
      </div>

      <div className="relative h-48 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={80}
              strokeWidth={0}
              paddingAngle={1}
            >
              {data.map((entry) => (
                <Cell key={String(entry.id)} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[11px] text-[#98A2B3]">Total</p>
          <p className="text-sm font-semibold text-[#101828]">
            {formatCompactNaira(total)}
          </p>
        </div>
      </div>

      <div className="space-y-2.5 mt-1">
        {data.map((item) => (
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
              <span>{formatCompactNaira(item.value)}</span>
              <span className="w-8 text-right">
                {item.percent != null
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
