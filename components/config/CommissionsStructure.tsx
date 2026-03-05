"use client";

import * as React from "react";
import { MoreHorizontal, Search } from "lucide-react";
import DataTable from "@/components/common/DataTable";
import CreateCommissionStructureModal from "@/components/config/CreateCommissionStructureModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type CommissionStructure,
  useCommissionStructuresStore,
} from "@/store/useCommissionStructuresStore";

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
  raw: CommissionStructure;
};

const PAGE_SIZE = 3;

function formatDateTime(value?: string): { date: string; time: string } {
  if (!value) return { date: "-", time: "-" };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { date: "-", time: "-" };

  return {
    date: new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date),
    time: new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
      .format(date)
      .replace(" ", ""),
  };
}

function formatNaira(value: number): string {
  return `₦${new Intl.NumberFormat("en-NG").format(value ?? 0)}`;
}

export default function CommissionsStructure() {
  const [search, setSearch] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [selectedStructure, setSelectedStructure] =
    React.useState<CommissionStructure | null>(null);
  const {
    structures,
    loading,
    error,
    deletingId,
    fetchStructures,
    fetchStructureById,
    deleteStructure,
  } = useCommissionStructuresStore();

  React.useEffect(() => {
    void fetchStructures();
  }, [fetchStructures]);

  const commissionRows = React.useMemo<CommissionRow[]>(() => {
    return structures.map((item) => {
      const { date, time } = formatDateTime(item.created_at);
      const isFlat = item.commission_type === "FLAT_COMMISSION";

      return {
        id: item.id,
        date,
        time,
        name: item.name,
        type: isFlat ? "Flat Commission" : "Tier",
        percentage: `${Number(item.rate) * 100}%`,
        bonus: formatNaira(Number(item.bonus_amount ?? 0)),
        rate: `${Number(item.rate) * 100}%`,
        minThreshold: formatNaira(Number(item.min_threshold ?? 0)),
        maxThreshold: formatNaira(Number(item.max_threshold ?? 0)),
        status: "Active",
        raw: item,
      };
    });
  }, [structures]);

  const filteredRows = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return commissionRows;

    return commissionRows.filter((row) =>
      [row.name, row.type, row.date].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [search, commissionRows]);

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
      { key: "actions", label: "Actions" },
    ],
    [],
  );

  const handleEdit = React.useCallback(
    async (id: number) => {
      const latest = await fetchStructureById(id);
      if (latest) {
        setSelectedStructure(latest);
      } else {
        const fallback = structures.find((item) => item.id === id) ?? null;
        setSelectedStructure(fallback);
      }
      setIsCreateModalOpen(true);
    },
    [fetchStructureById, structures],
  );

  const handleDelete = React.useCallback(
    async (id: number) => {
      if (!window.confirm("Delete this commission structure?")) {
        return;
      }
      await deleteStructure(id);
    },
    [deleteStructure],
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
        actions: (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                onClick={(event) => event.stopPropagation()}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#EAECF0] text-[#667085] hover:bg-[#F9FAFB]"
                aria-label="Open row actions"
              >
                <MoreHorizontal className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                onSelect={() => {
                  void handleEdit(row.id);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                disabled={deletingId === row.id}
                onSelect={() => {
                  void handleDelete(row.id);
                }}
              >
                {deletingId === row.id ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      })),
    [rows, handleDelete, handleEdit, deletingId],
  );

  const showLoadingState = loading && structures.length === 0;
  const showEmptyState = !loading && filteredRows.length === 0;

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
          onClick={() => {
            setSelectedStructure(null);
            setIsCreateModalOpen(true);
          }}
        >
          New Structure
        </Button>
      </div>

      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

      {showLoadingState ? (
        <div className="space-y-3 rounded-xl border border-[#EEF1F6] p-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : showEmptyState ? (
        <div className="rounded-xl border border-[#EEF1F6] bg-white p-8 text-center">
          <p className="text-base font-medium text-[#101928]">
            {search.trim()
              ? "No commission structures match your search"
              : "No commission structures yet"}
          </p>
          <p className="mt-1 text-sm text-[#667085]">
            {search.trim()
              ? "Try a different keyword."
              : "Create a new structure to get started."}
          </p>
        </div>
      ) : (
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
      )}

      <CreateCommissionStructureModal
        isOpen={isCreateModalOpen}
        structure={selectedStructure}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedStructure(null);
        }}
      />
    </div>
  );
}
