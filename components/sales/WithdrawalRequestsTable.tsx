"use client";

import { useMemo, useState } from "react";
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
import { withdrawalRequestsData } from "@/data/sales";
import { ReviewWithdrawalModal } from "./ReviewWithdrawalModal";
import type { WithdrawalRequestRow } from "@/types/sales";

const PAGE_SIZE = 2;

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

export default function WithdrawalRequestsTable() {
  const [page, setPage] = useState(1);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] =
    useState<WithdrawalRequestRow | null>(null);

  const pageCount = Math.max(
    1,
    Math.ceil(withdrawalRequestsData.length / PAGE_SIZE)
  );
  const canPrev = page > 1;
  const canNext = page < pageCount;

  const rows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return withdrawalRequestsData.slice(start, start + PAGE_SIZE);
  }, [page]);

  return (
    <div className="rounded-xl bg-white">
      <Table className="min-w-225">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs font-medium text-[#667085]">
              Refund Date
            </TableHead>
            <TableHead className="text-xs font-medium text-[#667085]">
              Staff Name
            </TableHead>
            <TableHead className="text-xs font-medium text-[#667085]">
              Amount
            </TableHead>
            <TableHead className="text-xs font-medium text-[#667085]">
              Notes
            </TableHead>
            <TableHead className="text-xs font-medium text-[#667085]">
              Order Status
            </TableHead>
            <TableHead className="text-xs font-medium text-[#667085]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={`${row.staffName}-${index}`}
              className="odd:bg-[#F9FAFB]"
            >
              <TableCell className="text-sm text-[#475467]">
                {row.refundDate}
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-[#0B1E66] text-xs font-bold text-white">
                      {row.staffInitial}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#101928]">
                      {row.staffName}
                    </span>
                    <span className="text-xs text-[#667085]">
                      {row.staffEmail}
                    </span>
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-sm font-medium text-[#101928]">
                {row.amount}
              </TableCell>
              <TableCell className="text-sm text-[#101928]">
                {row.notes}
              </TableCell>
              <TableCell>
                <StatusPill status={row.orderStatus} />
              </TableCell>
              <TableCell>
                <button
                  onClick={() => {
                    setSelectedWithdrawal(row);
                    setIsReviewModalOpen(true);
                  }}
                  className="rounded-lg bg-[#EEF1F6] px-4 py-1.5 text-xs font-semibold text-[#0B1E66] hover:bg-[#E6EAF2]"
                >
                  Review
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between px-5 py-4">
        <p className="text-xs text-[#667085]">
          Page {page} of {pageCount}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => canPrev && setPage(page - 1)}
            disabled={!canPrev}
            className="flex size-8 items-center justify-center rounded-full border border-[#0B1E66] text-[#0B1E66] disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>

          {Array.from({ length: pageCount }, (_, idx) => idx + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`flex size-8 items-center justify-center rounded-full text-sm ${
                  pageNumber === page
                    ? "border border-[#0B1E66] text-[#0B1E66]"
                    : "text-[#98A2B3]"
                }`}
              >
                {pageNumber}
              </button>
            )
          )}

          <button
            onClick={() => canNext && setPage(page + 1)}
            disabled={!canNext}
            className="flex size-8 items-center justify-center rounded-full border border-[#0B1E66] text-[#0B1E66] disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => canPrev && setPage(page - 1)}
            disabled={!canPrev}
            className="rounded-xl border border-[#D0D5DD] px-4 py-2 text-sm text-[#667085] disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => canNext && setPage(page + 1)}
            disabled={!canNext}
            className="rounded-xl border border-[#D0D5DD] px-4 py-2 text-sm text-[#667085] disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

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
