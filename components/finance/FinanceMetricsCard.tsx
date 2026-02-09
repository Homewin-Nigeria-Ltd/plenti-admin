"use client";

import { useFinanceStore } from "@/store/useFinanceStore";
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

export function FinanceMetricsCard() {
  const { overview } = useFinanceStore();

  const summary = overview?.summary;

  return (
    <div className="rounded-2xl bg-[#0B1E66] text-white p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap">
        <div className="space-y-2 pr-2">
          <p className="text-white text-[14px]">Total Revenue</p>
          <div className="flex items-center justify-between">
            <p className="text-[48px] font-semibold">
              {summary?.total_revenue
                ? formatCurrency(summary.total_revenue)
                : "₦0"}
            </p>
            <div className="flex items-end flex-col gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs">
                ↑ 5%
              </span>
              <span className="text-white/70 text-[10px]">vs last month</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 md:border-l md:border-white/20 md:px-3">
          <p className="text-white/80">Pending Refunds</p>
          <div className="flex items-center justify-between">
            <p className="text-[48px] font-semibold">
              {summary?.pending_refunds
                ? formatNumber(summary.pending_refunds)
                : "0"}
            </p>
            <div className="flex items-end flex-col gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs">
                ↑ 5%
              </span>
              <span className="text-white/70 text-[10px]">vs last month</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 md:border-l md:border-white/20 md:px-3">
          <p className="text-white/80">Total Transactions</p>
          <div className="flex items-center justify-between">
            <p className="text-[48px] font-semibold">
              {summary?.total_transactions
                ? formatNumber(summary.total_transactions)
                : "0"}
            </p>
            <div className="flex items-end flex-col gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-xs">
                ↓ 5%
              </span>
              <span className="text-white/70 text-[10px]">vs last month</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 md:border-l md:border-white/20 md:px-3">
          <p className="text-white/80">Average Order Value</p>
          <div className="flex items-center justify-between">
            <p className="text-[48px] font-semibold">
              {summary?.average_order_value
                ? formatCurrency(summary.average_order_value)
                : "₦0"}
            </p>
            <div className="flex items-end flex-col gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs">
                ↑ 5%
              </span>
              <span className="text-white/70 text-[10px]">vs last month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
