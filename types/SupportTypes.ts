/** Support ticket type / category (legacy UI) */
export type TicketType = "Complaint" | "Request" | "Enquiry" | "Suggestion";

/** Support ticket status (legacy UI) */
export type TicketStatus = "Open" | "Closed" | "Overdue" | "Resolved";

/** API status from GET admin/support/tickets */
export type TicketStatusApi =
  | "open"
  | "in_progress"
  | "waiting_user"
  | "resolved"
  | "closed";

/** User summary nested in ticket response */
export type SupportTicketUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  amount_spent?: number;
  total_orders?: number;
  avatar_url: string | null;
};

/** Single ticket from GET admin/support/tickets (data.tickets[]) – analytics in response is ignored; use statistics endpoint for stats */
export type SupportTicketApi = {
  id: number;
  user_id: number;
  ticket_number: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: TicketStatusApi;
  assigned_at: string | null;
  assigned_to: number | null;
  first_response_at: string | null;
  resolved_at: string | null;
  closed_at: string | null;
  response_count: number;
  satisfaction_rating: number | null;
  satisfaction_comment: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: SupportTicketUser;
  assigned_admin: SupportTicketUser | null;
};

/** Reply from GET admin/support/tickets/:id (data.replies[]) */
export type SupportTicketReply = {
  id: number;
  ticket_id: number;
  user_id?: number;
  message: string;
  is_staff?: boolean;
  created_at: string;
  updated_at?: string;
  user?: SupportTicketUser;
  [key: string]: unknown;
};

/** Attachment from GET admin/support/tickets/:id (data.attachments[]) */
export type SupportTicketAttachment = {
  id: number;
  file_name?: string;
  url?: string;
  size?: number;
  created_at?: string;
  [key: string]: unknown;
};

/** Single ticket detail from GET admin/support/tickets/:id (includes replies and attachments) */
export type SupportTicketDetail = SupportTicketApi & {
  replies: SupportTicketReply[];
  attachments: SupportTicketAttachment[];
};

/** Pagination from GET admin/support/tickets (data.pagination) */
export type SupportTicketsPagination = {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
};

/** Support ticket – legacy shape (kept for single-ticket detail if needed) */
export type SupportTicket = {
  id: string;
  createdDate: string;
  ticketId: string;
  ticketType: TicketType;
  createdBy: string;
  subject: string;
  description: string;
  status: TicketStatus;
  role: string;
  resolver: string;
};

/** Response from GET {{base_url}}/admin/support/tickets/statistics */
export type SupportStatistics = {
  total_tickets: number;
  open_tickets: number;
  in_progress_tickets: number;
  resolved_tickets: number;
  closed_tickets: number;
  high_priority_count: number;
  avg_resolution_time_hours: number;
  avg_satisfaction_rating: number;
  by_category: Record<string, number>;
  by_priority: Record<string, number>;
  by_status: Record<string, number>;
  response_rate_percentage: number;
};

/** TAT breakdown from GET .../support/tickets/statistics/resolution */
export type ResolutionTatBreakdown = {
  within_tat: number;
  exceeded_tat: number;
  within_tat_percentage: number;
  exceeded_tat_percentage: number;
  tat_hours: number;
};

/** Response from GET .../support/tickets/statistics/resolution?period=weekly|monthly|yearly */
export type ResolutionStatistics = {
  period: string;
  response_rate_percentage: number;
  tat_breakdown: ResolutionTatBreakdown;
};

export type ResolutionPeriod = "weekly" | "monthly" | "yearly";

/** Response from GET .../support/tickets/statistics/categories?period= */
export type CategoryStatistics = {
  period: string;
  by_category: Record<string, number>;
};

export type SupportState = {
  /** List from GET admin/support/tickets – only data.tickets and data.pagination are used; analytics in response is ignored */
  tickets: SupportTicketApi[];
  pagination: SupportTicketsPagination | null;
  loadingTickets: boolean;
  ticketsError: string | null;

  /** Single ticket from GET admin/support/tickets/:id (detail view) */
  singleTicket: SupportTicketDetail | null;
  loadingSingleTicket: boolean;
  singleTicketError: string | null;

  /** Statistics from GET admin/support/tickets/statistics only (never from list response analytics) */
  statistics: SupportStatistics | null;
  loadingStatistics: boolean;
  statisticsError: string | null;

  /** Resolution statistics from GET .../support/tickets/statistics/resolution?period= */
  resolutionStatistics: ResolutionStatistics | null;
  loadingResolutionStatistics: boolean;
  resolutionStatisticsError: string | null;

  /** Category statistics from GET .../support/tickets/statistics/categories?period= */
  categoryStatistics: CategoryStatistics | null;
  loadingCategoryStatistics: boolean;
  categoryStatisticsError: string | null;

  fetchTickets: (page?: number, perPage?: number) => Promise<boolean>;
  fetchSingleTicket: (id: string | number) => Promise<boolean>;
  clearSingleTicket: () => void;
  fetchSupportStatistics: () => Promise<boolean>;
  fetchResolutionStatistics: (period?: ResolutionPeriod) => Promise<boolean>;
  fetchCategoryStatistics: (period?: ResolutionPeriod) => Promise<boolean>;

  /** PATCH admin/support/tickets/:id/priority */
  updatingPriority: boolean;
  updateTicketPriority: (
    ticketId: string | number,
    priority: string
  ) => Promise<boolean>;

  /** PATCH admin/support/tickets/:id/status */
  updatingStatus: boolean;
  updateTicketStatus: (
    ticketId: string | number,
    status: string
  ) => Promise<boolean>;

  /** POST admin/support/tickets/:id/reply */
  addingReply: boolean;
  addTicketReply: (
    ticketId: string | number,
    message: string
  ) => Promise<boolean>;

  /** POST admin/support/tickets (create ticket) */
  creatingTicket: boolean;
  createTicket: (payload: CreateTicketRequest) => Promise<CreateTicketResult>;
};

/** Body for POST admin/support/tickets */
export type CreateTicketRequest = {
  user_id: number;
  category: string;
  subject: string;
  description: string;
  assigned_to: number;
  priority: string;
  order_id?: string | null;
  refund_id?: string | null;
};

export type CreateTicketResult =
  | { ok: true; data: unknown }
  | { ok: false; message: string };
