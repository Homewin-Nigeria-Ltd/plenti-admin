"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import type { DashboardTopProduct } from "@/types/DashboardTypes";

const formatIncome = (value: string) => {
  const n = parseFloat(value);
  if (Number.isNaN(n)) return value;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
};

type TopProductsProps = {
  products?: DashboardTopProduct[] | null;
};

export default function TopProducts({ products }: TopProductsProps) {
  const [period, setPeriod] = React.useState("monthly");
  const list = products && products.length > 0 ? products : [];

  return (
    <div className="bg-white rounded-xl border border-[#EEF1F6] p-6 shadow-xs">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-[#071D32] text-[20px] font-bold mb-1">
            Top Products
          </h3>
          <p className="text-[#909090] text-sm">
            Based on number order frequency (units sold)
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[120px] h-9 border-[#EEF1F6]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {list.length === 0 ? (
          <p className="text-[#667085] text-sm py-4">No top products data</p>
        ) : (
          list.map((product, index) => (
            <div
              key={`${product.name}-${index}`}
              className="flex items-center gap-4 py-3 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="shrink-0 w-8 h-8 rounded-full bg-[#0B1E66] text-white flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <div className="shrink-0 w-12 h-12 rounded-lg bg-[#E8EEFF] flex items-center justify-center overflow-hidden">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="rounded-lg object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-[#D0D5DD] rounded-lg" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#101928] font-medium text-sm truncate">
                    {product.name}
                  </p>
                  <p className="text-[#667085] text-xs">{product.category_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <p className="text-[#98A2B3] text-xs">Number Sold</p>
                  <p className="text-[#0A2B4B] font-bold text-[16px]">
                    {product.units_sold}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#98A2B3] text-xs">Total Income</p>
                  <p className="text-[#0A2B4B] font-bold text-[16px]">
                    {formatIncome(product.total_income)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
