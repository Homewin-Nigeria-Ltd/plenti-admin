"use client";

import * as React from "react";
import DataTable from "@/components/common/DataTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, Ellipsis } from "lucide-react";
import { useInventoryStore } from "@/store/useInventoryStore";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import type { InventoryItemApi } from "@/types/InventoryTypes";
import { mockWarehouses } from "@/data/inventory";
import { EditInventoryModal } from "./EditInventoryModal";
import { DeleteInventoryModal } from "./DeleteInventoryModal";

const STOCK_STATUS_DISPLAY: Record<string, string> = {
  low_stock: "Low Stock",
  in_stock: "In Stock",
  high_stock: "High Stock",
  medium_stock: "Medium Stock",
};

function formatStockStatus(s: string) {
  const mapped = STOCK_STATUS_DISPLAY[s];
  return mapped != null ? mapped : s || "In Stock";
}

function getStatusBadgeClass(displayStatus: string) {
  switch (displayStatus) {
    case "High Stock":
    case "In Stock":
      return "badge-success";
    case "Medium Stock":
      return "badge-warning";
    case "Low Stock":
      return "badge-danger";
    default:
      return "badge-neutral";
  }
}

type InventoryTableWrapperProps = {
  onAddStockClick: () => void;
};

const WAREHOUSES = mockWarehouses.map((wh) => wh.id);

export default function InventoryTableWrapper({
  onAddStockClick,
}: InventoryTableWrapperProps) {
  const {
    items,
    loading,
    error,
    clearError,
    currentPage,
    lastPage,
    perPage,
    totalItems,
    fetchInventory,
  } = useInventoryStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 400);
  const [selectedWarehouse, setSelectedWarehouse] = React.useState("all");
  const [hasRequested, setHasRequested] = React.useState(false);
  const [selectedItem, setSelectedItem] =
    React.useState<InventoryItemApi | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] =
    React.useState<InventoryItemApi | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  React.useEffect(() => {
    let cancelled = false;
    const searchTerm =
      typeof debouncedSearch === "string" ? debouncedSearch.trim() : "";
    (async () => {
      try {
        await fetchInventory({ page: 1, search: searchTerm });
      } finally {
        if (!cancelled) setHasRequested(true);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const columns = [
    { key: "product", label: "Product" },
    { key: "warehouse", label: "Warehouse" },
    { key: "quantity", label: "Quantity" },
    { key: "expiryDate", label: "Expiry Date" },
    { key: "status", label: "Status" },
    { key: "batch", label: "Batch" },
    { key: "supplier", label: "Supplier" },
    { key: "actions", label: "Actions" },
  ];

  const tableRows = React.useMemo(
    () =>
      items.map((item) => {
        const statusDisplay = formatStockStatus(item.stock_status);
        return {
          product: (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden shrink-0 bg-neutral-100">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-primary-700 text-xs sm:text-sm truncate">
                  {item.name || "—"}
                </p>
                <p className="text-neutral-500 text-xs truncate">
                  ID: {item.sku ?? item.id ?? "—"}
                </p>
              </div>
            </div>
          ),
          warehouse: <span className="text-neutral-700 text-sm">—</span>,
          quantity: (
            <span className="text-neutral-700 text-sm font-medium">
              {item.stock}
            </span>
          ),
          expiryDate: <span className="text-neutral-700 text-sm">N/A</span>,
          status: (
            <span className={`badge ${getStatusBadgeClass(statusDisplay)}`}>
              {statusDisplay}
            </span>
          ),
          batch: <span className="text-neutral-700 text-sm">—</span>,
          supplier: <span className="text-neutral-700 text-sm">—</span>,
          actions: (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Ellipsis className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedItem(item);
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-danger-500"
                  onClick={() => {
                    setItemToDelete(item);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        };
      }),
    [items]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-[80%]">
          <div className="border border-neutral-300 rounded-[8px] h-[53px] flex items-center gap-2 p-2 px-4 flex-1">
            <Search className="size-5 text-neutral-500 shrink-0" />
            <Input
              className="w-full placeholder:text-primary-700 border-0 outline-none focus-visible:ring-0 shadow-none h-auto p-0 bg-transparent"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={selectedWarehouse}
            onValueChange={setSelectedWarehouse}
          >
            <SelectTrigger className="form-control flex-1">
              <SelectValue placeholder="All Warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Warehouse</SelectItem>
              {WAREHOUSES.map((wh) => (
                <SelectItem key={wh} value={wh}>
                  {wh}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={onAddStockClick}
          className="btn btn-primary w-full sm:w-[20%] shrink-0"
        >
          <Plus className="size-4 mr-2" />
          Add New Stock
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-[#EEF1F6] shadow-xs">
        {hasRequested && !loading && items.length > 0 ? (
          <DataTable
            columns={columns}
            rows={tableRows}
            page={currentPage}
            pageCount={lastPage}
            pageSize={perPage}
            total={totalItems}
            onPageChange={(nextPage) =>
              fetchInventory({ page: nextPage, search: debouncedSearch })
            }
          />
        ) : !hasRequested || loading ? (
          <div className="min-w-[720px]">
            <div className="grid grid-cols-8 gap-4 px-4 py-3 border-b border-neutral-100">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-24" />
              ))}
            </div>
            {Array.from({ length: Math.max(6, perPage) }).map((_, rowIdx) => (
              <div
                key={rowIdx}
                className="grid grid-cols-8 gap-4 px-4 py-4 border-b border-neutral-100"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-lg shrink-0" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded" />
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
          <p className="text-center py-8 text-[#667085]">
            No inventory items found matching your search criteria.
          </p>
        )}
      </div>

      <EditInventoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        warehouses={WAREHOUSES}
      />
      <DeleteInventoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        item={itemToDelete}
        onConfirm={() => {
          if (itemToDelete)
            console.log("Delete inventory item:", itemToDelete.id);
        }}
      />
    </div>
  );
}
