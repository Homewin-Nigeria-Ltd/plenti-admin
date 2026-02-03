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
import Image from "next/image";
import type {
  DashboardTopProduct,
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

type TopProductsProps = {
  products?: DashboardTopProduct[] | null;
  loading?: boolean;
  filter?: TopProductsFilter;
  onFilterChange?: (filter: TopProductsFilter) => void;
};

export default function TopProducts({
  products,
  loading = false,
  filter = "day",
  onFilterChange,
}: TopProductsProps) {
  const list = products && products.length > 0 ? products : [];

  return (
    <div className="bg-white rounded-xl border border-[#EEF1F6] p-6 shadow-xs">
      <div className="flex items-start justify-between mb-4 gap-5">
        <div>
          <h3 className="text-[#071D32] text-[20px] font-bold mb-1">
            Top Products
          </h3>
          <p className="text-[#909090] text-sm">
            Based on number order frequency (units sold)
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
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Skeleton className="shrink-0 w-8 h-8 rounded-full" />
                <Skeleton className="shrink-0 w-12 h-12 rounded-lg" />
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <div className="space-y-2 text-right">
                  <Skeleton className="h-3 w-16 ml-auto" />
                  <Skeleton className="h-4 w-12 ml-auto" />
                </div>
                <div className="space-y-2 text-right">
                  <Skeleton className="h-3 w-16 ml-auto" />
                  <Skeleton className="h-4 w-14 ml-auto" />
                </div>
              </div>
            </div>
          ))
        ) : list.length === 0 ? (
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
                  <p className="text-[#101928] font-medium text-sm truncate max-w-[200px]">
                    {product.name}
                  </p>
                  <p className="text-[#667085] text-xs">
                    {product.category_name}
                  </p>
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
