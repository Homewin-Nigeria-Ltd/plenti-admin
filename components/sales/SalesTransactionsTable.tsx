"use client";

import React, { useState } from "react";
import { useSalesTransactionsStore } from "@/store/useSalesTransactionsStore";
import DataTable from "@/components/common/DataTable";
import { useDebounce } from "use-debounce";
import { PAGE_SIZE } from "@/lib/constant";

export default function SalesTransactionsTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const { transactions, loading, pagination, fetchTransactions } =
    useSalesTransactionsStore();

  // Fetch transactions when page or search changes
  React.useEffect(() => {
    fetchTransactions(page, PAGE_SIZE, debouncedSearch);
  }, [page, debouncedSearch]);

  const columns = [
    { key: "created_at", label: "Order Date" },
    { key: "order_number", label: "Order ID" },
    { key: "customer", label: "Customer Name" },
    { key: "total", label: "Order Value" },
    { key: "status", label: "Order Status" },
  ];

  const rows = transactions.map((tx) => ({
    created_at: new Date(tx.created_at).toLocaleString(),
    order_number: tx.order_number,
    customer: (
      <div>
        <div className="font-medium">{tx.user?.name}</div>
        <div className="text-xs text-gray-500">{tx.user?.email}</div>
      </div>
    ),
    total: `₦${Number(tx.total).toLocaleString()}`,
    status: (
      <span
        className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${tx.status === "delivered" ? "bg-[#E7F6EC] text-[#027A48]" : "bg-[#FFF4E6] text-[#FF9500]"}`}
      >
        {tx.status}
      </span>
    ),
  }));

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-full outline-none border-[#F0F2F5]"
      />
      <DataTable
        columns={columns}
        rows={rows}
        page={page}
        pageSize={PAGE_SIZE}
        total={pagination?.total || 0}
        pageCount={pagination?.last_page || 1}
        onPageChange={setPage}
      />
    </div>
  );
}
