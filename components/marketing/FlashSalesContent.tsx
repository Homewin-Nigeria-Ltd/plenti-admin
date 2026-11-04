"use client";

import DataTable from "@/components/common/DataTable";
import { CreateFlashSaleModal } from "@/components/marketing/CreateFlashSaleModal";
import { FlashSaleDetailsModal } from "@/components/marketing/FlashSaleDetailsModal";
import { Input } from "@/components/ui/input";
import {
  flashSaleItemsCount,
  formatSaleDateTime,
  resolveFlashSaleStatus,
} from "@/lib/flashSale";
import { cn } from "@/lib/utils";
import { useFlashSaleStore } from "@/store/useFlashSaleStore";
import type { FlashSale, FlashSaleStatus } from "@/types/FlashSaleTypes";
import Image from "next/image";
import * as React from "react";

const STATUS_STYLES: Record<FlashSaleStatus, string> = {
  scheduled: "bg-[#E8EEFF] text-[#0B1E66]",
  running: "bg-green-100 text-green-700",
  ended: "bg-gray-100 text-gray-700",
  off: "bg-red-100 text-red-700",
};

function StatusBadge({ status }: { status: FlashSaleStatus }) {
  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-xs font-medium capitalize",
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

export default function FlashSalesContent() {
  const { flashSales, loadingFlashSales, flashSalesError, fetchFlashSales, fetchFlashSale } =
    useFlashSaleStore();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSale, setSelectedSale] = React.useState<FlashSale | null>(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);

  React.useEffect(() => {
    void fetchFlashSales();
  }, [fetchFlashSales]);

  const rows = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = query
      ? flashSales.filter((sale) => sale.name.toLowerCase().includes(query))
      : flashSales;
    return list.map((sale) => {
      const status = resolveFlashSaleStatus(sale);
      return {
        ...sale,
        start: formatSaleDateTime(sale.starts_at),
        end: formatSaleDateTime(sale.ends_at),
        itemsCount: flashSaleItemsCount(sale),
        statusBadge: <StatusBadge status={status} />,
      };
    });
  }, [flashSales, searchQuery]);

  const columns = [
    { key: "name", label: "Name" },
    { key: "start", label: "Start" },
    { key: "end", label: "End" },
    { key: "statusBadge", label: "Status" },
    { key: "itemsCount", label: "Items" },
  ];

  const handleRowClick = async (row: { id: number }) => {
    const detailed = await fetchFlashSale(row.id);
    setSelectedSale(detailed ?? flashSales.find((sale) => sale.id === row.id) ?? null);
    setDetailsOpen(true);
  };

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-4 min-w-0">
        <div className="border border-[#F0F2F5] rounded-[8px] h-[38px] flex items-center gap-1 p-2 px-4 shadow-sm w-full min-w-0 max-w-md">
          <Image src="/icons/search.png" alt="Search" width={20} height={20} />
          <Input
            className="w-full placeholder:text-[#253B4B] border-0 outline-none focus-visible:ring-0 shadow-none"
            placeholder="Search flash sales"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {flashSalesError ? (
        <p className="text-sm text-red-600">{flashSalesError}</p>
      ) : null}

      {loadingFlashSales && flashSales.length === 0 ? (
        <p className="text-center my-5 text-[#667085]">Loading flash sales…</p>
      ) : rows.length === 0 ? (
        <p className="text-center my-5 text-[#667085]">
          {searchQuery.trim()
            ? "No flash sales match your search"
            : "No flash sales yet"}
        </p>
      ) : (
        <div className="min-w-0 overflow-x-auto">
          <DataTable
            columns={columns}
            rows={rows.map((row) => ({
              ...row,
              name: (
                <span className="font-medium text-[#101928]">{row.name}</span>
              ),
            }))}
            onRowClick={(row) => void handleRowClick(row)}
          />
        </div>
      )}

      <FlashSaleDetailsModal
        isOpen={detailsOpen}
        sale={selectedSale}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedSale(null);
        }}
        onEditClick={() => {
          setDetailsOpen(false);
          setEditOpen(true);
        }}
      />

      <CreateFlashSaleModal
        isOpen={editOpen}
        sale={selectedSale}
        onClose={() => {
          setEditOpen(false);
          setSelectedSale(null);
        }}
      />
    </div>
  );
}
