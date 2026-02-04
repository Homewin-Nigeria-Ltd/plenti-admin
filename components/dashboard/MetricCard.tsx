"use client";

import * as React from "react";
import { TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  title: string;
  value: string | number;
  changePercent: number;
  className?: string;
};

export default function MetricCard({
  title,
  value,
  changePercent,
  className,
}: MetricCardProps) {
  const formattedValue =
    typeof value === "number"
      ? new Intl.NumberFormat("en-US").format(value)
      : value;

  return (
    <div
      className={cn(
        "min-w-0 rounded-[8px] border border-[#E4E7EC] p-3 shadow-xs",
        className
      )}
    >
      <div className="min-w-0 bg-[#E8EEFF] rounded-[8px] p-4 @container">
        <p
          className="text-[#98A2B3] text-sm font-normal mb-3 truncate"
          title={title}
        >
          {title}
        </p>
        <p
          className="text-[#0B1E66] font-semibold tracking-tight mb-3 truncate text-[clamp(1.4rem,6cqw,2rem)]"
          title={String(formattedValue)}
        >
          {formattedValue}
        </p>
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-[#0B1E66]" />
          <span className="text-[#0B1E66] text-xs">{changePercent}%</span>
          <span className="text-[#98A2B3] text-xs">Compared to last month</span>
        </div>
      </div>
    </div>
  );
}
