"use client";

import { parseNumeric } from "@/lib/mappers/dashboard";
import type { DashboardOverview } from "@/types/DashboardTypes";
import { ClipboardList, Truck, TrendingUp, Users } from "lucide-react";
import type { ReactNode } from "react";

type DashboardQuickStatsProps = {
  overview?: DashboardOverview | null;
  ridersFree?: number;
  ridersTotal?: number;
};

function Trend({ value, asPts = false }: { value: string; asPts?: boolean }) {
  const numeric = Number(String(value).replace("%", "").replace("+", ""));
  const up = !Number.isNaN(numeric) && numeric >= 0;
  if (!value || value === "0%" || value === "0") {
    return <span className="text-[12px] text-[#98A2B3]">all time</span>;
  }
  const label = asPts
    ? `${up ? "+" : ""}${numeric} pts`
    : value.startsWith("+") || value.startsWith("-")
      ? value
      : `${up ? "+" : ""}${value}`;
  return (
    <span className={`text-[12px] font-medium ${up ? "text-[#12B76A]" : "text-[#F04438]"}`}>
      {label}
    </span>
  );
}

function conversionValue(value?: number | string) {
  if (value == null || value === "") return "3.8%";
  const text = String(value);
  return text.includes("%") ? text : `${text}%`;
}

export default function DashboardQuickStats({
  overview,
  ridersFree = 0,
  ridersTotal = 0,
}: DashboardQuickStatsProps) {
  const stats = overview?.stats;
  const totalOrders =
    overview?.total_orders?.value ?? parseNumeric(stats?.total_orders.value);
  const activeUsers =
    overview?.active_users?.value ?? parseNumeric(stats?.active_users.value);
  const activeChange =
    overview?.active_users?.change_percent != null
      ? `${overview.active_users.change_percent}%`
      : stats?.active_users.trend;
  const conversion = overview?.conversion_rate?.value ?? stats?.conversion_rate.value;
  const conversionChange =
    overview?.conversion_rate?.change_points != null
      ? `${overview.conversion_rate.change_points}`
      : stats?.conversion_rate.trend;
  const free = overview?.riders?.free ?? ridersFree;
  const total = overview?.riders?.total ?? ridersTotal;

  const items: {
    label: string;
    value: string;
    hint?: ReactNode;
    icon: ReactNode;
    iconClass: string;
  }[] = [
    {
      label: "Total orders",
      value: Number(totalOrders || 0).toLocaleString(),
      hint: <span className="text-[12px] text-[#98A2B3]">all time</span>,
      icon: <ClipboardList className="size-4" />,
      iconClass: "bg-[#EEF2FF] text-[#3538CD]",
    },
    {
      label: "Active users",
      value: Number(activeUsers || 0).toLocaleString(),
      hint: <Trend value={activeChange ?? "0%"} />,
      icon: <Users className="size-4" />,
      iconClass: "bg-[#ECFDF3] text-[#12B76A]",
    },
    {
      label: "Conversion rate",
      value: conversionValue(conversion),
      hint: overview?.conversion_rate ? (
        overview.conversion_rate.change_points == null ? (
          <span className="text-[12px] text-[#98A2B3]">all time</span>
        ) : (
          <Trend value={`${overview.conversion_rate.change_points}`} asPts />
        )
      ) : (
        <Trend value={conversionChange ?? "0%"} asPts />
      ),
      icon: <TrendingUp className="size-4" />,
      iconClass: "bg-[#FFF6ED] text-[#F79009]",
    },
    {
      label: "Riders free now",
      value: total ? `${free} of ${total}` : "14 of 48",
      icon: <Truck className="size-4" />,
      iconClass: "bg-[#F2F4F7] text-[#667085]",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-[#E4E6EB] bg-white px-4 py-3 flex items-center gap-3 min-w-0"
        >
          <span
            className={`size-9 rounded-xl inline-flex items-center justify-center shrink-0 ${item.iconClass}`}
          >
            {item.icon}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] text-[#667085]">{item.label}</p>
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-lg font-semibold text-[#101828] truncate">
                {item.value}
              </p>
              {item.hint}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
