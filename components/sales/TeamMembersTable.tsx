"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import DataTable from "@/components/common/DataTable";
import { teamMembersData } from "@/data/sales";
import type { TeamMemberRow } from "@/types/sales";

type TeamMembersTableProps = {
  onSelectMember?: (member: TeamMemberRow) => void;
};

function StatusPill() {
  return (
    <span className="inline-flex rounded-full bg-[#E7F6EC] px-2 py-1 text-xs font-medium text-[#12B76A]">
      Active
    </span>
  );
}

export default function TeamMembersTable({
  onSelectMember,
}: TeamMembersTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const filteredRows = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return teamMembersData;

    return teamMembersData.filter(
      (member) =>
        member.name.toLowerCase().includes(value) ||
        member.email.toLowerCase().includes(value) ||
        member.role.toLowerCase().includes(value)
    );
  }, [search]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page]);

  const columns = [
    { key: "dateCreated", label: "Date created", className: "min-w-[180px]" },
    { key: "name", label: "Name", className: "min-w-[260px]" },
    { key: "role", label: "Role", className: "min-w-[140px]" },
    { key: "createdBy", label: "Created By", className: "min-w-[200px]" },
    { key: "status", label: "Status", className: "min-w-[120px]" },
  ];

  const rows = paginatedRows.map((member) => ({
    dateCreated: (
      <span className="text-sm text-[#475467]">{member.dateCreated}</span>
    ),
    name: (
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarFallback className="bg-[#0B1E66] text-xs font-bold text-white">
            {member.initial}
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
      <span className="text-sm font-medium text-[#101928]">{member.role}</span>
    ),
    createdBy: (
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarFallback className="bg-[#0B1E66] text-xs font-bold text-white">
            {member.createdByInitial}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-[#101928]">
          {member.createdBy}
        </span>
      </div>
    ),
    status: <StatusPill />,
  }));

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

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D0D5DD] text-[#667085]"
        >
          <SlidersHorizontal className="size-4" />
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        page={page}
        pageSize={pageSize}
        total={filteredRows.length}
        onPageChange={setPage}
        onRowClick={(_, rowIndex) => onSelectMember?.(paginatedRows[rowIndex])}
      />
    </div>
  );
}
