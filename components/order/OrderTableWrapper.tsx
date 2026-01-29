"use client";

import * as React from "react";
import DataTable from "@/components/common/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { useOrderStore } from "@/store/useOrderStore";
import { useDebounce } from "use-debounce";
import { Skeleton } from "@/components/ui/skeleton";

function formatOrderDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function OrderTableWrapper() {
  const {
    orders,
    loading,
    currentPage,
    lastPage,
    perPage,
    totalItems,
    fetchOrders,
    setSingleOrder,
  } = useOrderStore();

  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 400);
  const [hasRequested, setHasRequested] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    const searchTerm = typeof debouncedSearch === "string" ? debouncedSearch.trim() : "";
    (async () => {
      await fetchOrders({ page: 1, search: searchTerm });
      if (!cancelled) setHasRequested(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, fetchOrders]);

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
    const s = (status ?? "").toLowerCase();
    const colorMap: Record<string, string> = {
      successful: "bg-green-100 text-green-700",
      pending: "bg-gray-100 text-gray-700",
      processing: "bg-orange-100 text-orange-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          colorMap[s] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status || "—"}
      </span>
    );
  };

  const getInitials = (name: string) => {
    const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
    return (first + last).toUpperCase() || "?";
  };

  const tableRows = React.useMemo(
    () =>
      orders.map((order) => {
        const qty = (order.items ?? []).reduce((acc, i) => acc + (i.quantity ?? 0), 0);
        const name = order.user?.name ?? "—";
        return {
          date: (
            <span className="text-[#101928] text-sm">
              {formatOrderDate(order.created_at)}
            </span>
          ),
          id: (
            <span className="text-[#101928] font-medium text-sm">
              {order.order_number}
            </span>
          ),
          customer: (
            <div className="flex items-center gap-3">
              <Avatar className="size-8">
                {order.user?.avatar_url ? (
                  <AvatarImage src={order.user.avatar_url} alt={name} />
                ) : null}
                <AvatarFallback className="bg-[#1F3A78] text-white text-sm font-medium">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-[#101928] font-medium text-sm">{name}</p>
                <p className="text-[#667085] text-xs">
                  {order.user?.email ?? "—"}
                </p>
              </div>
            </div>
          ),
          value: (
            <span className="text-[#101928] font-medium text-sm">
              {formatCurrency(Number(order.total) ?? 0)}
            </span>
          ),
          qty: <span className="text-[#101928] text-sm">{qty}</span>,
          status: statusChip(order.status),
        };
      }),
    [orders]
  );

  return (
    <div className="space-y-6">
      <div className="border border-[#F0F2F5] rounded-[8px] h-[48px] flex items-center gap-2 p-2 px-4 shadow-sm bg-white">
        <Search className="size-5 text-neutral-500 shrink-0" />
        <Input
          className="w-full placeholder:text-[#253B4B] border-0 outline-none focus-visible:ring-0 shadow-none h-auto"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl border border-[#EEF1F6] shadow-xs">
        {hasRequested && !loading && orders.length > 0 ? (
          <DataTable
            columns={columns}
            rows={tableRows}
            page={currentPage}
            pageCount={lastPage}
            pageSize={perPage}
            total={totalItems}
            onPageChange={(nextPage) =>
              fetchOrders({ page: nextPage, search: debouncedSearch })
            }
            onRowClick={(_, idx) => {
              const order = orders[idx];
              if (order?.id != null) {
                setSelectedId(order.id);
                setOpen(true);
              }
            }}
          />
        ) : !hasRequested || loading ? (
          <div className="min-w-[720px]">
            <div className="grid grid-cols-6 gap-4 px-4 py-3 border-b border-neutral-100">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-24" />
              ))}
            </div>
            {Array.from({ length: Math.max(6, perPage) }).map((_, rowIdx) => (
              <div
                key={rowIdx}
                className="grid grid-cols-6 gap-4 px-4 py-4 border-b border-neutral-100"
              >
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-32" />
                <div className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-3">
              <Skeleton className="h-4 w-32" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center py-8 text-[#667085]">No orders found</p>
        )}
      </div>

      <OrderDetailsModal
        selectedId={selectedId}
        isOpen={open}
        onClose={() => {
          setSingleOrder();
          setOpen(false);
          setSelectedId(null);
        }}
      />
    </div>
  );
}
