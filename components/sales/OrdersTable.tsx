"use client";

import { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { OrderRow } from "@/types/sales";

interface OrdersTableProps {
  orders: OrderRow[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-4 py-2 border border-[#EEF1F6] rounded-lg max-w-xs">
        <Image
          src="/icons/sales/search-normal.svg"
          alt="search"
          width={16}
          height={16}
        />
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 text-base text-[#253B4B] placeholder:text-[#253B4B] outline-none bg-transparent"
        />
      </div>

      <div className="bg-white rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm text-[#667085]">Order Date</TableHead>
              <TableHead className="text-sm text-[#667085]">Order ID</TableHead>
              <TableHead className="text-sm text-[#667085]">Customer Name</TableHead>
              <TableHead className="text-sm text-[#667085]">Sales Value</TableHead>
              <TableHead className="text-sm text-[#667085]">Commission</TableHead>
              <TableHead className="text-sm text-[#667085]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order, index) => (
              <TableRow key={index}>
                <TableCell className="text-sm text-[#344054]">
                  {order.date}
                </TableCell>
                <TableCell className="text-sm text-[#101828]">
                  {order.orderId}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 bg-[#0B1E66]">
                      <AvatarFallback className="bg-[#0B1E66] text-white text-[15px] font-semibold">
                        {order.customerInitial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#101928]">
                        {order.customerName}
                      </span>
                      {order.customerEmail && (
                        <span className="text-sm text-[#475367]">
                          {order.customerEmail}
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-medium text-[#101828]">
                  {order.salesValue}
                </TableCell>
                <TableCell className="text-sm font-medium text-[#101828]">
                  {order.commission}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === "Paid"
                        ? "bg-[#E7F6EC] text-[#027A48]"
                        : "bg-[#FFF4E6] text-[#FF9500]"
                    }`}
                  >
                    {order.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
