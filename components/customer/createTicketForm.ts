/** API category slugs and display labels (POST admin/support/tickets) */
export const TICKET_CATEGORIES = [
  { value: "general", label: "General inquiry" },
  { value: "order", label: "Order-related issues" },
  { value: "payment", label: "Payment problems" },
  { value: "delivery", label: "Delivery/shipping issues" },
  { value: "product", label: "Product-related issues (quality, defects, etc.)" },
  { value: "account", label: "Account management issues" },
  { value: "technical", label: "Technical/app issues" },
  { value: "other", label: "Other issues" },
] as const;

export type TicketCategorySlug = (typeof TICKET_CATEGORIES)[number]["value"];

/** Priority: API expects lowercase (low, medium, high, urgent) */
export const TICKET_PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
] as const;

export type TicketPrioritySlug = (typeof TICKET_PRIORITIES)[number]["value"];

export type CreateTicketFormData = {
  customerName: string;
  customerId: number | null;
  category: TicketCategorySlug | "";
  assignTo: string;
  assignToId: number | null;
  priority: TicketPrioritySlug | "";
  orderId: string;
  refundId: string;
  subject: string;
  description: string;
  files: File[];
};

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
