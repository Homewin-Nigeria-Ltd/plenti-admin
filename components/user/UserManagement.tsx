"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import type { User, UserStatus } from "@/data/users";
import { mockCustomers, mockAdminUsers } from "@/data/users";
import { AddUserModal } from "./AddUserModal";

export default function UserManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<"customers" | "admin">("customers");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = React.useState(false);
  const pageSize = 10;

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(n);

  const getStatusBadgeClass = (status: UserStatus) => {
    switch (status) {
      case "Active":
        return "bg-[#0F973D] text-white";
      case "Inactive":
        return "bg-red-600 text-white";
      case "Suspended":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const currentUsers = activeTab === "customers" ? mockCustomers : mockAdminUsers;

  const filteredUsers = React.useMemo(() => {
    let filtered = currentUsers;

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [currentUsers, searchQuery]);

  React.useEffect(() => {
    setPage(1);
  }, [activeTab, searchQuery]);

  const paginatedUsers = React.useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, page, pageSize]);

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));

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
    return paginatedUsers.map((user) => ({
      dateCreated: (
        <span className="text-neutral-700 text-sm">{user.dateCreated}</span>
      ),
      customerName: (
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
            ) : null}
            <AvatarFallback className="bg-primary text-white text-sm font-semibold">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-primary-700 text-xs sm:text-sm truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-neutral-500 truncate">
              {user.email}
            </p>
          </div>
        </div>
      ),
      orders: (
        <span className="text-neutral-700 text-xs sm:text-sm">{user.orders}</span>
      ),
      amountSpent: (
        <span className="text-neutral-700 text-xs sm:text-sm font-medium whitespace-nowrap">
          {formatCurrency(user.amountSpent)}
        </span>
      ),
      phoneNumber: (
        <span className="text-neutral-700 text-xs sm:text-sm whitespace-nowrap">{user.phoneNumber}</span>
      ),
      status: (
        <span className={`badge ${getStatusBadgeClass(user.status)}`}>
          {user.status}
        </span>
      ),
    }));
  }, [paginatedUsers, formatCurrency]);

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
            className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto h-[50px]">
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
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow>
                {columns.map((c) => (
                  <TableHead
                    key={c.key}
                    className="text-[#667085] bg-white text-[14px] font-normal">
                    {c.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableRows.map((row, idx) => (
                <TableRow
                  key={idx}
                  onClick={() => router.push(`/user/${paginatedUsers[idx].id}`)}
                  className="cursor-pointer hover:bg-neutral-50 transition-colors">
                  {columns.map((c) => (
                    <TableCell key={c.key}>
                      {row[c.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 sm:px-4 py-3">
            <p className="text-xs sm:text-sm text-[#667085]">
              Page {page} of {pageCount}
            </p>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className={`rounded-full border border-[#EEF1F6] p-1 sm:p-1.5 ${
                  page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-50"
                }`}>
                <ChevronLeft className="size-3 sm:size-4 text-[#667085]" />
              </button>
              {Array.from({ length: Math.min(pageCount, 6) }, (_, i) => {
                let pageNum;
                if (pageCount <= 6) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= pageCount - 2) {
                  pageNum = pageCount - 5 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                      page === pageNum
                        ? "bg-primary text-white"
                        : "text-[#667085] hover:bg-neutral-50"
                    }`}>
                    {pageNum}
                  </button>
                );
              })}
              <button
                disabled={page === pageCount}
                onClick={() => setPage(page + 1)}
                className={`rounded-full border border-[#EEF1F6] p-1 sm:p-1.5 ${
                  page === pageCount ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-50"
                }`}>
                <ChevronRight className="size-3 sm:size-4 text-[#667085]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />
    </div>
  );
}
