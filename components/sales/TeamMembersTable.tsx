"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import DataTable from "@/components/common/DataTable";
import { useTeamMembersStore } from "@/store/useTeamMembersStore";
import { format } from "date-fns";
import { PAGE_SIZE } from "@/lib/constant";

function StatusPill({ status }: { status: string }) {
  const isActive = status.toLowerCase() === "active";
  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
        isActive ? "bg-[#E7F6EC] text-[#12B76A]" : "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

export default function TeamMembersTable() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [page, setPage] = useState(1);

  const { teamMembers, loading, pagination, fetchTeamMembers } =
    useTeamMembersStore();

  useEffect(() => {
    fetchTeamMembers(page, PAGE_SIZE, debouncedSearch);
  }, [page, debouncedSearch, fetchTeamMembers]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const columns = [
    { key: "dateCreated", label: "Date created", className: "min-w-[180px]" },
    { key: "name", label: "Name", className: "min-w-[260px]" },
    { key: "role", label: "Role", className: "min-w-[140px]" },
    { key: "createdBy", label: "Created By", className: "min-w-[200px]" },
    { key: "status", label: "Status", className: "min-w-[120px]" },
  ];

  const rows = (Array.isArray(teamMembers) ? teamMembers : []).map(
    (member) => ({
      dateCreated: (
        <span className="text-sm text-[#475467]">
          {format(new Date(member.joined_date), "MMM dd, yyyy")}
        </span>
      ),
      name: (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="bg-[#0B1E66] text-xs font-bold text-white">
              {getInitials(member.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-[#101928]">
              {member.name}
            </span>
            <span className="text-xs text-[#667085]">{member.email}</span>
          </div>
        </div>
      ),
      role: (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[#101928]">
            {member.team_member_role ?? ""}
          </span>
          <span className="text-xs text-[#667085]">{member.department}</span>
        </div>
      ),
      createdBy: (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="bg-[#0B1E66] text-xs font-bold text-white">
              {getInitials(member?.created_by?.name || "")}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-[#101928]">
            {member?.created_by?.name || ""}
          </span>
        </div>
      ),
      status: <StatusPill status={member.status} />,
    }),
  );

  return (
    <div className="space-y-4 rounded-xl bg-white">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#667085]" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search"
            className="h-11 rounded-xl border-[#D0D5DD] pl-10 focus-visible:border-[#D0D5DD] focus-visible:ring-0"
          />
        </div>

        {/* <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D0D5DD] text-[#667085]"
        >
          <SlidersHorizontal className="size-4" />
        </button> */}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="size-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#0B1E66]"></div>
            </div>
            <p className="text-sm text-gray-500">Loading team members...</p>
          </div>
        </div>
      ) : rows.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-sm text-gray-500">No team members found</p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          page={page}
          pageSize={PAGE_SIZE || 0}
          total={pagination?.total || 0}
          pageCount={
            pagination?.total
              ? Math.ceil(pagination.total / (pagination.per_page || PAGE_SIZE))
              : 1
          }
          onPageChange={setPage}
          onRowClick={(_, rowIndex) => {
            const arr = Array.isArray(teamMembers) ? teamMembers : [];
            const selectedMember = arr[rowIndex];
            if (selectedMember) {
              router.push(`/sales/team-members/${selectedMember.id}`);
            }
          }}
        />
      )}
    </div>
  );
}
