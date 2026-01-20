"use client";

import { cn } from "@/lib/utils";

type TicketStatCardProps = {
  title: string;
  value: string | number;
  changePercent: number;
  increased?: boolean;
  isHighlighted?: boolean;
  className?: string;
};

export default function TicketStatCard({
  title,
  value,
  changePercent,
  increased = true,
  isHighlighted = false,
  className,
}: TicketStatCardProps) {
  const formattedValue =
    typeof value === "number"
      ? new Intl.NumberFormat("en-US").format(value)
      : value;

  return (
    <div
      className={cn(
        "bg-white rounded-xl border flex flex-col gap-2.5 shadow-xs relative overflow-hidden",
        isHighlighted ? "border-[#1F3A78] border-2" : "border-[#D9D9D9]",
        className
      )}
    >
      {isHighlighted && (
        <div className="absolute inset-[2px] border-2 border-dashed border-[#1F3A78] rounded-lg pointer-events-none" />
      )}
      <div className={cn("p-5 relative z-10", isHighlighted && "p-3")}>
        <p className="text-[#808080] text-sm font-medium mb-2">{title}</p>
        <p className="text-[#0B1E66] text-[30px] font-semibold tracking-tight mb-2">
          {formattedValue}
        </p>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
            increased
              ? "bg-[#E8EEFF] text-[#0B1E66]"
              : "bg-[#FBEAE9] text-[#D42620]"
          )}
        >
          {changePercent}% ↑ vs last month
        </span>
      </div>
    </div>
  );
}
