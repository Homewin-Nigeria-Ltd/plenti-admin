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
 * Parses a trend string (e.g., "+100%", "-5%", "0%") to extract percentage and direction.
 */
function parseTrend(trend: string): { percent: number; increased: boolean } {
  const cleanTrend = trend.replace("%", "").trim();
  const percent = parseFloat(cleanTrend);
  return {
    percent: isNaN(percent) ? 0 : Math.abs(percent),
    increased: percent >= 0,
  };
}

/**
 * Maps dashboard overview stats to stat cards for the main dashboard grid.
 */
export function mapOverviewToStatCards(
  overview: DashboardOverview | null | undefined
): StatCardItem[] | null {
  if (!overview?.stats) return null;
  const s = overview.stats;

  const revenueTrend = parseTrend(s.total_revenue.trend);
  const ordersTrend = parseTrend(s.total_orders.trend);
  const usersTrend = parseTrend(s.active_users.trend);
  const conversionTrend = parseTrend(s.conversion_rate.trend);

  return [
    {
      title: "Total Revenue",
      value: formatCurrency(Number(s.total_revenue.value)),
      changePercent: revenueTrend.percent,
      increased: revenueTrend.increased,
      trendData: s.total_revenue.sparkline || [...PLACEHOLDER_TREND],
    },
    {
      title: "Total Orders",
      value: new Intl.NumberFormat("en-US").format(
        Number(s.total_orders.value)
      ),
      changePercent: ordersTrend.percent,
      increased: ordersTrend.increased,
      trendData: s.total_orders.sparkline || [...PLACEHOLDER_TREND],
    },
    {
      title: "Active Users",
      value: formatCompact(Number(s.active_users.value)),
      changePercent: usersTrend.percent,
      increased: usersTrend.increased,
      trendData: s.active_users.sparkline || [...PLACEHOLDER_TREND],
    },
    {
      title: "Conversion Rate",
      value: String(s.conversion_rate.value),
      changePercent: conversionTrend.percent,
      increased: conversionTrend.increased,
      trendData: s.conversion_rate.sparkline || [...PLACEHOLDER_TREND],
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

  const deliveriesTrend = parseTrend(s.total_deliveries.trend);
  const todayRevenueTrend = parseTrend(s.today_revenue.trend);
  const productsTrend = parseTrend(s.total_products.trend);

  return [
    {
      title: "Total Deliveries",
      value: new Intl.NumberFormat("en-US").format(
        Number(s.total_deliveries.value)
      ),
      changePercent: deliveriesTrend.percent,
    },
    {
      title: "Today's Revenue",
      value: formatCurrency(Number(s.today_revenue.value)),
      changePercent: todayRevenueTrend.percent,
    },
    {
      title: "Number of Products",
      value: new Intl.NumberFormat("en-US").format(
        Number(s.total_products.value)
      ),
      changePercent: productsTrend.percent,
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
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function getFirstName(name?: string | null) {
  if (!name) return "";
  return name.trim().split(/\s+/)[0] ?? "";
}

export function formatCompactNaira(amount: number) {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000_000) {
    return `₦${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (abs >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    return `₦${(amount / 1_000).toFixed(1)}K`;
  }
  return formatCurrency(amount);
}

export function parseNumeric(value: number | string | null | undefined) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value !== "string") return 0;
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatOverviewRange(
  start?: string,
  end?: string,
  withYear = false,
) {
  if (!start || !end) return withYear ? "Jan – Dec 2026" : "1 – 30 Nov";
  const from = new Date(`${start}T00:00:00`);
  const to = new Date(`${end}T00:00:00`);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return "";
  if (withYear) {
    const fmt = (date: Date) =>
      `${date.toLocaleString("en-GB", { month: "short" })} ${date.getFullYear()}`;
    return `${fmt(from)} – ${fmt(to)}`;
  }
  const fmt = (date: Date) =>
    `${date.getDate()} ${date.toLocaleString("en-GB", { month: "short" })}`;
  return `${fmt(from)} – ${fmt(to)}`;
}

export function formatOverviewTime(iso?: string) {
  const date = iso ? new Date(iso) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function elapsedHourlySeries(hourly?: {
  today: number | null;
  yesterday: number | null;
}[]) {
  const hours = hourly ?? [];
  const elapsed = hours.filter((hour) => hour.today != null);
  const source = elapsed.length > 0 ? elapsed : hours;
  return {
    today: source.map((hour) => parseNumeric(hour.today)),
    yesterday: source.map((hour) => parseNumeric(hour.yesterday)),
  };
}
