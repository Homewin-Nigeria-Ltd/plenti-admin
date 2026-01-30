/** Stats from GET {{admin_url}}/dashboard/overview (data.stats) */
export type DashboardStats = {
  total_revenue: number;
  total_orders: number;
  active_users: number;
  conversion_rate: number;
  today_revenue: number;
  total_deliveries: number;
  total_products: number;
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

/** Dashboard overview payload – excludes revenue_overview (handled by separate endpoint with filters) */
export type DashboardOverview = {
  stats: DashboardStats;
  top_products: DashboardTopProduct[];
  cart_analysis: DashboardCartAnalysis;
  recent_orders: DashboardRecentOrder[];
};

export type DashboardState = {
  overview: DashboardOverview | null;
  loadingOverview: boolean;
  overviewError: string | null;

  fetchDashboardOverview: () => Promise<boolean>;
};
