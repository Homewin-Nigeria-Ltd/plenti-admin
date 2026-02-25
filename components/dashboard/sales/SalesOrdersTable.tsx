"use client";

import * as React from "react";
import DataTable from "@/components/common/DataTable";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type SalesOrderStatus = "Paid" | "Processing" | "Cancelled" | "Pending";

type SalesOrder = {
  date: string;
  time: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerInitial: string;
  salesValue: string;
  commission: string;
  status: SalesOrderStatus;
};

const SALES_ORDERS: SalesOrder[] = [
  {
    date: "Apr 12, 2023",
    time: "09:32AM",
    orderId: "#0001",
    customerName: "Muhammad Lawan",
    customerEmail: "thekdfisher@email.com",
    customerInitial: "M",
    salesValue: "₦2,300.00",
    commission: "₦230.00",
    status: "Paid",
  },
  {
    date: "Apr 12, 2023",
    time: "09:32AM",
    orderId: "#0001",
    customerName: "Rahma Rabiu",
    customerEmail: "thekdfisher@email.com",
    customerInitial: "R",
    salesValue: "₦2,300.00",
    commission: "₦230.00",
    status: "Processing",
  },
  {
    date: "Apr 12, 2023",
    time: "09:32AM",
    orderId: "#0001",
    customerName: "Minabo Dokubo",
    customerEmail: "thekdfisher@email.com",
    customerInitial: "M",
    salesValue: "₦2,300.00",
    commission: "₦230.00",
    status: "Cancelled",
  },
  {
    date: "Apr 12, 2023",
    time: "09:32AM",
    orderId: "#0001",
    customerName: "Obinna Okafor",
    customerEmail: "thekdfisher@email.com",
    customerInitial: "O",
    salesValue: "₦2,300.00",
    commission: "₦230.00",
    status: "Processing",
  },
  {
    date: "Apr 12, 2023",
    time: "09:32AM",
    orderId: "#0001",
    customerName: "Chijioke Eze",
    customerEmail: "thekdfisher@email.com",
    customerInitial: "C",
    salesValue: "₦2,300.00",
    commission: "₦230.00",
    status: "Paid",
  },
  {
    date: "Apr 12, 2023",
    time: "09:32AM",
    orderId: "#0001",
    customerName: "Piriye Idiamiebi",
    customerEmail: "thekdfisher@email.com",
    customerInitial: "P",
    salesValue: "₦2,300.00",
    commission: "₦230.00",
    status: "Pending",
  },
];

const PAGE_SIZE = 6;

function StatusPill({ status }: { status: SalesOrderStatus }) {
  const className =
    status === "Paid"
      ? "bg-[#E7F6EC] text-[#027A48]"
      : status === "Processing"
      ? "bg-[#FFF4E6] text-[#FF9500]"
      : status === "Cancelled"
      ? "bg-[#FFE9E7] text-[#FF392B]"
      : "bg-[#EAECF0] text-[#344054]";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}
    >
      {status}
    </span>
  );
}

export default function SalesOrdersTable() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(1);

  const filteredOrders = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return SALES_ORDERS;

    return SALES_ORDERS.filter(
      (order) =>
        order.customerName.toLowerCase().includes(q) ||
        order.orderId.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));

  React.useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const pageRows = React.useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, page]);

  const columns = [
    { key: "orderDate", label: "Order Date" },
    { key: "orderId", label: "Order ID" },
    { key: "customerName", label: "Customer Name" },
    { key: "salesValue", label: "Sales Value" },
    { key: "commission", label: "Commission" },
    { key: "status", label: "Status" },
  ];

  const rows = pageRows.map((order) => ({
    orderDate: (
      <span className="whitespace-nowrap text-sm text-[#344054]">
        {order.date}
        <span className="px-2 text-[#D0D5DD]">|</span>
        {order.time}
      </span>
    ),
    orderId: <span className="text-sm text-[#101928]">{order.orderId}</span>,
    customerName: (
      <div className="flex items-center gap-3">
        <Avatar className="size-8 bg-[#0B1E66]">
          <AvatarFallback className="bg-[#0B1E66] text-xs font-semibold text-white">
            {order.customerInitial}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium text-[#101928]">
            {order.customerName}
          </p>
          <p className="text-xs text-[#667085]">{order.customerEmail}</p>
        </div>
      </div>
    ),
    salesValue: (
      <span className="text-sm text-[#101928]">{order.salesValue}</span>
    ),
    commission: (
      <span className="text-sm text-[#101928]">{order.commission}</span>
    ),
    status: <StatusPill status={order.status} />,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-lg border border-[#EAECF0] px-3 py-2">
        <Search className="size-4 text-[#98A2B3]" />
        <Input
          className="h-auto border-0 p-0 text-sm placeholder:text-[#667085] shadow-none focus-visible:ring-0"
          placeholder="Search"
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            setPage(1);
          }}
        />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        page={page}
        pageCount={pageCount}
        pageSize={PAGE_SIZE}
        total={filteredOrders.length}
        onPageChange={setPage}
        className="border border-[#EEF1F6]"
      />
    </div>
  );
}
