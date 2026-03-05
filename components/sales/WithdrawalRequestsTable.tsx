"use client";

import { useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReviewWithdrawalModal } from "./ReviewWithdrawalModal";
import { useWithdrawalsStore } from "@/store/useWithdrawalsStore";
import DataTable from "@/components/common/DataTable";
import { formatCurrency } from "@/lib/format";

const PAGE_SIZE = 10;

function StatusPill({ status }: { status: "Pending" | "Paid" }) {
  const style =
    status === "Pending"
      ? "bg-[#FFF4E6] text-[#FF9500]"
      : "bg-[#E7F6EC] text-[#12B76A]";
  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${style}`}
    >
      {status}
    </span>
  );
}

function WithdrawalRequestsTable() {
  const [page, setPage] = useState(1);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);
  const { withdrawals, loading, pagination, fetchWithdrawals } =
    useWithdrawalsStore();

  // Fetch withdrawals when page changes
  useEffect(() => {
    fetchWithdrawals(page, PAGE_SIZE);
  }, [page]);

  // Columns for DataTable
  const columns = [
    { key: "approved_at", label: "Refund Date" },
    { key: "user", label: "Staff Name" },
    { key: "amount", label: "Amount" },
    { key: "description", label: "Notes" },
    { key: "status", label: "Order Status" },
    { key: "actions", label: "Actions" },
  ];

  // Map API data to DataTable rows
  const rows = withdrawals.map((w) => ({
    approved_at: w.approved_at ? new Date(w.approved_at).toLocaleString() : "-",
    user: (
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarFallback className="bg-[#0B1E66] text-xs font-bold text-white">
            {w.user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[#101928]">
            {w.user.name}
          </span>
          <span className="text-xs text-[#667085]">{w.user.email}</span>
        </div>
      </div>
    ),
    amount: formatCurrency(parseFloat(w.amount)),
    description: w.description,
    status: (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${w.status === "approved" ? "bg-[#E7F6EC] text-[#12B76A]" : "bg-[#FFF4E6] text-[#FF9500]"} capitalize`}
      >
        {w.status}
      </span>
    ),
    actions: w.status === "pending" && (
      <button
        onClick={() => {
          setSelectedWithdrawal(w);
          setIsReviewModalOpen(true);
        }}
        className="rounded-lg bg-[#EEF1F6] px-4 py-1.5 text-xs font-semibold text-[#0B1E66] hover:bg-[#E6EAF2]"
      >
        Review
      </button>
    ),
  }));

  return (
    <div className="rounded-xl bg-white">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="size-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#0B1E66]"></div>
            </div>
            <p className="text-sm text-gray-500">
              Loading withdrawal requests...
            </p>
          </div>
        </div>
      ) : rows.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              No withdrawal requests found
            </p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          page={page}
          pageSize={PAGE_SIZE}
          total={pagination?.total || 0}
          pageCount={pagination ? pagination.last_page : 1}
          onPageChange={setPage}
        />
      )}
      <ReviewWithdrawalModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedWithdrawal(null);
        }}
        withdrawal={selectedWithdrawal}
      />
    </div>
  );
}

export default WithdrawalRequestsTable;
