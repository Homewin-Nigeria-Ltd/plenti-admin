/** Category options for the create-ticket form */
export type TicketCategory =
  | "Complaint"
  | "Request"
  | "Enquiry"
  | "Suggestion"
  | "Refund Request";

/** Priority options for the create-ticket form */
export type TicketPriority = "Low" | "Medium" | "High" | "Urgent";

export type CreateTicketFormData = {
  customerName: string;
  customerId: number | null;
  category: TicketCategory | "";
  assignTo: string;
  assignToId: number | null;
  priority: TicketPriority | "";
  orderId: string;
  refundId: string;
  subject: string;
  description: string;
  files: File[];
};

export const TICKET_CATEGORIES: TicketCategory[] = [
  "Complaint",
  "Request",
  "Enquiry",
  "Suggestion",
  "Refund Request",
];

export const TICKET_PRIORITIES: TicketPriority[] = [
  "Low",
  "Medium",
  "High",
  "Urgent",
];

export const initialCreateTicketFormData: CreateTicketFormData = {
  customerName: "",
  customerId: null,
  category: "",
  assignTo: "",
  assignToId: null,
  priority: "",
  orderId: "",
  refundId: "",
  subject: "",
  description: "",
  files: [],
};
