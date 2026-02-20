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
  trendIcon: string;
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
  value: number;
}

export interface SalesTrendData {
  month: string;
  value: number;
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
