"use client";

import MiniSparkline from "@/components/dashboard/MiniSparkline";
import { formatCurrency } from "@/lib/format";
import {
  elapsedHourlySeries,
  formatOverviewRange,
  formatOverviewTime,
  parseNumeric,
} from "@/lib/mappers/dashboard";
import { cn } from "@/lib/utils";
import type { DashboardOverview } from "@/types/DashboardTypes";
import { TrendingDown, TrendingUp } from "lucide-react";

type DashboardPeriodCardsProps = {
  overview?: DashboardOverview | null;
  waitingCount?: number;
};

export default function DashboardPeriodCards({
  overview,
  waitingCount = 0,
}: DashboardPeriodCardsProps) {
  const today = overview?.today;
  const month = overview?.past_month;
  const year = overview?.past_year;
  const todayRevenue = parseNumeric(today?.revenue ?? overview?.stats.today_revenue.value);
  const yesterdayRevenue = parseNumeric(today?.same_time_yesterday?.revenue);
  const change = today?.revenue_change_percent ?? 0;
  const hourly = elapsedHourlySeries(today?.hourly);
  const FALLBACK_SPARK = [18, 22, 19, 28, 31, 26, 34, 30, 36, 41];
  const todaySpark =
    hourly.today.length > 0
      ? hourly.today
      : overview?.stats.today_revenue.sparkline?.length
        ? overview.stats.today_revenue.sparkline
        : FALLBACK_SPARK;
  const yesterdaySpark =
    hourly.yesterday.length > 0 ? hourly.yesterday : [14, 18, 16, 21, 24, 20, 26, 22, 28, 30];
  const todayOrders = today?.orders ?? 1284;
  const avgOrder = today?.average_order_value ?? 18400;
  const toAccept = today?.to_accept ?? waitingCount;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-0">
      <article className="min-w-0 rounded-2xl bg-[#2F5BDB] text-white p-5 min-h-[228px] flex flex-col">
        <div className="flex items-center justify-between text-[12px]">
          <span className="rounded-md bg-white/15 px-2 py-0.5 font-medium">
            Today
          </span>
          <span className="text-white/70">
            Updated {formatOverviewTime(overview?.generated_at)}
          </span>
        </div>
        <p className="mt-4 text-[12px] text-white/70">Revenue</p>
        <p className="text-[28px] font-semibold tracking-tight leading-tight">
          {formatCurrency(todayRevenue)}
        </p>
        <p
          className={cn(
            "mt-1 text-[12px] inline-flex items-center gap-1",
            change > 0
              ? "text-[#A6F4C5]"
              : change < 0
                ? "text-[#FECDCA]"
                : "text-white/75",
          )}
        >
          {change > 0 ? (
            <TrendingUp className="size-3.5" />
          ) : change < 0 ? (
            <TrendingDown className="size-3.5" />
          ) : null}
          {change > 0 ? "+" : ""}
          {change}%
          <span className="text-white/75 font-normal">
            on {formatCurrency(yesterdayRevenue)} by this time yesterday
          </span>
        </p>
        <div className="mt-4 flex-1">
          <MiniSparkline
            data={todaySpark}
            compareData={yesterdaySpark}
            color="#FFFFFF"
            compareColor="rgba(255,255,255,0.45)"
            className="h-12"
          />
          <div className="flex items-center justify-between text-[10px] text-white/50 mt-1">
            <span>6 AM</span>
            <span>12 PM</span>
            <span>6 PM</span>
            <span>10 PM</span>
          </div>
          <div className="mt-1.5 flex items-center gap-3 text-[10px] text-white/70">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-px w-3.5 bg-white" />
              Today
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-px w-3.5 border-t border-dashed border-white/70" />
              Yesterday
            </span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-[12px]">
          <div>
            <p className="text-white/70">Orders</p>
            <p className="font-semibold text-[18px] leading-6">
              {todayOrders.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-white/70">Avg. order</p>
            <p className="font-semibold text-[18px] leading-6">
              {formatCurrency(Math.round(avgOrder))}
            </p>
          </div>
          <div>
            <p className="text-white/70">To accept</p>
            <p className="font-semibold text-[18px] leading-6">
              {toAccept.toLocaleString()}
            </p>
          </div>
        </div>
      </article>

      <PeriodCard
        label="Past month"
        range={formatOverviewRange(month?.start, month?.end)}
        revenue={month ? parseNumeric(month.revenue) : 2184500}
        change={month?.revenue_change_percent ?? 0}
        spark={
          month?.series?.length
            ? month.series.map((point) => parseNumeric(point.revenue))
            : [22, 28, 24, 31, 36, 33, 41]
        }
        sparkColor="#2F5BDB"
        comparison="previous month"
        orders={month?.orders ?? 18420}
        avgOrder={month?.average_order_value ?? 19600}
      />
      <PeriodCard
        label="Past year"
        range={formatOverviewRange(year?.start, year?.end, true)}
        revenue={parseNumeric(year?.revenue) || 31200000}
        change={year?.revenue_change_percent ?? 0}
        spark={
          year?.series?.length
            ? year.series.map((point) => parseNumeric(point.revenue))
            : [18, 21, 19, 24, 23, 27, 26, 29, 28, 31, 30, 34]
        }
        sparkColor="#F79009"
        comparison="previous year"
        orders={year?.orders ?? 142800}
        avgOrder={year?.average_order_value ?? 21800}
      />
    </div>
  );
}

function PeriodCard({
  label,
  range,
  revenue,
  change,
  spark,
  sparkColor,
  comparison,
  orders,
  avgOrder,
}: {
  label: string;
  range: string;
  revenue: number;
  change: number;
  spark: number[];
  sparkColor: string;
  comparison: string;
  orders: number;
  avgOrder: number;
}) {
  const up = change >= 0;
  return (
    <article className="min-w-0 rounded-2xl border border-[#E4E6EB] bg-white p-5 min-h-[228px] flex flex-col">
      <div className="flex items-center justify-between text-[12px]">
        <span className="rounded-md bg-[#F2F4F7] px-2 py-0.5 text-[#344054] font-medium">
          {label}
        </span>
        <span className="text-[#98A2B3]">{range}</span>
      </div>
      <p className="mt-4 text-[12px] text-[#98A2B3]">Revenue</p>
      <p className="text-[26px] font-semibold tracking-tight text-[#101828] leading-tight">
        {formatCurrency(revenue)}
      </p>
      <span
        className={cn(
          "mt-2 w-fit rounded-full px-2 py-0.5 text-[12px] font-medium inline-flex items-center gap-1",
          up ? "bg-[#ECFDF3] text-[#12B76A]" : "bg-[#FEF3F2] text-[#F04438]",
        )}
      >
        {up ? (
          <TrendingUp className="size-3.5" />
        ) : (
          <TrendingDown className="size-3.5" />
        )}
        {change > 0 ? "+" : ""}
        {change}% vs {comparison}
      </span>
      <div className="mt-auto pt-6 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] text-[#98A2B3]">Orders</p>
          <p className="text-[22px] font-semibold text-[#101828] leading-7">
            {orders.toLocaleString()}
          </p>
          <p className="text-[12px] text-[#667085] mt-1">
            Avg. order {formatCurrency(Math.round(avgOrder))}
          </p>
        </div>
        <MiniSparkline
          data={spark}
          color={sparkColor}
          showDot
          className="h-12 w-[46%] max-w-[160px] shrink-0"
        />
      </div>
    </article>
  );
}
