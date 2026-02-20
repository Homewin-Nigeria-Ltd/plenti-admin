"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type LeaderboardRow = {
  rank: number;
  name: string;
  email: string;
  initial: string;
  cumulativeTarget: string;
  actual: string;
  targetStatus: "Surpassed" | "Completed" | "On going" | "Under Performing";
};

const leaderboardRows: LeaderboardRow[] = [
  {
    rank: 1,
    name: "Obubra Erekosima",
    email: "thekdfisher@email.com",
    initial: "E",
    cumulativeTarget: "2,500,000",
    actual: "3,000,000",
    targetStatus: "Surpassed",
  },
  {
    rank: 2,
    name: "Perebuowei Taribo",
    email: "thekdfisher@email.com",
    initial: "T",
    cumulativeTarget: "2,500,000",
    actual: "2,500,000",
    targetStatus: "Completed",
  },
  {
    rank: 3,
    name: "Titi Ige",
    email: "thekdfisher@email.com",
    initial: "I",
    cumulativeTarget: "2,500,000",
    actual: "2,200,000",
    targetStatus: "On going",
  },
  {
    rank: 4,
    name: "Ayodele Folarin",
    email: "thekdfisher@email.com",
    initial: "F",
    cumulativeTarget: "2,500,000",
    actual: "2,000,000",
    targetStatus: "Under Performing",
  },
];

function StatusPill({ status }: { status: LeaderboardRow["targetStatus"] }) {
  const statusStyles =
    status === "Surpassed"
      ? "bg-[#E7F6EC] text-[#027A48]"
      : status === "Completed"
      ? "bg-[#E8EEFF] text-[#1D3B8B]"
      : status === "On going"
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

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return leaderboardRows;

    return leaderboardRows.filter(
      (row) =>
        row.name.toLowerCase().includes(query) ||
        row.email.toLowerCase().includes(query) ||
        row.targetStatus.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <div className="space-y-4 rounded-xl bg-white">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#667085]" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-22.5 text-[#667085]">Rank</TableHead>
            <TableHead className="min-w-65 text-[#667085]">Name</TableHead>
            <TableHead className="min-w-45 text-[#667085]">
              Cumulative Target
            </TableHead>
            <TableHead className="min-w-35 text-[#667085]">Actual</TableHead>
            <TableHead className="min-w-45 text-[#667085]">
              Target Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRows.map((row) => (
            <TableRow key={row.rank}>
              <TableCell className="text-sm text-[#475467]">
                {row.rank}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-[#0B1E66] text-xs font-bold text-white">
                      {row.initial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#101928]">
                      {row.name}
                    </span>
                    <span className="text-xs text-[#667085]">{row.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm font-medium text-[#101928]">
                {row.cumulativeTarget}
              </TableCell>
              <TableCell className="text-sm font-medium text-[#101928]">
                {row.actual}
              </TableCell>
              <TableCell>
                <StatusPill status={row.targetStatus} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
