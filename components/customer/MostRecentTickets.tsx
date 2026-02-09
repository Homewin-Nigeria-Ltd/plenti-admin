"use client";

import * as React from "react";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { TicketDetailsModal } from "./TicketDetailsModal";
import { useSupportStore } from "@/store/useSupportStore";
import type { SupportTicketApi, TicketStatusApi } from "@/types/SupportTypes";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatCategory(category: string) {
  return (
    category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, " ")
  );
}

const STATUS_LABELS: Record<TicketStatusApi, string> = {
  open: "Open",
  in_progress: "In Progress",
  waiting_user: "Waiting User",
  resolved: "Resolved",
  closed: "Closed",
};

const StatusBadge = ({ status }: { status: TicketStatusApi }) => {
  const label = STATUS_LABELS[status] ?? status;
  const styles: Record<TicketStatusApi, string> = {
    open: "bg-blue-100 text-blue-700",
    in_progress: "bg-amber-100 text-amber-700",
    waiting_user: "bg-orange-100 text-orange-700",
    resolved: "bg-green-200 text-green-800",
    closed: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        styles[status] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {label}
    </span>
  );
};

export default function MostRecentTickets() {
  const { tickets, loadingTickets, ticketsError, fetchTickets, pagination } =
    useSupportStore();
  const [selectedTicketId, setSelectedTicketId] = React.useState<number | null>(
    null
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);

  const perPage = pagination?.per_page ?? 10;

  React.useEffect(() => {
    fetchTickets(1, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    { key: "createdDate", label: "Created Date" },
    { key: "ticketId", label: "Ticket ID" },
    { key: "category", label: "Category" },
    { key: "createdBy", label: "Created By" },
    { key: "subject", label: "Subject" },
    { key: "status", label: "Status" },
    { key: "resolver", label: "Resolver" },
  ];

  const rows = tickets.map((ticket: SupportTicketApi) => ({
    id: ticket.id,
    createdDate: (
      <span className="text-[#101828] text-sm">
        {formatDate(ticket.created_at)}
      </span>
    ),
    ticketId: (
      <span className="text-[#101828] font-medium text-sm">
        {ticket.ticket_number}
      </span>
    ),
    category: (
      <span className="text-[#101828] text-sm">
        {formatCategory(ticket.category)}
      </span>
    ),
    createdBy: (
      <span className="text-[#101828] font-medium text-sm">
        {ticket.user?.name ?? "—"}
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
        <span className="text-[#101828]">
          {ticket.assigned_admin?.name ?? "—"}
        </span>
      </p>
    ),
  }));

  return (
    <div className="bg-white rounded-xl border border-[#EEF1F6] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[#0B1E66] text-lg font-semibold">
          Most Recent Tickets
        </h3>
        {/* <Button className="bg-[#1F3A78] hover:bg-[#1F3A78]/90 text-white h-9 px-4">
          View All
        </Button> */}
      </div>

      {loadingTickets ? (
        <div className="space-y-3 py-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-[#EEF1F6] rounded animate-pulse" />
          ))}
        </div>
      ) : ticketsError ? (
        <p className="text-[#D42620] text-sm py-4">{ticketsError}</p>
      ) : tickets.length === 0 ? (
        <p className="text-[#667085] text-sm py-4">No tickets yet</p>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          page={pagination?.current_page ?? 1}
          pageCount={pagination?.last_page ?? 1}
          total={pagination?.total ?? 0}
          pageSize={perPage}
          onPageChange={(page) => fetchTickets(page, perPage)}
          onRowClick={(row) => {
            const ticket = tickets.find((t) => t.id === row.id);
            if (ticket) {
              setSelectedTicketId(ticket.id);
              setIsDetailsModalOpen(true);
            }
          }}
        />
      )}

      <TicketDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedTicketId(null);
        }}
        ticketId={selectedTicketId ?? undefined}
      />
    </div>
  );
}
