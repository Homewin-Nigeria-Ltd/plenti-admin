export type TicketType = "Complaint" | "Request" | "Enquiry" | "Suggestion";
export type TicketStatus = "Open" | "Closed" | "Overdue" | "Resolved";

export type Ticket = {
  id: string;
  createdDate: string;
  ticketId: string;
  ticketType: TicketType;
  createdBy: string;
  subject: string;
  status: TicketStatus;
  role: string;
  resolver: string;
  description: string;
};

export const mockTickets: Ticket[] = [
  {
    id: "1",
    createdDate: "Apr 12, 2023 | 09:32AM",
    ticketId: "#FAB-23012024-00091",
    ticketType: "Complaint",
    createdBy: "Emmanuel Adebayo",
    subject: "Delayed delivery for ORDO01 ",
    description: "My order was supposed to arrive ye...",
    status: "Open",
    role: "Support",
    resolver: "Emmanuel Adebayo ",
  },
  {
    id: "2",
    createdDate: "Apr 12, 2023 | 09:32AM",
    ticketId: "#FAB-23012024-00091",
    ticketType: "Request",
    createdBy: "John Doe",
    subject: "Delayed delivery for ORDO01 ",
    description: "My order was supposed to arrive ye...",
    status: "Closed",
    role: "Customer Support",
    resolver: "Emmanuel Adebayo",
  },
  {
    id: "3",
    createdDate: "Apr 12, 2023 | 09:32AM",
    ticketId: "#FAB-23012024-00091",
    ticketType: "Enquiry",
    createdBy: "Jane Doe",
    subject: "Delayed delivery for ORDO01 ",
    description: "My order was supposed to arrive ye...",
    status: "Overdue",
    role: "Admin",
    resolver: "Emmanuel Adebayo",
  },
  {
    id: "4",
    createdDate: "Apr 12, 2023 | 09:32AM",
    ticketId: "#FAB-23012024-00091",
    ticketType: "Suggestion",
    createdBy: "Emmanuel Adebayo",
    subject: "Delayed delivery for ORDO01 ",
    description: "My order was supposed to arrive ye...",
    status: "Resolved",
    role: "Support",
    resolver: "Emmanuel Adebayo",
  },
  {
    id: "5",
    createdDate: "Apr 12, 2023 | 09:32AM",
    ticketId: "#FAB-23012024-00091",
    ticketType: "Complaint",
    createdBy: "John Doe",
    subject: "Delayed delivery for ORDO01 ",
    description: "My order was supposed to arrive ye...",
    status: "Open",
    role: "Customer Support",
    resolver: "Emmanuel Adebayo",
  },
  {
    id: "6",
    createdDate: "Apr 12, 2023 | 09:32AM",
    ticketId: "#FAB-23012024-00091",
    ticketType: "Request",
    createdBy: "Jane Doe",
    subject: "Delayed delivery for ORDO01 ",
    description: "My order was supposed to arrive ye...",
    status: "Closed",
    role: "Admin",
    resolver: "Emmanuel Adebayo",
  },
  {
    id: "7",
    createdDate: "Apr 12, 2023 | 09:32AM",
    ticketId: "#FAB-23012024-00091",
    ticketType: "Enquiry",
    createdBy: "Emmanuel Adebayo",
    subject: "Delayed delivery for ORDO01 ",
    description: "My order was supposed to arrive ye...",
    status: "Overdue",
    role: "Support",
    resolver: "Emmanuel Adebayo",
  },
  {
    id: "8",
    createdDate: "Apr 12, 2023 | 09:32AM",
    ticketId: "#FAB-23012024-00091",
    ticketType: "Suggestion",
    createdBy: "John Doe",
    subject: "Delayed delivery for ORDO01 ",
    description: "My order was supposed to arrive ye...",
    status: "Resolved",
    role: "Customer Support",
    resolver: "Emmanuel Adebayo",
  },
  {
    id: "9",
    createdDate: "Apr 12, 2023 | 09:32AM",
    ticketId: "#FAB-23012024-00091",
    ticketType: "Complaint",
    createdBy: "Jane Doe",
    subject: "Delayed delivery for ORDO01 ",
    description: "My order was supposed to arrive ye...",
    status: "Open",
    role: "Admin",
    resolver: "Emmanuel Adebayo",
  },
];
