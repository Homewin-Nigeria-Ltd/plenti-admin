/** Stat value with trend and sparkline data */
export type StatValue = {
  value: number | string;
  trend: string;
  sparkline?: number[];
};

/** Stats from GET {{admin_url}}/dashboard/overview (data.stats) */
export type DashboardStats = {
  total_revenue: StatValue;
  total_orders: StatValue;
  active_users: StatValue;
  conversion_rate: StatValue;
  today_revenue: StatValue;
  total_deliveries: StatValue;
  total_products: StatValue;
  top_weekly_category: string;
};

export type OverviewHourPoint = {
  hour: number;
  label: string;
  today: number | null;
  yesterday: number | null;
};

export type OverviewSameTime = {
  revenue: number;
  orders: number;
  average_order_value: number;
};

export type OverviewToday = {
  revenue: number;
  orders: number;
  average_order_value: number;
  to_accept: number;
  same_time_yesterday: OverviewSameTime;
  revenue_change_percent: number;
  hourly: OverviewHourPoint[];
};

export type OverviewPreviousPeriod = {
  start: string;
  end: string;
  revenue: number;
  orders: number;
  average_order_value: number;
};

export type OverviewMonthPoint = {
  date: string;
  label: string;
  orders: number;
  revenue: number;
};

export type OverviewYearPoint = {
  month: string;
  label: string;
  orders: number;
  revenue: number;
};

export type OverviewPastMonth = {
  start: string;
  end: string;
  revenue: number;
  orders: number;
  average_order_value: number;
  previous: OverviewPreviousPeriod;
  revenue_change_percent: number;
  series: OverviewMonthPoint[];
};

export type OverviewPastYear = {
  start: string;
  end: string;
  revenue: number;
  orders: number;
  average_order_value: number;
  previous: OverviewPreviousPeriod;
  revenue_change_percent: number;
  series: OverviewYearPoint[];
};

/** Top product from dashboard overview (data.top_products[]) */
export type DashboardTopProduct = {
  name: string;
  category_name: string;
  image_url?: string;
  image_urls?: string[];
  units_sold: string;
  total_income: string;
};

/** Cart analysis from dashboard overview (data.cart_analysis) */
export type DashboardCartAnalysis = {
  abandoned_rate_percentage: number;
  abandoned_cart_count: number;
  abandoned_revenue: string;
};

/** Recent order from dashboard overview (data.recent_orders[]) */
export type DashboardRecentOrder = {
  date: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  order_value: number;
  quantity: number;
  status: string;
};

/** Revenue overview data point */
export type RevenueOverviewData = {
  month: string;
  revenue: number | string;
};

/** Best selling category from dashboard */
export type BestSellingCategory = {
  category_id?: number | null;
  category_name: string;
  order_frequency: number;
  units_sold: string | number;
  total_income: string | number;
  percent?: number;
};

/** Dashboard overview payload – includes all data from API response */
export type DashboardOverview = {
  generated_at?: string;
  today?: OverviewToday;
  past_month?: OverviewPastMonth;
  past_year?: OverviewPastYear;
  total_orders?: { value: number };
  active_users?: { value: number; change_percent?: number | null };
  conversion_rate?: {
    value: number | string;
    active_customers?: number;
    buyers?: number;
    change_points?: number | null;
  };
  riders?: { free: number; total: number };
  stats: DashboardStats;
  top_products: DashboardTopProduct[];
  cart_analysis: DashboardCartAnalysis;
  recent_orders: DashboardRecentOrder[];
  revenue_overview: RevenueOverviewData[];
  best_selling_categories: BestSellingCategory[];
};

export type TopProductsFilter = "day" | "week" | "month" | "year";

export type RevenueChartData = {
  label: string;
  value: number;
};

export type RevenueStats = {
  filter: TopProductsFilter;
  total_revenue: number;
  currency: string;
  percentage_change: number;
  trend: "up" | "down";
  chart_data: RevenueChartData[];
  total_transactions?: number;
  average_order_value?: number;
};

export type DashboardState = {
  overview: DashboardOverview | null;
  loadingOverview: boolean;
  overviewError: string | null;

  topProducts: DashboardTopProduct[] | null;
  loadingTopProducts: boolean;

  bestSellingCategories: BestSellingCategory[] | null;
  loadingBestSellingCategories: boolean;

  revenueStats: RevenueStats | null;
  loadingRevenueStats: boolean;

  fetchDashboardOverview: () => Promise<boolean>;
  fetchTopProducts: (filter: TopProductsFilter) => Promise<boolean>;
  fetchBestSellingCategories: (filter: TopProductsFilter) => Promise<boolean>;
  fetchRevenueStats: (filter: TopProductsFilter) => Promise<boolean>;
};
