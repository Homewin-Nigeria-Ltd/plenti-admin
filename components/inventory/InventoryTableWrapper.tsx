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
import { Search, Plus, Ellipsis, ArrowRightLeft } from "lucide-react";
import { useInventoryStore } from "@/store/useInventoryStore";
import { useProductStore } from "@/store/useProductStore";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import type { InventoryItemApi } from "@/types/InventoryTypes";
import { DeleteInventoryModal } from "./DeleteInventoryModal";
import { TransferStockModal } from "./TransferStockModal";
import { RestockModal } from "./RestockModal";

const STOCK_STATUS_DISPLAY: Record<string, string> = {
  low_stock: "Low Stock",
  in_stock: "In Stock",
  high_stock: "High Stock",
  medium_stock: "Medium Stock",
};

function formatStockStatus(s: string) {
  const mapped = STOCK_STATUS_DISPLAY[s];
  return mapped != null ? mapped : (s || "In Stock");
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

  onAddStockClick: (warehouseId?: string | number) => void;
  warehouseId?: string | number;
};

export default function InventoryTableWrapper({
  onAddStockClick,
  warehouseId,
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
    warehouses,
    fetchWarehouses,
  } = useInventoryStore();

  React.useEffect(() => {
    if (!warehouseId && warehouses.length === 0) {
      fetchWarehouses();
    }
  }, [warehouseId, warehouses.length, fetchWarehouses]);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 400);
  const [selectedWarehouse, setSelectedWarehouse] = React.useState(
    warehouseId ? String(warehouseId) : "all"
  );
  const [hasRequested, setHasRequested] = React.useState(false);

  React.useEffect(() => {
    if (warehouseId) {
      setSelectedWarehouse(String(warehouseId));
    }
  }, [warehouseId]);
  const [itemToRestock, setItemToRestock] = React.useState<InventoryItemApi | null>(null);
  const [isRestockModalOpen, setIsRestockModalOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<InventoryItemApi | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = React.useState(false);
  const deleteProduct = useProductStore((s) => s.deleteProduct);

  React.useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  React.useEffect(() => {
    let cancelled = false;
    const searchTerm =
      typeof debouncedSearch === "string" ? debouncedSearch.trim() : "";
    const warehouseIdToUse =
      warehouseId || (selectedWarehouse !== "all" ? Number(selectedWarehouse) : undefined);
    (async () => {
      try {
        await fetchInventory({
          page: 1,
          search: searchTerm,
          warehouse_id: warehouseIdToUse,
        });
      } finally {
        if (!cancelled) setHasRequested(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, selectedWarehouse, warehouseId, fetchInventory]);

  const columns = [
    { key: "product", label: "Product" },
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
          quantity: (
            <span className="text-neutral-700 text-sm font-medium">
              {item.stock}
            </span>
          ),
          expiryDate: (
            <span className="text-neutral-700 text-sm">N/A</span>
          ),
          status: (
            <span className={`badge ${getStatusBadgeClass(statusDisplay)}`}>
              {statusDisplay}
            </span>
          ),
          batch: (
            <span className="text-neutral-700 text-sm">—</span>
          ),
          supplier: (
            <span className="text-neutral-700 text-sm">—</span>
          ),
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
                    setItemToRestock(item);
                    setIsRestockModalOpen(true);
                  }}
                >
                  Restock
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

  const isWarehouseDetailView =
    warehouseId != null && String(warehouseId).trim() !== "";

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:flex-1 sm:max-w-md">
          <div className="border border-neutral-300 rounded-[8px] h-[53px] flex items-center gap-2 p-2 px-4 w-full sm:max-w-[240px]">
            <Search className="size-5 text-neutral-500 shrink-0" />
            <Input
              className="w-full placeholder:text-primary-700 border-0 outline-none focus-visible:ring-0 shadow-none h-auto p-0 bg-transparent min-w-0"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {!isWarehouseDetailView && (
            <Select
              value={selectedWarehouse}
              onValueChange={setSelectedWarehouse}
            >
              <SelectTrigger className="form-control flex-1 sm:max-w-[200px]">
                <SelectValue placeholder="All Warehouse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Warehouse</SelectItem>
                {warehouses.map((wh) => (
                  <SelectItem key={wh.id} value={String(wh.id)}>
                    {wh.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        {isWarehouseDetailView ? (
          <Button
            onClick={() => setIsTransferModalOpen(true)}
            className="btn btn-primary w-full sm:w-auto shrink-0"
          >
            <ArrowRightLeft className="size-4 mr-2" />
            Transfer Stock
          </Button>
        ) : (
          <Button
            onClick={() =>
              onAddStockClick(
                warehouseId ??
                  (selectedWarehouse !== "all"
                    ? selectedWarehouse
                    : undefined)
              )
            }
            className="btn btn-primary w-full sm:w-auto shrink-0"
          >
            <Plus className="size-4 mr-2" />
            Add New Stock
          </Button>
        )}
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
            onPageChange={(nextPage) => {
              const warehouseIdToUse =
                warehouseId || (selectedWarehouse !== "all" ? Number(selectedWarehouse) : undefined);
              fetchInventory({
                page: nextPage,
                search: debouncedSearch,
                warehouse_id: warehouseIdToUse,
              });
            }}
          />
        ) : !hasRequested || loading ? (
          <div className="min-w-[720px]">
            <div className="grid grid-cols-7 gap-4 px-4 py-3 border-b border-neutral-100">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-24" />
              ))}
            </div>
            {Array.from({ length: Math.max(6, perPage) }).map((_, rowIdx) => (
              <div
                key={rowIdx}
                className="grid grid-cols-7 gap-4 px-4 py-4 border-b border-neutral-100"
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

      <RestockModal
        isOpen={isRestockModalOpen}
        onClose={() => {
          setIsRestockModalOpen(false);
          setItemToRestock(null);
        }}
        item={itemToRestock}
        onSuccess={() => {
          fetchInventory({
            page: currentPage,
            search: typeof debouncedSearch === "string" ? debouncedSearch.trim() : "",
            warehouse_id:
              warehouseId ||
              (selectedWarehouse !== "all" ? Number(selectedWarehouse) : undefined),
          });
        }}
        warehouseId={
          isWarehouseDetailView
            ? warehouseId
            : selectedWarehouse !== "all"
              ? selectedWarehouse
              : undefined
        }
      />
      <DeleteInventoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        item={itemToDelete}
        onConfirm={async () => {
          if (!itemToDelete) return;
          const ok = await deleteProduct(itemToDelete.id);
          if (ok) {
            toast.success("Product deleted successfully");
            fetchInventory({
              page: currentPage,
              search: typeof debouncedSearch === "string" ? debouncedSearch.trim() : "",
              warehouse_id:
                warehouseId ||
                (selectedWarehouse !== "all" ? Number(selectedWarehouse) : undefined),
            });
          } else {
            toast.error("Failed to delete product");
          }
        }}
      />
      {isWarehouseDetailView && (
        <TransferStockModal
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          fromWarehouseId={Number(warehouseId)}
          onSuccess={() => {
            fetchInventory({
              page: currentPage,
              search: typeof debouncedSearch === "string" ? debouncedSearch.trim() : "",
              warehouse_id: Number(warehouseId),
            });
          }}
        />
      )}
    </div>
  );
}
