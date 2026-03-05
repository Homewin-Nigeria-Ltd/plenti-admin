"use client";

import { useState } from "react";
import DataTable from "@/components/common/DataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format";

interface CommissionSummary {
  totalEarned: number;
  availableBalance: number;
  paidOut: number;
  percentageChange: number;
}

interface CommissionTransaction {
  id: string;
  date: string;
  action: string;
  amount: number;
  balance: number;
  status: "Successful" | "Cancelled" | "Inactive";
  type: "Credit" | "Debit";
}

function SummaryCard({
  label,
  amount,
  percentageChange,
}: {
  label: string;
  amount: number;
  percentageChange: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-white/70">{label}</p>
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold text-white">
          {formatCurrency(amount)}
        </span>
        <div className="flex flex-col items-center gap-1 justify-end">
          <span
            className={`gap-1 rounded-full px-2 py-1 text-xs font-medium ${
              percentageChange >= 0
                ? "bg-[#E7F6EC] text-[#12B76A]"
                : "bg-[#FFE4E8] text-[#D42620]"
            }`}
          >
            {percentageChange >= 0 ? "↑" : "↓"}
            {Math.abs(percentageChange)}
          </span>
          <span className="text-white text-[8px] font-bold">
            % vs last month
          </span>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Successful: "bg-[#E7F6EC] text-[#12B76A]",
    Cancelled: "bg-[#FFE4E8] text-[#D42620]",
    Inactive: "bg-[#E8EEFF] text-[#0B1E66]",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${styles[status] || styles.Inactive}`}
    >
      {status}
    </span>
  );
}

function TypeBadge({ type }: { type: "Credit" | "Debit" }) {
  const styles =
    type === "Credit"
      ? "bg-[#E7F6EC] text-[#12B76A]"
      : "bg-[#FFE4E8] text-[#D42620]";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${styles}`}
    >
      {type}
    </span>
  );
}

export default function MyCommissionsTab() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<CommissionSummary>({
    totalEarned: 245500,
    availableBalance: 120000,
    paidOut: 125500,
    percentageChange: -1.5,
  });

  const [transactions, setTransactions] = useState<CommissionTransaction[]>([
    {
      id: "1",
      date: "Apr 12, 2023 09:32AM",
      action: "Sales Target Incentives",
      amount: 300,
      balance: 1200,
      status: "Successful",
      type: "Credit",
    },
    {
      id: "2",
      date: "Apr 12, 2023 09:32AM",
      action: "Commercial Withdrawal",
      amount: 900,
      balance: 900,
      status: "Cancelled",
      type: "Debit",
    },
    {
      id: "3",
      date: "Apr 12, 2023 09:32AM",
      action: "Commercial Incentives",
      amount: 300,
      balance: 900,
      status: "Successful",
      type: "Debit",
    },
    {
      id: "4",
      date: "Apr 12, 2023 09:32AM",
      action: "Commercial Withdrawal",
      amount: 300,
      balance: 600,
      status: "Successful",
      type: "Debit",
    },
    {
      id: "5",
      date: "Apr 12, 2023 09:32AM",
      action: "Commercial Incentives",
      amount: 300,
      balance: 33900,
      status: "Successful",
      type: "Credit",
    },
    {
      id: "6",
      date: "Apr 12, 2023 09:32AM",
      action: "Commercial Withdrawal",
      amount: 300,
      balance: 33300,
      status: "Inactive",
      type: "Debit",
    },
    {
      id: "7",
      date: "Apr 12, 2023 09:32AM",
      action: "Commercial Incentives",
      amount: 300,
      balance: 33600,
      status: "Successful",
      type: "Credit",
    },
  ]);

  const PAGE_SIZE = 10;

  // Columns for DataTable
  const columns = [
    { key: "date", label: "Date" },
    { key: "action", label: "Actions" },
    { key: "amount", label: "Amount" },
    { key: "balance", label: "Balance" },
    { key: "status", label: "Status" },
    { key: "type", label: "Type" },
  ];

  // Map transactions to DataTable rows
  const rows = transactions.map((transaction) => ({
    date: transaction.date,
    action: transaction.action,
    amount: formatCurrency(transaction.amount),
    balance: formatCurrency(transaction.balance),
    status: <StatusBadge status={transaction.status} />,
    type: <TypeBadge type={transaction.type} />,
  }));

  const totalPages = Math.ceil(transactions.length / PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-6 rounded-xl bg-linear-to-r from-[#0B1E66] to-[#1a2d8f] p-8">
        <div className="flex items-start justify-between">
          <SummaryCard
            label="Total Earned"
            amount={summary.totalEarned}
            percentageChange={summary.percentageChange}
          />
          <div className="h-16 w-px bg-white/20"></div>
          <SummaryCard
            label="Available Balance"
            amount={summary.availableBalance}
            percentageChange={summary.percentageChange}
          />
          <div className="h-16 w-px bg-white/20"></div>
          <SummaryCard
            label="Paid Out"
            amount={summary.paidOut}
            percentageChange={summary.percentageChange}
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-xl bg-white">
        {loading ? (
          <div className="space-y-3 p-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : rows.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-sm text-[#667085]">
                No commission data available
              </p>
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            page={page}
            pageSize={PAGE_SIZE}
            total={transactions.length}
            pageCount={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
