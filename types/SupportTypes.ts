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
  body: string;
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

  fetchTickets: (page?: number, perPage?: number) => Promise<boolean>;
  fetchSingleTicket: (id: string | number) => Promise<boolean>;
  clearSingleTicket: () => void;
  fetchSupportStatistics: () => Promise<boolean>;

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
};
