"use client";

import * as React from "react";
import DataTable from "@/components/common/DataTable";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { useFinanceStore } from "@/store/useFinanceStore";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

function formatOrderDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getInitials(name?: string | null) {
  return (name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function statusBadgeClass(status?: string | null) {
  const normalized = (status ?? "").trim().toLowerCase();
  if (normalized === "successful" || normalized === "success") {
    return "bg-green-100 text-green-700";
  }
  if (normalized === "pending") {
    return "bg-amber-100 text-amber-700";
  }
  if (normalized === "cancelled" || normalized === "canceled") {
    return "bg-red-100 text-red-700";
  }
  if (normalized === "processing") {
    return "bg-orange-100 text-orange-700";
  }
  return "bg-gray-100 text-gray-700";
}

export function FinanceTransactionTable() {
  const {
    financeTransactions,
    financeTransactionPagination,
    loadingTransactions,
    fetchTransactions,
    exportTransactions,
    exportingTransactions,
  } = useFinanceStore();

  const [page, setPage] = React.useState(1);
  const pageSize = financeTransactionPagination?.pageSize || 10;

  React.useEffect(() => {
    fetchTransactions(page, 10);
  }, [page, fetchTransactions]);

  const handleExport = async () => {
    const ok = await exportTransactions();
    if (ok) {
      toast.success("Transactions exported");
      return;
    }
    toast.error("Failed to export transactions");
  };

  const columns = [
    { key: "orderDate", label: "Order Date" },
    { key: "transactionId", label: "Transaction ID" },
    { key: "customer", label: "Customer Name" },
    { key: "amount", label: "Amount" },
    { key: "paymentMethod", label: "Payment Method" },
    { key: "status", label: "Order Status" },
  ];

  const rows = financeTransactions.map((transaction) => ({
    id: transaction.transactionId,
    orderDate: (
      <span className="text-[#101828] text-sm">
        {formatOrderDate(transaction.orderDate)}
      </span>
    ),
    transactionId: (
      <span className="text-[#101828] font-medium text-sm">
        {transaction.transactionId}
      </span>
    ),
    customer: (
      <div className="flex items-center gap-3">
        <Avatar className="size-10">
          <AvatarFallback className="bg-[#0B1E66] text-white text-sm font-semibold">
            {transaction.customerInitials ||
              getInitials(transaction.customerName)}
          </AvatarFallback>
        </Avatar>
        <div className="grid">
          <span className="text-[#101828] font-medium text-sm">
            {transaction.customerName}
          </span>
          <span className="text-[#667085] text-sm">
            {transaction.customerEmail}
          </span>
        </div>
      </div>
    ),
    amount: (
      <span className="text-[#101828] text-sm font-medium">
        {formatCurrency(Number(transaction.amount) || 0, {
          minimumFractionDigits: 2,
        })}
      </span>
    ),
    paymentMethod: (
      <span className="text-[#101828] text-sm font-medium">
        {transaction.paymentMethod}
      </span>
    ),
    status: (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadgeClass(
          transaction.orderStatus
        )}`}
      >
        {transaction.orderStatus || "-"}
      </span>
    ),
  }));

  const total = financeTransactionPagination?.totalCount ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="bg-white rounded-xl border border-[#EEF1F6] p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[#0B1E66] font-semibold text-base">Transactions</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={exportingTransactions}
        >
          {exportingTransactions ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
          Export CSV
        </Button>
      </div>

      {loadingTransactions && financeTransactions.length === 0 ? (
        <p className="text-center text-[#667085] py-8">Loading transactions…</p>
      ) : financeTransactions.length === 0 ? (
        <p className="text-center text-[#667085] py-8">
          No transactions available
        </p>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          page={financeTransactionPagination?.page || page}
          pageSize={pageSize}
          total={total}
          pageCount={pageCount}
          onPageChange={(nextPage) => setPage(nextPage)}
        />
      )}
    </div>
  );
}
