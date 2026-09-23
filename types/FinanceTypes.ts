/** Refund request / refund record – align with API when available */
export type RefundStatus =
  | "Approved"
  | "Processing"
  | "Rejected"
  | "pending"
  | "approved"
  | "rejected"
  | (string & {});

export type RefundFilter =
  | "all"
  | "awaiting-approval"
  | "awaiting-processing"
  | "rejected";

export type RefundMetrics = {
  awaiting_approval: number;
  awaiting_processing: number;
  approved: number;
  rejected: number;
  total: number;
};

export type Refund = {
  refundId: number | string;
  orderId?: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: string;
  reason?: string;
  requestedAt?: string;
};

export type RefundDetail = {
  id: number | string;
  order_id?: number | string;
  order_number?: string;
  customer_name?: string;
  customer_email?: string;
  amount: number;
  status: string;
  reason?: string;
  created_at?: string;
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
  percentage_change?: number;
  trend?: "up" | "down";
};

/** Revenue trend data point */
export type RevenueTrend = {
  label: string;
  value: number;
};

/** Payment method distribution */
export type PaymentDistribution = {
  method: string;
  amount: number;
  percentage?: number;
};

/** Transaction row from GET /api/admin/finance/transactions */
export type FinanceTransaction = {
  orderDate: string;
  transactionId: string;
  customerName: string;
  customerEmail: string;
  customerInitials?: string;
  amount: number;
  paymentMethod: string;
  orderStatus: string;
};

export type FinanceTransactionPagination = {
  page: number;
  pageSize: number;
  totalCount: number;
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
  refundMetrics: RefundMetrics | null;
  loadingRefundMetrics: boolean;
  selectedRefundDetail: RefundDetail | null;
  loadingRefundDetail: boolean;
  refundActionLoading: boolean;

  /** Finance overview data */
  overview: FinanceOverview | null;
  loadingOverview: boolean;
  overviewError: string | null;

  /** Finance transactions list */
  financeTransactions: FinanceTransaction[];
  financeTransactionPagination: FinanceTransactionPagination | null;
  loadingTransactions: boolean;
  transactionsError: string | null;
  exportingTransactions: boolean;

  fetchRefunds: (
    page?: number,
    pageSize?: number,
    filter?: RefundFilter
  ) => Promise<boolean>;
  fetchRefundMetrics: () => Promise<boolean>;
  fetchRefundDetail: (id: number | string) => Promise<RefundDetail | null>;
  approveRefund: (id: number | string) => Promise<boolean>;
  rejectRefund: (id: number | string, reason: string) => Promise<boolean>;
  markRefundProcessed: (id: number | string) => Promise<boolean>;
  fetchFinanceOverview: (
    filter?: "month" | "week" | "year"
  ) => Promise<boolean>;
  fetchTransactions: (page?: number, pageSize?: number) => Promise<boolean>;
  exportTransactions: () => Promise<boolean>;
};
