"use client";

import { useFinanceStore } from "@/store/useFinanceStore";
import { cn } from "@/lib/utils";
import * as React from "react";

const formatCurrency = (amount: string | number) => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-US").format(num);
};

type MetricItemProps = {
  label: string;
  value: string;
  change: "up" | "down";
  percent: string;
  className?: string;
};

function MetricItem({
  label,
  value,
  change,
  percent,
  className,
}: MetricItemProps) {
  return (
    <div className={cn("@container min-w-0 space-y-2", className)}>
      <p className="text-sm text-white/80">{label}</p>
      <div className="flex flex-col items-start gap-2 @[16rem]:flex-row @[16rem]:items-end @[16rem]:justify-between">
        <p className="text-2xl font-semibold leading-tight tracking-tight @[16rem]:text-[28px]">
          {value}
        </p>
        <div className="flex shrink-0 flex-col items-start gap-1 @[16rem]:items-end">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
              change === "up"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            )}
          >
            {change === "up" ? "↑" : "↓"} {percent}
          </span>
          <span className="text-[10px] text-white/70">vs last month</span>
        </div>
      </div>
    </div>
  );
}

export function FinanceMetricsCard() {
  const { overview } = useFinanceStore();

  const summary = overview?.summary;

  return (
    <div className="rounded-2xl bg-[#0B1E66] p-4 text-white sm:p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0">
        <MetricItem
          label="Total Revenue"
          value={
            summary?.total_revenue
              ? formatCurrency(summary.total_revenue)
              : "₦0"
          }
          change="up"
          percent="5%"
          className="xl:pr-5"
        />

        <MetricItem
          label="Pending Refunds"
          value={
            summary?.pending_refunds
              ? formatNumber(summary.pending_refunds)
              : "0"
          }
          change="up"
          percent="5%"
          className="sm:border-l sm:border-white/20 sm:pl-5 xl:px-5"
        />

        <MetricItem
          label="Total Transactions"
          value={
            summary?.total_transactions
              ? formatNumber(summary.total_transactions)
              : "0"
          }
          change="down"
          percent="5%"
          className="xl:border-l xl:border-white/20 xl:px-5"
        />

        <MetricItem
          label="Average Order Value"
          value={
            summary?.average_order_value
              ? formatCurrency(summary.average_order_value)
              : "₦0"
          }
          change="up"
          percent="5%"
          className="sm:border-l sm:border-white/20 sm:pl-5 xl:pl-5"
        />
      </div>
    </div>
  );
}
