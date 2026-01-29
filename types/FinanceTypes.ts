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

export type FinanceState = {
  /** Refunds list */
  refunds: Refund[];
  refundPagination: RefundPagination | null;
  loadingRefunds: boolean;
  refundsError: string | null;

  /** Placeholder for overview/transaction data when APIs exist */
  // revenue?: RevenueOverview | null;
  // transactions?: Transaction[];
  // loadingRevenue?: boolean;
  // loadingTransactions?: boolean;

  fetchRefunds: (page?: number, pageSize?: number) => Promise<boolean>;
};
