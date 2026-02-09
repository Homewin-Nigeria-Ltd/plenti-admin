"use client";

import * as React from "react";
import DataTable from "@/components/common/DataTable";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/format";

type TransactionStatus = "Successful" | "Pending" | "Cancelled" | "Processing";

type Transaction = {
  id: string;
  orderDate: string;
  transactionId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  paymentMethod: string;
  status: TransactionStatus;
};

const mockTransactions: Transaction[] = [
  {
    id: "1",
    orderDate: "Apr 12, 2023 | 09:32AM",
    transactionId: "#0001",
    customerName: "Muhammad Lawan",
    customerEmail: "thekdfisher@email.com",
    amount: 2300,
    paymentMethod: "Transfer",
    status: "Successful",
  },
  {
    id: "2",
    orderDate: "Apr 12, 2023 | 09:32AM",
    transactionId: "#0001",
    customerName: "Rahma Rabiu",
    customerEmail: "thekdfisher@email.com",
    amount: 2300,
    paymentMethod: "Card",
    status: "Pending",
  },
  {
    id: "3",
    orderDate: "Apr 12, 2023 | 09:32AM",
    transactionId: "#0001",
    customerName: "Minabo Dokubo",
    customerEmail: "thekdfisher@email.com",
    amount: 2300,
    paymentMethod: "Motobills Wallet",
    status: "Cancelled",
  },
  {
    id: "4",
    orderDate: "Apr 12, 2023 | 09:32AM",
    transactionId: "#0001",
    customerName: "Obinna Okafor",
    customerEmail: "thekdfisher@email.com",
    amount: 2300,
    paymentMethod: "Card",
    status: "Processing",
  },
  {
    id: "5",
    orderDate: "Apr 12, 2023 | 09:32AM",
    transactionId: "#0001",
    customerName: "Chijioke Eze",
    customerEmail: "thekdfisher@email.com",
    amount: 2300,
    paymentMethod: "Wallet",
    status: "Pending",
  },
  {
    id: "6",
    orderDate: "Apr 12, 2023 | 09:32AM",
    transactionId: "#0002",
    customerName: "Amina Yusuf",
    customerEmail: "amina@email.com",
    amount: 4800,
    paymentMethod: "Transfer",
    status: "Successful",
  },
  {
    id: "7",
    orderDate: "Apr 12, 2023 | 09:32AM",
    transactionId: "#0003",
    customerName: "Samuel Okoro",
    customerEmail: "samuel@email.com",
    amount: 1500,
    paymentMethod: "Card",
    status: "Pending",
  },
  {
    id: "8",
    orderDate: "Apr 12, 2023 | 09:32AM",
    transactionId: "#0004",
    customerName: "Ifeoma Nwosu",
    customerEmail: "ifeoma@email.com",
    amount: 8750,
    paymentMethod: "Motobills Wallet",
    status: "Processing",
  },
  {
    id: "9",
    orderDate: "Apr 12, 2023 | 09:32AM",
    transactionId: "#0005",
    customerName: "Tunde Adebayo",
    customerEmail: "tunde@email.com",
    amount: 3200,
    paymentMethod: "Transfer",
    status: "Cancelled",
  },
  {
    id: "10",
    orderDate: "Apr 12, 2023 | 09:32AM",
    transactionId: "#0006",
    customerName: "Grace Ibe",
    customerEmail: "grace@email.com",
    amount: 2300,
    paymentMethod: "Card",
    status: "Successful",
  },
  {
    id: "11",
    orderDate: "Apr 12, 2023 | 09:32AM",
    transactionId: "#0007",
    customerName: "Chika Nnamdi",
    customerEmail: "chika@email.com",
    amount: 5400,
    paymentMethod: "Wallet",
    status: "Pending",
  },
  {
    id: "12",
    orderDate: "Apr 12, 2023 | 09:32AM",
    transactionId: "#0008",
    customerName: "Femi Bello",
    customerEmail: "femi@email.com",
    amount: 10200,
    paymentMethod: "Transfer",
    status: "Successful",
  },
];

const StatusBadge = ({ status }: { status: TransactionStatus }) => {
  const styles: Record<TransactionStatus, string> = {
    Successful: "bg-green-100 text-green-700",
    Pending: "bg-amber-100 text-amber-700",
    Cancelled: "bg-red-100 text-red-700",
    Processing: "bg-orange-100 text-orange-700",
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

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export function FinanceTransactionTable() {
  const [page, setPage] = React.useState(1);
  const pageSize = 5;
  const total = mockTransactions.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  const pagedTransactions = mockTransactions.slice(
    startIndex,
    startIndex + pageSize
  );

  const columns = [
    { key: "orderDate", label: "Order Date" },
    { key: "transactionId", label: "Transaction ID" },
    { key: "customer", label: "Customer Name" },
    { key: "amount", label: "Amount" },
    { key: "paymentMethod", label: "Payment Method" },
    { key: "status", label: "Order Status" },
  ];

  const rows = pagedTransactions.map((transaction) => ({
    id: transaction.id,
    orderDate: (
      <span className="text-[#101828] text-sm">{transaction.orderDate}</span>
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
            {getInitials(transaction.customerName)}
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
        {formatCurrency(transaction.amount, { minimumFractionDigits: 2 })}
      </span>
    ),
    paymentMethod: (
      <span className="text-[#101828] text-sm font-medium">
        {transaction.paymentMethod}
      </span>
    ),
    status: <StatusBadge status={transaction.status} />,
  }));

  return (
    <div className="bg-white rounded-xl border border-[#EEF1F6] p-6">
      <DataTable
        columns={columns}
        rows={rows}
        page={page}
        pageSize={pageSize}
        total={total}
        pageCount={pageCount}
        onPageChange={(nextPage) => setPage(nextPage)}
      />
    </div>
  );
}
