/** Refund request / refund record – align with API when available */
export type RefundStatus =
  | "Approved"
  | "Processing"
  | "Rejected"
  | "pending"
  | "approved"
  | "rejected";

export type Refund = {
  id?: number | string;
  refundDate: string;
  refundId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number;
  orderAmount?: number;
  orderId?: string;
  transactionId?: string;
  paymentMethod?: string;
  paymentGateway?: string;
  orderStatus: string;
  orderStatusDescription?: string;
  status: RefundStatus;
  /** API may use snake_case; add as needed */
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

/** Pagination for refunds list */
export type RefundPagination = {
  page: number;
  pageSize: number;
  totalCount: number;
  /** Optional: last_page for compatibility */
  last_page?: number;
};

/** Finance summary metrics */
export type FinanceSummary = {
  total_revenue: string;
  pending_refunds: number;
  total_transactions: number;
  average_order_value: number;
};

/** Revenue trend data point */
export type RevenueTrend = {
  total: string;
  month: string;
};

/** Payment method distribution */
export type PaymentDistribution = {
  payment_method: string;
  total: string;
};

/** Transaction from finance overview */
export type Transaction = {
  id: number;
  transaction_id: string;
  user_id: number;
  amount: string;
  payment_method: string;
  status: string;
  reference: string;
  description: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    amount_spent: number;
    total_orders: number;
    avatar_url: string;
  };
};

/** Pagination link */
export type PaginationLink = {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
};

/** Transaction pagination */
export type TransactionPagination = {
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
};

/** Finance overview from API */
export type FinanceOverview = {
  summary: FinanceSummary;
  charts: {
    revenue_trend: RevenueTrend[];
    payment_distribution: PaymentDistribution[];
  };
  transactions: Transaction[];
  transactionPagination: TransactionPagination | null;
};

export type FinanceState = {
  /** Refunds list */
  refunds: Refund[];
  refundPagination: RefundPagination | null;
  loadingRefunds: boolean;
  refundsError: string | null;

  /** Finance overview data */
  overview: FinanceOverview | null;
  loadingOverview: boolean;
  overviewError: string | null;

  fetchRefunds: (page?: number, pageSize?: number) => Promise<boolean>;
  fetchFinanceOverview: (page?: number) => Promise<boolean>;
};
