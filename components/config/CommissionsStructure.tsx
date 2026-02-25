"use client";

import * as React from "react";
import { Search } from "lucide-react";
import DataTable from "@/components/common/DataTable";
import CreateCommissionStructureModal from "@/components/config/CreateCommissionStructureModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CommissionRow = {
  id: number;
  date: string;
  time: string;
  name: string;
  type: string;
  percentage: string;
  bonus: string;
  rate: string;
  minThreshold: string;
  maxThreshold: string;
  status: "Active";
};

const BASE_ROWS: Omit<CommissionRow, "id">[] = [
  {
    date: "Apr 12, 2023",
    time: "09:32AM",
    name: "Standard Flat",
    type: "Flat Percentage",
    percentage: "5%",
    bonus: "-",
    rate: "-",
    minThreshold: "-",
    maxThreshold: "-",
    status: "Active",
  },
  {
    date: "Apr 12, 2023",
    time: "09:32AM",
    name: "Premium Tier",
    type: "Tiered",
    percentage: "-",
    bonus: "₦50,000",
    rate: "8%",
    minThreshold: "₦500,000",
    maxThreshold: "₦ 2,000,000",
    status: "Active",
  },
  {
    date: "Apr 12, 2023",
    time: "09:32AM",
    name: "Elite Bonus",
    type: "Tiered",
    percentage: "-",
    bonus: "₦150,000",
    rate: "12%",
    minThreshold: "-",
    maxThreshold: "₦2,000,000",
    status: "Active",
  },
];

const COMMISSIONS: CommissionRow[] = Array.from({ length: 18 }, (_, index) => ({
  ...BASE_ROWS[index % BASE_ROWS.length],
  id: index + 1,
}));

const PAGE_SIZE = 3;

export default function CommissionsStructure() {
  const [search, setSearch] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const filteredRows = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return COMMISSIONS;

    return COMMISSIONS.filter((row) =>
      [row.name, row.type, row.date].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const rows = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredRows]);

  const columns = React.useMemo(
    () => [
      { key: "dateTime", label: "Date & Time" },
      { key: "name", label: "Name" },
      { key: "type", label: "Type" },
      { key: "percentage", label: "Percentage" },
      { key: "bonus", label: "Bonus" },
      { key: "rate", label: "Rate" },
      { key: "minThreshold", label: "Min threshold" },
      { key: "maxThreshold", label: "Max threshold" },
      { key: "status", label: "Status" },
    ],
    []
  );

  const tableRows = React.useMemo(
    () =>
      rows.map((row) => ({
        dateTime: (
          <span className="whitespace-nowrap text-sm text-[#344054]">
            {row.date}
            <span className="px-2 text-[#D0D5DD]">|</span>
            {row.time}
          </span>
        ),
        name: (
          <span className="whitespace-nowrap text-sm font-medium text-[#101928]">
            {row.name}
          </span>
        ),
        type: (
          <span className="whitespace-nowrap text-sm text-[#344054]">
            {row.type}
          </span>
        ),
        percentage: (
          <span className="whitespace-nowrap text-sm text-[#101928]">
            {row.percentage}
          </span>
        ),
        bonus: (
          <span className="whitespace-nowrap text-sm text-[#101928]">
            {row.bonus}
          </span>
        ),
        rate: (
          <span className="whitespace-nowrap text-sm text-[#101928]">
            {row.rate}
          </span>
        ),
        minThreshold: (
          <span className="whitespace-nowrap text-sm text-[#101928]">
            {row.minThreshold}
          </span>
        ),
        maxThreshold: (
          <span className="whitespace-nowrap text-sm text-[#101928]">
            {row.maxThreshold}
          </span>
        ),
        status: (
          <span className="inline-flex rounded-full bg-[#E7F6EC] px-3 py-1 text-xs font-medium text-[#027A48]">
            {row.status}
          </span>
        ),
      })),
    [rows]
  );

  return (
    <div className="rounded-xl bg-white">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98A2B3]" />
          <Input
            placeholder="Search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
            className="h-10 rounded-lg border-[#EAECF0] bg-white pl-9 text-sm text-[#344054] shadow-none focus-visible:ring-0"
            aria-label="Search commission structures"
          />
        </div>
        <Button
          className="h-10 w-full px-4 text-sm sm:w-auto"
          onClick={() => setIsCreateModalOpen(true)}
        >
          New Structure
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={tableRows}
        page={currentPage}
        pageCount={totalPages}
        pageSize={PAGE_SIZE}
        total={filteredRows.length}
        onPageChange={setCurrentPage}
        className="border border-[#EEF1F6] shadow-xs"
      />

      <CreateCommissionStructureModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
