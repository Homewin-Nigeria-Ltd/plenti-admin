"use client";

import * as React from "react";
import DataTable from "@/components/common/DataTable";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { useOrderStore } from "@/store/useOrderStore";
import { mockOrders } from "@/data/orders";

export default function OrderTableWrapper() {
  const { setSingleOrder } = useOrderStore();

  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter orders based on search query
  const filteredOrders = React.useMemo(() => {
    if (!searchQuery) return mockOrders;

    const query = searchQuery.toLowerCase();
    return mockOrders.filter(
      (order) =>
        order.id.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.customerEmail.toLowerCase().includes(query) ||
        order.status.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const columns = [
    { key: "date", label: "Order Date" },
    { key: "id", label: "Order ID" },
    { key: "customer", label: "Customer Name" },
    { key: "value", label: "Order Value" },
    { key: "qty", label: "Quantity" },
    { key: "status", label: "Order Status" },
  ];

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(n);

  const statusChip = (status: string) => {
    const colorMap: Record<string, string> = {
      Successful: "bg-green-100 text-green-700",
      Pending: "bg-gray-100 text-gray-700",
      Processing: "bg-orange-100 text-orange-700",
      Cancelled: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          colorMap[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status}
      </span>
    );
  };

  const rows = filteredOrders.map((order, index) => {
    const initial = order.customerName?.charAt(0)?.toUpperCase() || "-";
    return {
      orderIndex: index,
      orderId: order.id,
      date: <span className="text-[#101928] text-sm">{order.date}</span>,
      id: (
        <span className="text-[#101928] font-medium text-sm">{order.id}</span>
      ),
      customer: (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="bg-[#1F3A78] text-white text-sm font-medium">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-[#101928] font-medium text-sm">
              {order.customerName}
            </p>
            <p className="text-[#667085] text-xs">{order.customerEmail}</p>
          </div>
        </div>
      ),
      value: (
        <span className="text-[#101928] font-medium text-sm">
          {formatCurrency(order.value)}
        </span>
      ),
      qty: <span className="text-[#101928] text-sm">{order.qty}</span>,
      status: statusChip(order.status),
    };
  });

  return (
    <div className="space-y-6">
      <div className="border border-[#F0F2F5] rounded-[8px] h-[48px] flex items-center gap-2 p-2 px-4 shadow-sm bg-white">
        <Image src={"/icons/search.png"} alt="Search" width={20} height={20} />
        <Input
          className="w-full placeholder:text-[#253B4B] border-0 outline-none focus-visible:ring-0 shadow-none h-auto"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="bg-white rounded-xl border border-[#EEF1F6] shadow-xs">
        <DataTable
          columns={columns}
          rows={rows}
          onRowClick={async (row) => {
            const orderIndex = row.orderIndex as number;
            if (orderIndex !== undefined && filteredOrders[orderIndex]) {
              // For now, use a simple numeric ID based on index
              // In a real app, you'd use the actual order ID from the API
              setSelectedId(orderIndex + 1);
              setOpen(true);
            }
          }}
        />
      </div>
      <OrderDetailsModal
        selectedId={selectedId}
        isOpen={open}
        onClose={() => {
          setSingleOrder();
          setOpen(false);
        }}
      />
    </div>
  );
}
