"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddUserModal } from "./AddUserModal";
import DataTable from "@/components/common/DataTable";
import { useUserStore } from "@/store/useUserStore";
import { useDebounce } from "use-debounce";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<"customers" | "admin">("customers");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = React.useState(false);
  const [debouncedSearch] = useDebounce(searchQuery, 400);
  const [hasRequested, setHasRequested] = React.useState(false);

  const {
    users,
    loadingUsers,
    currentPage,
    lastPage,
    perPage,
    totalItems,
    fetchUsers,
  } = useUserStore();

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(n);

  const role = activeTab === "admin" ? "admin" : "customer";

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      await fetchUsers({ page: 1, search: debouncedSearch, role });
      if (!cancelled) setHasRequested(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, fetchUsers, role]);

  const getStatusBadgeClass = (status: string) => {
    const s = status?.toLowerCase?.() ?? "";
    if (s === "active") return "badge-success";
    if (s === "pending") return "badge-warning";
    if (s === "inactive") return "badge-danger";
    return "badge-neutral";
  };

  const getInitialsFromName = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
    return (first + last).toUpperCase() || "U";
  };

  type TableRow = {
    dateCreated: React.ReactNode;
    customerName: React.ReactNode;
    orders: React.ReactNode;
    amountSpent: React.ReactNode;
    phoneNumber: React.ReactNode;
    status: React.ReactNode;
  };

  const columns: Array<{ key: keyof TableRow; label: string }> = [
    { key: "dateCreated", label: "Date created" },
    { key: "customerName", label: "Customer Name" },
    { key: "orders", label: "Orders" },
    { key: "amountSpent", label: "Amount Spent" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "status", label: "Status" },
  ];

  const tableRows = React.useMemo<TableRow[]>(() => {
    return users.map((user) => ({
      dateCreated: (
        <span className="text-neutral-700 text-sm">{user.joined_date}</span>
      ),
      customerName: (
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            {user.avatar_url ? (
              <AvatarImage src={user.avatar_url} alt={user.name} />
            ) : null}
            <AvatarFallback className="bg-primary text-white text-sm font-semibold">
              {getInitialsFromName(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-primary-700 text-xs sm:text-sm truncate">
              {user.name}
            </p>
            <p className="text-xs text-neutral-500 truncate">
              {user.email}
            </p>
          </div>
        </div>
      ),
      orders: (
        <span className="text-neutral-700 text-xs sm:text-sm">{user.total_orders}</span>
      ),
      amountSpent: (
        <span className="text-neutral-700 text-xs sm:text-sm font-medium whitespace-nowrap">
          {formatCurrency(Number.parseFloat(user.amount_spent ?? "0") || 0)}
        </span>
      ),
      phoneNumber: (
        <span className="text-neutral-700 text-xs sm:text-sm whitespace-nowrap">
          {user.phone ?? "-"}
        </span>
      ),
      status: (
        <span className={`badge ${getStatusBadgeClass(user.status)}`}>
          {user.status}
        </span>
      ),
    }));
  }, [users]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex gap-4 sm:gap-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setActiveTab("customers")}
            className={`px-4 py-2 font-medium text-sm sm:text-base transition-colors whitespace-nowrap rounded-md ${
              activeTab === "customers"
                ? "bg-[#E8EEFF] text-primary"
                : "bg-transparent text-neutral-500 hover:bg-neutral-50"
            }`}>
            Customers
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`px-4 py-2 font-medium text-sm sm:text-base transition-colors whitespace-nowrap rounded-md ${
              activeTab === "admin"
                ? "bg-[#E8EEFF] text-primary"
                : "bg-transparent text-neutral-500 hover:bg-neutral-50"
            }`}>
            Admin Users
          </button>
        </div>
        {activeTab === "admin" && (
          <Button
            onClick={() => setIsAddUserModalOpen(true)}
            className="btn btn-primary w-full sm:w-auto">
            <Plus className="size-4 mr-2" />
            Add Admin User
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="border border-neutral-100 rounded-[8px] h-[50px] flex items-center gap-1 p-2 px-4 shadow-sm flex-1 max-w-full sm:max-w-md">
          <Search className="size-5 text-neutral-500 shrink-0" />
          <Input
            className="w-full placeholder:text-primary-700 border-0 outline-none focus-visible:ring-0 shadow-none"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="border-neutral-100 h-[50px] w-full sm:w-auto">
          <ChevronDown className="size-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="bg-white rounded-xl">
            {hasRequested && !loadingUsers && users.length > 0 ? (
              <DataTable
                columns={columns as unknown as Array<{ key: string; label: string }>}
                rows={tableRows as unknown as Record<string, React.ReactNode>[]}
                page={currentPage}
                pageCount={lastPage}
                pageSize={perPage}
                total={totalItems}
                onPageChange={(nextPage) =>
                  fetchUsers({ page: nextPage, search: debouncedSearch, role })
                }
                onRowClick={(_, idx) => {
                  const id = users[idx]?.id;
                  if (id) router.push(`/user/${id}`);
                }}
              />
            ) : !hasRequested || loadingUsers ? (
              <div className="min-w-[720px]">
                <div className="grid grid-cols-6 gap-4 px-4 py-3 border-b border-neutral-100">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-4 w-24" />
                  ))}
                </div>
                {Array.from({ length: Math.max(6, perPage) }).map((_, rowIdx) => (
                  <div
                    key={rowIdx}
                    className="grid grid-cols-6 gap-4 px-4 py-4 border-b border-neutral-100"
                  >
                    <Skeleton className="h-4 w-28" />
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-28" />
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
              <p className="text-center my-5">No users available</p>
            )}
          </div>
      </div>

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />
    </div>
  );
}
