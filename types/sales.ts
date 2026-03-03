// API response for /api/admin/sales/overview
export interface SalesOverviewResponse {
  status: string;
  code: number;
  message: string;
  data: {
    summary: {
      total_sales: {
        amount: number;
        transaction_count: number;
        change_percent: number;
      };
      avg_order_value: {
        amount: number;
        change_percent: number;
      };
      commission_earned: {
        amount: number;
        pending_amount: number;
        change_percent: number;
      };
      completed_transactions: {
        count: number;
        change_percent: number;
      };
    };
    bonus_paid: number;
    sales_by_category: Array<{
      category: string;
      amount: number;
      percent: number;
    }>;
    leaderboard: any[];
    sales_reps: {
      total_sales_amount: number;
      total_bonus_amount: number;
      members: any[];
    };
    sales_managers: {
      total_sales_amount: number;
      total_bonus_amount: number;
      members: any[];
    };
  };
  timestamp: string;
}
export type OrderStatus = "Paid" | "Processing";
export type TimePeriod = "Day" | "Week" | "Month" | "Year";
export type TargetStatus = "Quarterly" | "Yearly" | "Monthly";
export type WithdrawalRequestStatus = "Pending" | "Paid";
export type TeamMemberStatus = "Active";

export interface SalesStat {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtitle: string;
  trendIcon?: string;
  trendData?: Array<{ value: number }>;
  changeColor: "green" | "red" | "orange";
}

export interface CategoryData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface LeaderboardEntry {
  name: string;
  total_achieved: number;
}

export interface SalesTrendData {
  month?: string;
  label?: string;
  value: number;
}

export type SalesTrendPeriod = "day" | "week" | "month" | "year";

export interface SalesTrendPoint {
  label: string;
  value: number;
}

export interface SalesTrendSummary {
  value: number;
  percent: number;
  label: string;
  direction: "up" | "down";
}

export interface SalesTrendChartConfig {
  min_value: number;
  max_value: number;
  months: string[];
  available_years: number[];
}

export interface SalesTrendResponse {
  status: string;
  code: number;
  message: string;
  data: {
    period: SalesTrendPeriod;
    year: number;
    data: SalesTrendPoint[];
    trend: SalesTrendSummary;
    chart_config: SalesTrendChartConfig;
  };
  timestamp: string;
}

export interface OrderRow {
  date: string;
  orderId: string;
  customerName: string;
  customerEmail?: string;
  customerInitial: string;
  salesValue: string;
  commission: string;
  status: OrderStatus;
}

export interface InfoCardData {
  title: string;
  value: string;
  subtitle?: string;
}

export interface TargetRow {
  createdDate: string;
  period: string;
  status: TargetStatus;
  teamMemberName: string;
  teamMemberRole: string;
  target: string;
  achieved: string;
  progress: number;
  percentage: string;
}

export interface WithdrawalRequestRow {
  refundDate: string;
  staffName: string;
  staffEmail: string;
  staffInitial: string;
  amount: string;
  notes: string;
  orderStatus: WithdrawalRequestStatus;
}

export interface TeamMemberRow {
  dateCreated: string;
  name: string;
  email: string;
  initial: string;
  role: string;
  createdBy: string;
  createdByInitial: string;
  status: TeamMemberStatus;
  location?: string;
  dateJoined?: string;
  lastActive?: string;
}

// API Types for Team Members
export interface TeamMemberCreatedBy {
  id: number;
  name: string;
  image_url: string | null;
}

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  department: string;
  position: string;
  status: string;
  joined_date: string;
  created_by: TeamMemberCreatedBy;
  roles: string[];
}

export interface TeamMembersResponse {
  status: string;
  code: number;
  message: string;
  data: {
    current_page: number;
    data: TeamMember[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  timestamp: string;
}

// Team Member Detail Types
export interface Permission {
  id: number;
  name: string;
  slug: string;
  module: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  pivot?: {
    role_id: number;
    permission_id: number;
    created_at: string;
    updated_at: string;
  };
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
  pivot?: {
    user_id: number;
    role_id: number;
    created_at: string;
    updated_at: string;
  };
  permissions?: Permission[];
}

export interface TeamMemberCreator {
  id: number;
  name: string;
  amount_spent: number;
  total_orders: number;
  permissions_list: string[];
  roles: Role[];
}

export interface TeamMemberDetailUser {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  department: string;
  position: string;
  status: string;
  created_at: string;
  created_by: number;
  amount_spent: number;
  total_orders: number;
  permissions_list: string[];
  creator: TeamMemberCreator;
  roles: Role[];
}

export interface TeamMemberSummary {
  active_targets: number;
  total_target: number;
  total_achieved: number;
  achievement_pct: number;
  total_withdrawals: number;
  approved_withdrawals_amount: number;
  pending_withdrawals_amount: number;
}

export interface TeamMemberTarget {
  id: number;
  title: string;
  description: string | null;
  sales_team_id: number | null;
  user_id: number;
  commission_type_id: number;
  target_amount: string;
  achieved_amount: string;
  period: string;
  start_date: string;
  end_date: string;
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  progress_percentage: number;
  team: any | null;
}

export interface TeamMemberSalesTrend {
  filter: string;
  data: any[];
}

export interface TeamMemberDetailResponse {
  status: string;
  code: number;
  message: string;
  data: {
    user: TeamMemberDetailUser;
    summary: TeamMemberSummary;
    sales_trend: TeamMemberSalesTrend;
    sales_by_category: any[];
    recent_orders: any[];
    targets: TeamMemberTarget[];
    withdrawals: any[];
  };
  timestamp: string;
}
