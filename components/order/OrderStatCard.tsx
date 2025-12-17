"use client";

import { cn } from "@/lib/utils";
// import { TrendingUp, TrendingDown } from "lucide-react";

type OrderStatCardProps = {
  title: string;
  value: number;
  changePercent: number;
  increased?: boolean;
  changeLabel?: string;
  className?: string;
};

export default function OrderStatCard({
  title,
  value,
  changePercent,
  // increased = true,
  changeLabel = "Compared to last month",
  className,
}: OrderStatCardProps) {
  const formatted = new Intl.NumberFormat("en-US").format(value);

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-[#D9D9D9] p-5 flex flex-col gap-2.5 shadow-xs",
        className
      )}>
      <p className="text-[#808080] text-sm font-medium">{title}</p>
      <p className="text-[#0B1E66] text-[30px] font-semibold tracking-tight">
        {formatted}
      </p>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF1F6] px-2 py-1 text-xs font-medium text-[#1F3A78]">
          {/* {increased ? (
            <TrendingUp className="size-3.5" />
          ) : (
            <TrendingDown className="size-3.5" />
          )} */}
          {changePercent}%
        </span>
        <span className="text-[#4D4D4D] text-xs">{changeLabel}</span>
      </div>
    </div>
  );
}
