"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";
import type { DashboardRecentOrder } from "@/types/DashboardTypes";

const statusClass = (status: string) => {
  const s = (status ?? "").toLowerCase();
  if (s === "pending") return "bg-gray-100 text-gray-700";
  if (s === "successful" || s === "delivered") return "bg-green-100 text-green-700";
  if (s === "processing") return "bg-orange-100 text-orange-700";
  if (s === "cancelled") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
};

type RecentOrdersTableProps = {
  orders: DashboardRecentOrder[];
};

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <div className="bg-white rounded-xl border border-[#EEF1F6] shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-[#EEF1F6]">
        <h3 className="text-[#0B1E66] text-lg font-semibold">Recent Orders</h3>
        <p className="text-[#667085] text-sm mt-0.5">Latest orders from dashboard overview</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-[#EEF1F6] hover:bg-transparent">
            <TableHead className="text-[#667085] font-normal">Order Date</TableHead>
            <TableHead className="text-[#667085] font-normal">Order ID</TableHead>
            <TableHead className="text-[#667085] font-normal">Customer</TableHead>
            <TableHead className="text-[#667085] font-normal">Order Value</TableHead>
            <TableHead className="text-[#667085] font-normal">Qty</TableHead>
            <TableHead className="text-[#667085] font-normal">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => (
            <TableRow
              key={`${order.order_id}-${index}`}
              className="border-[#EEF1F6]"
            >
              <TableCell className="text-[#101928] text-sm">
                {order.date}
              </TableCell>
              <TableCell className="text-[#101928] font-medium text-sm">
                {order.order_id}
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-[#101928] font-medium text-sm">
                    {order.customer_name}
                  </p>
                  <p className="text-[#667085] text-xs">{order.customer_email}</p>
                </div>
              </TableCell>
              <TableCell className="text-[#101928] font-medium text-sm">
                {formatCurrency(order.order_value, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              </TableCell>
              <TableCell className="text-[#101928] text-sm">
                {order.quantity}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusClass(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
