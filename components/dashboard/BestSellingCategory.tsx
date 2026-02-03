"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  BestSellingCategory as BestSellingCategoryItem,
  TopProductsFilter,
} from "@/types/DashboardTypes";

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

type BestSellingCategoryProps = {
  categories?: BestSellingCategoryItem[] | null;
  loading?: boolean;
  filter?: TopProductsFilter;
  onFilterChange?: (filter: TopProductsFilter) => void;
};

export default function BestSellingCategory({
  categories,
  loading = false,
  filter = "day",
  onFilterChange,
}: BestSellingCategoryProps) {
  const list = categories && categories.length > 0 ? categories : [];

  return (
    <div className="bg-white rounded-xl border border-[#EEF1F6] p-6 shadow-xs">
      <div className="flex items-start justify-between mb-4 gap-5">
        <div>
          <h3 className="text-[#071D32] text-[20px] font-bold mb-1">
            Best Selling Categories
          </h3>
          <p className="text-[#909090] text-sm">
            By order frequency, units sold and revenue
          </p>
        </div>
        <Select
          value={filter}
          onValueChange={(value) =>
            onFilterChange?.(value as TopProductsFilter)
          }
        >
          <SelectTrigger className="w-30 h-9 border-[#EEF1F6]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="year">Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 py-3 rounded-lg"
            >
              <Skeleton className="shrink-0 w-8 h-8 rounded-full" />
              <Skeleton className="h-4 w-28 flex-1 max-w-[140px]" />
              <div className="flex items-center gap-6 flex-1 justify-end">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))
        ) : list.length === 0 ? (
          <p className="text-[#667085] text-sm py-4">
            No best selling categories data
          </p>
        ) : (
          list.map((category, index) => (
            <div
              key={`${category.category_name}-${index}`}
              className="flex items-center gap-4 py-3 rounded-lg transition-colors"
            >
              <div className="shrink-0 w-8 h-8 rounded-full bg-[#0B1E66] text-white flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#101928] font-medium text-sm truncate max-w-[200px]">
                  {category.category_name}
                </p>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <p className="text-[#98A2B3] text-xs">Orders</p>
                  <p className="text-[#0A2B4B] font-bold text-[16px]">
                    {category.order_frequency}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#98A2B3] text-xs">Units Sold</p>
                  <p className="text-[#0A2B4B] font-bold text-[16px]">
                    {category.units_sold}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#98A2B3] text-xs">Revenue</p>
                  <p className="text-[#0A2B4B] font-bold text-[16px]">
                    {formatIncome(category.total_income)}
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
