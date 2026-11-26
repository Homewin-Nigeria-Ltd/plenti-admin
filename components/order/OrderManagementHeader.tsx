"use client";

import { CalendarDays, ChevronDown, Download } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  ORDER_PERIODS,
  type OrderPeriod,
} from "@/components/order/orderManagementView";

type OrderManagementHeaderProps = {
  period: OrderPeriod;
  onPeriodChange: (period: OrderPeriod) => void;
  orderCount?: number;
  revenue?: number;
  waitingCount?: number;
  exporting?: boolean;
  onExport: () => void;
};

export default function OrderManagementHeader({
  period,
  onPeriodChange,
  orderCount,
  revenue,
  waitingCount,
  exporting = false,
  onExport,
}: OrderManagementHeaderProps) {
  const ordersLabel =
    orderCount == null ? "-" : orderCount.toLocaleString("en-US");
  const amountLabel =
    revenue != null && Number.isFinite(revenue)
      ? formatCurrency(revenue)
      : "-";
  const waitingLabel =
    waitingCount == null ? "-" : waitingCount.toLocaleString("en-US");
  const periodLabel =
    ORDER_PERIODS.find((item) => item.id === period)?.label ?? "Today";
  const subtitle = `${periodLabel}: ${ordersLabel} orders · ${amountLabel} · ${waitingLabel} waiting for you`;

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-[24px] leading-8 font-semibold text-[#101828] tracking-tight">
          Order Management
        </h1>
        <p className="text-sm text-[#667085] mt-1">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#667085]" />
          <select
            value={period}
            onChange={(event) => onPeriodChange(event.target.value as OrderPeriod)}
            className="h-9 appearance-none rounded-lg border border-[#EAECF0] bg-white pl-9 pr-8 text-[13px] text-[#344054] outline-none"
          >
            {ORDER_PERIODS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#98A2B3]" />
        </div>
        <button
          type="button"
          disabled={exporting}
          className={cn(
            "h-9 px-3.5 rounded-lg border border-[#EAECF0] bg-white text-[13px] font-medium text-[#344054]",
            "inline-flex items-center gap-1.5 hover:bg-[#F9FAFB] disabled:opacity-60",
          )}
          onClick={onExport}
        >
          <Download className="size-3.5" />
          {exporting ? "Exporting…" : "Export"}
        </button>
      </div>
    </div>
  );
}
