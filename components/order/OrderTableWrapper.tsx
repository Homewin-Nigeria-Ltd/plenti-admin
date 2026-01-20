"use client";

import * as React from "react";
import DataTable from "@/components/common/DataTable";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { useOrderStore } from "@/store/useOrderStore";
import { OrderStatus } from "@/types/OrderTypes";

export default function OrderTableWrapper() {
  const { fetchOrders, orders, setSingleOrder } = useOrderStore();

  console.log("Orders data in component =>", orders);

  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  // React.useEffect(() => {
  //   fetchOrders();
  // }, [fetchOrders]);

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

  const statusChip = (status: OrderStatus) => {
    const colorMap = {
      SUCCESSFUL: "bg-green-100 text-green-700",
      PENDING: "bg-gray-100 text-gray-700",
      PROCESSING: "bg-yellow-100 text-yellow-700",
      CANCELLED: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${colorMap[status]}`}
      >
        {status}
      </span>
    );
  };

  const rows = orders.map((o) => {
    // const initial = o.customerName?.charAt(0)?.toUpperCase() || "-";
    return {
      // date: o.date,
      id: o.id,
      customer: (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="bg-[#1F3A78] text-white">
              {/* {initial} */}
            </AvatarFallback>
          </Avatar>
          <div>
            {/* <p className="font-medium">{o.customerName}</p> */}
            {/* <p className="text-[#667085] text-xs">{o.customerEmail}</p> */}
          </div>
        </div>
      ),
      value: formatCurrency(o.totalAmount),
      // qty: o.qty,
      status: statusChip(o.status),
    };
  });

  return (
    <div className="space-y-6">
      <div className="border border-[#F0F2F5] rounded-[8px] h-[38px] flex items-center gap-1 p-2 px-4 shadow-sm">
        <Image src={"/icons/search.png"} alt="Search" width={20} height={20} />
        <Input
          className="w-full placeholder:text-[#253B4B] border-0 outline-none focus-visible:ring-0 shadow-none"
          placeholder="Search"
        />
      </div>
      <DataTable
        columns={columns}
        rows={rows}
        onRowClick={async (order) => {
          await setSelectedId(order.id);
          setOpen(true);
        }}
      />
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
