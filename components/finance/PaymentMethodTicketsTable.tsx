"use client";

import * as React from "react";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { mockTickets } from "@/data/tickets";
import type { TicketStatus } from "@/data/tickets";

const StatusBadge = ({ status }: { status: TicketStatus }) => {
  const styles: Record<TicketStatus, string> = {
    Open: "bg-blue-100 text-blue-700",
    Closed: "bg-green-100 text-green-700",
    Overdue: "bg-red-100 text-red-700",
    Resolved: "bg-emerald-100 text-emerald-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        styles[status] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

export function PaymentMethodTicketsTable() {
  const columns = [
    { key: "createdDate", label: "Created Date" },
    { key: "ticketId", label: "Ticket ID" },
    { key: "ticketType", label: "Ticket Type" },
    { key: "createdBy", label: "Created By" },
    { key: "subject", label: "Subject" },
    { key: "status", label: "Status" },
    { key: "resolver", label: "Resolver" },
  ];

  const rows = mockTickets.map((ticket) => ({
    id: ticket.id,
    createdDate: (
      <span className="text-[#101828] text-sm">{ticket.createdDate}</span>
    ),
    ticketId: (
      <span className="text-[#101828] font-medium text-sm">
        {ticket.ticketId}
      </span>
    ),
    ticketType: (
      <span className="text-[#101828] text-sm">{ticket.ticketType}</span>
    ),
    createdBy: (
      <span className="text-[#101828] font-medium text-sm">
        {ticket.createdBy}
      </span>
    ),
    subject: (
      <p className="text-[#667085] text-sm max-w-[300px] truncate grid">
        <span className="text-[#101828]">{ticket.subject}</span>
        <span>{ticket.description}</span>
      </p>
    ),
    status: <StatusBadge status={ticket.status} />,
    resolver: (
      <p className="text-[#667085] text-sm grid">
        <span className="text-[#101828]">{ticket.resolver}</span>
        <span>{ticket.role}</span>
      </p>
    ),
  }));

  return (
    <div className="bg-white rounded-xl border border-[#EEF1F6] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[#0B1E66] text-lg font-semibold">
          Most Recent Ticket
        </h3>
        <Button className="bg-[#1F3A78] hover:bg-[#1F3A78]/90 text-white h-9 px-4">
          View All
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        page={1}
        pageSize={10}
        total={rows.length}
        pageCount={1}
      />
    </div>
  );
}
