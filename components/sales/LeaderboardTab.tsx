"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import DataTable from "@/components/common/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useLeaderboardStore } from "@/store/useLeaderboardStore";
import { formatLargeAmount } from "@/lib/formatAmount";
import { useDebounce } from "@/lib/useDebounce";
import { PAGE_SIZE } from "@/lib/constant";

type LeaderboardRow = {
  rank: number;
  name: string;
  avatarUrl: string;
  position: string;
  cumulativeTarget: string;
  actual: string;
  targetStatus: string;
};

function StatusPill({ status }: { status: string }) {
  const statusStyles =
    status === "Surpassed" || status === "Completed"
      ? "bg-[#E7F6EC] text-[#027A48]"
      : status === "In Progress"
        ? "bg-[#FFF4E6] text-[#FF9500]"
        : "bg-[#FEECEF] text-[#F04438]";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles}`}
    >
      {status}
    </span>
  );
}

export default function LeaderboardTab() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500);
  const debouncedStatusFilter = useDebounce(statusFilter, 500);
  const { members, loading, error, fetchLeaderboard, pagination } =
    useLeaderboardStore();

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, debouncedStatusFilter]);

  useEffect(() => {
    void fetchLeaderboard(
      currentPage,
      PAGE_SIZE,
      debouncedSearch,
      debouncedStatusFilter,
    );
  }, [fetchLeaderboard, currentPage, debouncedSearch, debouncedStatusFilter]);

  const leaderboardRows = useMemo(
    () =>
      members.map((member) => ({
        rank: member.rank,
        name: member.name,
        avatarUrl: member.avatar_url,
        position: member.position,
        cumulativeTarget: `₦${formatLargeAmount(member.target_amount)}`,
        actual: `₦${formatLargeAmount(member.total_achieved)}`,
        targetStatus: member.target_status,
      })),
    [members],
  );

  const columns = useMemo(
    () => [
      { key: "rank", label: "Rank", className: "min-w-22.5" },
      { key: "name", label: "Name", className: "min-w-65" },
      {
        key: "cumulativeTarget",
        label: "Cumulative Target",
        className: "min-w-45",
      },
      { key: "actual", label: "Actual", className: "min-w-35" },
      { key: "targetStatus", label: "Target Status", className: "min-w-45" },
    ],
    [],
  );

  const rows = useMemo(
    () =>
      leaderboardRows.map((row) => ({
        rank: <span className="text-sm text-[#475467]">{row.rank}</span>,
        name: (
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarImage src={row.avatarUrl} alt={row.name} />
              <AvatarFallback className="bg-[#0B1E66] text-xs font-bold text-white">
                {row.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#101928]">
                {row.name}
              </span>
              <span className="text-xs text-[#667085]">{row.position}</span>
            </div>
          </div>
        ),
        cumulativeTarget: (
          <span className="text-sm font-medium text-[#101928]">
            {row.cumulativeTarget}
          </span>
        ),
        actual: (
          <span className="text-sm font-medium text-[#101928]">
            {row.actual}
          </span>
        ),
        targetStatus: <StatusPill status={row.targetStatus} />,
      })),
    [leaderboardRows],
  );

  return (
    <div className="space-y-4 rounded-xl bg-white">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#667085]" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email, or position"
            className="h-11 rounded-xl border-[#D0D5DD] pl-10 focus-visible:border-[#D0D5DD] focus-visible:ring-0"
          />
        </div>

        <Select
          value={statusFilter || "all"}
          onValueChange={(value) => {
            setStatusFilter(value === "all" ? "" : value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="h-11 w-45 rounded-xl border-[#D0D5DD] text-sm text-[#667085]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Surpassed">Surpassed</SelectItem>
            <SelectItem value="Under Performing">Under Performing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-[#EAECF0] bg-[#F9FAFB] p-6 text-center">
          <p className="text-sm text-[#D42620]">{error}</p>
        </div>
      ) : members.length === 0 ? (
        <div className="rounded-xl border border-[#EAECF0] bg-[#F9FAFB] p-6 text-center">
          <p className="text-sm text-[#667085]">
            No leaderboard data available
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          page={pagination?.current_page ?? currentPage}
          pageSize={pagination?.per_page ?? PAGE_SIZE}
          total={pagination?.total ?? rows.length}
          pageCount={pagination?.last_page ?? 1}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
}
