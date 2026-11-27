"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useInventoryStore } from "@/store/useInventoryStore";
import { Search } from "lucide-react";
import Image from "next/image";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import {
  qtyAtWarehouse,
  stockCellClass,
  stockCellTone,
  stockChipClass,
  warehouseColumns,
} from "./inventoryView";
import type { InventoryItemApi } from "@/types/InventoryTypes";

export default function InventoryStockView() {
  const {
    items,
    loading,
    currentPage,
    lastPage,
    totalItems,
    fetchInventory,
    warehouses,
    fetchWarehouses,
  } = useInventoryStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 400);
  const [selectedWarehouse, setSelectedWarehouse] = React.useState("all");

  React.useEffect(() => {
    if (warehouses.length === 0) fetchWarehouses({ per_page: 100 });
  }, [warehouses.length, fetchWarehouses]);

  React.useEffect(() => {
    fetchInventory({
      page: 1,
      search: debouncedSearch.trim(),
      warehouse_id:
        selectedWarehouse === "all" ? undefined : Number(selectedWarehouse),
    });
  }, [debouncedSearch, selectedWarehouse, fetchInventory]);

  const columns = warehouseColumns(warehouses);
  const showSearchResults = debouncedSearch.trim().length >= 2;

  return (
    <div className="space-y-5">
      <div className="overflow-x-auto">
        <div className="flex min-w-max items-center gap-1">
          <WarehouseChip
            active={selectedWarehouse === "all"}
            onClick={() => setSelectedWarehouse("all")}
          >
            All warehouses
          </WarehouseChip>
          {columns.map((wh) => (
            <WarehouseChip
              key={wh.id}
              active={selectedWarehouse === String(wh.id)}
              onClick={() => setSelectedWarehouse(String(wh.id))}
            >
              {wh.name}
            </WarehouseChip>
          ))}
        </div>
      </div>

      <section className="rounded-xl border border-[#EAECF0] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#101828]">
          Search every warehouse
        </h2>
        <p className="mt-0.5 text-xs text-[#667085]">
          Out of stock where you want it? See which warehouse has it and
          transfer.
        </p>
        <div className="mt-3 flex h-10 items-center gap-2 rounded-lg border border-[#EAECF0] bg-white px-3">
          <Search className="size-4 shrink-0 text-[#98A2B3]" />
          <Input
            className="h-9 border-0 p-0 shadow-none placeholder:text-[#98A2B3] focus-visible:ring-0"
            placeholder="Search name, SKU or category"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {showSearchResults ? (
          <div className="mt-3 space-y-3">
            {loading ? (
              <Skeleton className="h-28 w-full rounded-xl" />
            ) : items.length === 0 ? (
              <p className="py-6 text-center text-sm text-[#667085]">
                No products match that search.
              </p>
            ) : (
              items.slice(0, 3).map((item) => (
                <SearchResultCard
                  key={item.id}
                  item={item}
                  columns={columns}
                />
              ))
            )}
          </div>
        ) : null}
      </section>

      <section className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-[#101828]">
            Stock by warehouse
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#667085]">
            <LegendDot className="bg-[#F04438]" /> Out of stock
            <LegendDot className="bg-[#F79009]" /> Low
            <LegendDot className="bg-[#15B79E]" /> Get somewhere
            <LegendDot className="bg-[#12B76A]" /> In stock
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#EAECF0] bg-white">
          {loading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#667085]">
              No inventory items found matching your search criteria.
            </p>
          ) : (
            <table className="min-w-[760px] w-full text-left">
              <thead>
                <tr className="border-b border-[#EAECF0] text-[12px] font-medium text-[#667085]">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-3 py-3">Category</th>
                  {columns.map((wh) => (
                    <th key={wh.id} className="px-3 py-3">
                      {wh.name}
                    </th>
                  ))}
                  <th className="px-3 py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const total = Number(item.stock) || 0;
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-[#EAECF0] last:border-0"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative size-9 shrink-0 overflow-hidden rounded-lg bg-[#F8FAFC]">
                            {item.image_url ? (
                              <Image
                                src={item.image_url}
                                alt={item.name}
                                fill
                                className="object-contain p-1"
                                unoptimized
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-medium text-[#101828]">
                              {item.name || "-"}
                            </p>
                            <p className="text-[12px] text-[#98A2B3]">
                              {item.sku || `SKU-${item.id}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-[13px] text-[#344054]">
                        {item.category?.name || "-"}
                      </td>
                      {columns.map((wh) => {
                        const qty = qtyAtWarehouse(item, wh.id, columns);
                        return (
                          <td
                            key={wh.id}
                            className={cn(
                              "px-3 py-3 text-[13px]",
                              stockCellClass(stockCellTone(qty)),
                            )}
                          >
                            {qty}
                          </td>
                        );
                      })}
                      <td className="px-3 py-3 text-[13px] font-semibold text-[#101828]">
                        {total}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#667085]">
            <span className="mr-3 text-[#B42318]">Out of stock</span>
            <button
              type="button"
              className="font-medium text-[#0B1E66]"
              onClick={() => toast.info("Open a transfer from the search results")}
            >
              Review transfer next
            </button>
            <span className="ml-3">
              Showing {items.length} of {totalItems.toLocaleString("en-US")}
            </span>
          </p>
          {lastPage > 1 ? (
            <div className="flex gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() =>
                  fetchInventory({
                    page: currentPage - 1,
                    search: debouncedSearch.trim(),
                    warehouse_id:
                      selectedWarehouse === "all"
                        ? undefined
                        : Number(selectedWarehouse),
                  })
                }
                className="h-9 rounded-lg border border-[#EAECF0] px-3 text-[13px] font-medium text-[#344054] disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={currentPage >= lastPage}
                onClick={() =>
                  fetchInventory({
                    page: currentPage + 1,
                    search: debouncedSearch.trim(),
                    warehouse_id:
                      selectedWarehouse === "all"
                        ? undefined
                        : Number(selectedWarehouse),
                  })
                }
                className="h-9 rounded-lg border border-[#EAECF0] px-3 text-[13px] font-medium text-[#344054] disabled:opacity-50"
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function WarehouseChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1.5 text-[13px] font-medium whitespace-nowrap",
        active
          ? "bg-[#0B1E66] text-white"
          : "text-[#667085] hover:bg-[#F2F4F7]",
      )}
    >
      {children}
    </button>
  );
}

function LegendDot({ className }: { className: string }) {
  return (
    <span className={cn("inline-block size-2 rounded-full", className)} />
  );
}

function SearchResultCard({
  item,
  columns,
}: {
  item: InventoryItemApi;
  columns: Array<{ id: number; name: string }>;
}) {
  const total = Number(item.stock) || 0;
  return (
    <div className="rounded-xl border border-[#EAECF0] p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-[#F8FAFC]">
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                className="object-contain p-1"
                unoptimized
              />
            ) : null}
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#101828]">
              {item.name}
            </p>
            <p className="text-[12px] text-[#667085]">
              {item.sku || `SKU-${item.id}`} · {item.category?.name || "-"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {columns.map((wh) => {
            const qty = qtyAtWarehouse(item, wh.id, columns);
            const tone = stockCellTone(qty);
            return (
              <div
                key={wh.id}
                className={cn(
                  "min-w-36 rounded-lg border px-3 py-2",
                  stockChipClass(tone),
                )}
              >
                <p className="text-[12px] font-medium">{wh.name}</p>
                <p className="text-[12px]">
                  {qty <= 0 ? "Out of stock" : `${qty} in stock`}
                </p>
              </div>
            );
          })}
          <div className="min-w-20 px-2 text-right">
            <p className="text-[16px] font-semibold text-[#101828]">{total}</p>
            <p className="text-[11px] text-[#98A2B3]">in total</p>
          </div>
          <button
            type="button"
            className="h-8 rounded-lg border border-[#D0D5DD] px-3 text-[12px] font-medium text-[#344054]"
            onClick={() => toast.info("Use New Stock Transfer to move units")}
          >
            Track
          </button>
        </div>
      </div>
    </div>
  );
}
