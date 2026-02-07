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

/** Top product from dashboard overview (data.top_products[]) */
export type DashboardTopProduct = {
  name: string;
  category_name: string;
  image_url: string;
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
  revenue: number;
};

/** Best selling category from dashboard */
export type BestSellingCategory = {
  category_name: string;
  order_frequency: number;
  units_sold: string;
  total_income: string;
};

/** Dashboard overview payload – includes all data from API response */
export type DashboardOverview = {
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
