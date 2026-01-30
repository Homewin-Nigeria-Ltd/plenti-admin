import { formatCurrency } from "@/lib/format";
import type { DashboardOverview } from "@/types/DashboardTypes";

const formatCompact = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

/** Shape for DashboardStatCard props derived from overview */
export type StatCardItem = {
  title: string;
  value: string;
  changePercent: number;
  increased: boolean;
  trendData: number[];
};

/** Shape for MetricCard props derived from overview */
export type MetricCardItem = {
  title: string;
  value: string;
  changePercent: number;
};

const PLACEHOLDER_TREND = [0, 0, 0] as const;

/**
 * Maps dashboard overview stats to stat cards for the main dashboard grid.
 */
export function mapOverviewToStatCards(
  overview: DashboardOverview | null | undefined
): StatCardItem[] | null {
  if (!overview?.stats) return null;
  const s = overview.stats;
  return [
    {
      title: "Total Revenue",
      value: formatCurrency(s.total_revenue),
      changePercent: 0,
      increased: true,
      trendData: [...PLACEHOLDER_TREND],
    },
    {
      title: "Total Orders",
      value: new Intl.NumberFormat("en-US").format(s.total_orders),
      changePercent: 0,
      increased: true,
      trendData: [...PLACEHOLDER_TREND],
    },
    {
      title: "Active Users",
      value: formatCompact(s.active_users),
      changePercent: 0,
      increased: true,
      trendData: [...PLACEHOLDER_TREND],
    },
    {
      title: "Conversion Rate",
      value: `${s.conversion_rate}%`,
      changePercent: 0,
      increased: true,
      trendData: [...PLACEHOLDER_TREND],
    },
  ];
}

/**
 * Maps dashboard overview stats to metric cards for the dashboard.
 */
export function mapOverviewToMetricCards(
  overview: DashboardOverview | null | undefined
): MetricCardItem[] | null {
  if (!overview?.stats) return null;
  const s = overview.stats;
  return [
    {
      title: "Total Deliveries",
      value: new Intl.NumberFormat("en-US").format(s.total_deliveries),
      changePercent: 0,
    },
    {
      title: "Today's Revenue",
      value: formatCurrency(s.today_revenue),
      changePercent: 0,
    },
    {
      title: "Number of Products",
      value: new Intl.NumberFormat("en-US").format(s.total_products),
      changePercent: 0,
    },
    {
      title: "Top Weekly Category",
      value: s.top_weekly_category || "—",
      changePercent: 0,
    },
  ];
}

/**
 * Returns the current date formatted for display (e.g. "Tuesday, January 27, 2025").
 */
export function getDisplayDate(): string {
  return new Date().toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
