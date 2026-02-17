"use client";

import * as React from "react";
import {
  mockRecentStock,
  mockStockLevel,
} from "@/data/inventory";
import WarehouseCard from "./WarehouseCard";
import StockLevelCard from "./StockLevelCard";
import RecentlyStockCard from "./RecentlyStockCard";
import InventoryTableWrapper from "./InventoryTableWrapper";
import { AddNewStockModal } from "./AddNewStockModal";
import { AddWarehouseModal } from "./AddWarehouseModal";
import { useInventoryStore } from "@/store/useInventoryStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import type {
  Warehouse,
  StockLevel,
  RecentStock,
} from "@/types/InventoryTypes";

const PLACEHOLDER_PRODUCT_IMAGE = "https://ui-avatars.com/api/?name=P&size=56";

function useStatisticsMapped() {
  const { statistics, loadingStatistics } = useInventoryStore();

  const stockLevel: StockLevel = React.useMemo(() => {
    if (!statistics?.stock_level_breakdown) return mockStockLevel;
    const b = statistics.stock_level_breakdown;
    return {
      activeInStock: Number(statistics.total_stock_quantity) || 0,
      highStock: b.in_stock.percentage,
      mediumStock: b.low_stock.percentage,
      lowStock: b.out_of_stock.percentage,
      highStockItems: b.in_stock.count,
      mediumStockItems: b.low_stock.count,
      lowStockItems: b.out_of_stock.count,
    };
  }, [statistics]);

  const recentStocks: RecentStock[] = React.useMemo(() => {
    if (!statistics?.recent_stocks?.length) return mockRecentStock;
    return statistics.recent_stocks.map((s) => ({
      id: String(s.id),
      productName: s.name,
      productImage: PLACEHOLDER_PRODUCT_IMAGE,
      purchasedBy: "—",
      quantity: s.stock,
      category: s.category,
      price: s.price,
    }));
  }, [statistics]);

  return { stockLevel, recentStocks, loadingStatistics };
}

export default function InventoryManagement() {
  const [isAddStockModalOpen, setIsAddStockModalOpen] = React.useState(false);
  const [addStockWarehouseId, setAddStockWarehouseId] = React.useState<
    string | number | undefined
  >(undefined);
  const [isAddWarehouseModalOpen, setIsAddWarehouseModalOpen] =
    React.useState(false);
  const {
    fetchInventoryStatistics,
    warehouses,
    loadingWarehouses,
    fetchWarehouses,
  } = useInventoryStore();
  const { stockLevel, recentStocks, loadingStatistics } =
    useStatisticsMapped();

  const [hasFetchedWarehouses, setHasFetchedWarehouses] = React.useState(false);

  React.useEffect(() => {
    fetchInventoryStatistics();
    const loadWarehouses = async () => {
      await fetchWarehouses();
      setHasFetchedWarehouses(true);
    };
    loadWarehouses();
  }, [fetchInventoryStatistics, fetchWarehouses]);

  const mappedWarehouses: Warehouse[] = React.useMemo(() => {
    return warehouses.map((w) => ({
      id: String(w.id),
      name: w.name,
      units: w.total_units,
      fillPercentage: 0,
      manager: w.manager,
      product_count: w.total_products,
      stock_value: String(w.total_worth),
    }));
  }, [warehouses]);

  const handleWarehouseSuccess = () => {
    fetchWarehouses();
  };

  return (
    <div className="space-y-6">
          <div className="flex items-center justify-end">
            <Button
              onClick={() => setIsAddWarehouseModalOpen(true)}
              className="bg-[#0B1E66] hover:bg-[#0B1E66] text-white"
            >
              <Plus className="size-4 mr-2" />
              Add Warehouse
            </Button>
          </div>

      {loadingWarehouses || !hasFetchedWarehouses ? (
        <div className="overflow-x-auto">
          <div className="flex gap-4" style={{ width: "500px" }}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="min-w-[280px] sm:min-w-[300px] shrink-0">
                <div className="bg-white rounded-xl border border-[#EAECF0] p-4 sm:p-5 shadow-xs">
                  <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <div className="mb-2 sm:mb-3">
                    <Skeleton className="h-8 w-24 mb-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div>
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : warehouses.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="flex gap-4" style={{ width: "500px" }}>
            {mappedWarehouses.map((warehouse) => (
              <div key={warehouse.id} className="min-w-[280px] sm:min-w-[300px] shrink-0">
                <WarehouseCard warehouse={warehouse} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#EAECF0] p-8 shadow-xs">
          <p className="text-neutral-500 text-sm text-center">
            No warehouses found. Click &quot;Add Warehouse&quot; to create one.
          </p>
        </div>
      )}

      {!loadingStatistics && (
        <div className="grid grid-col-1 md:grid-cols-2 gap-4">
          <StockLevelCard stockLevel={stockLevel} />
          <RecentlyStockCard recentStocks={recentStocks.slice(0, 4)} />
        </div>
      )}

      <div className="space-y-4">
        <InventoryTableWrapper
          onAddStockClick={(warehouseId) => {
            setAddStockWarehouseId(warehouseId);
            setIsAddStockModalOpen(true);
          }}
        />
      </div>

      <AddNewStockModal
        isOpen={isAddStockModalOpen}
        onClose={() => {
          setIsAddStockModalOpen(false);
          setAddStockWarehouseId(undefined);
        }}
        warehouseId={addStockWarehouseId}
      />

      <AddWarehouseModal
        isOpen={isAddWarehouseModalOpen}
        onClose={() => setIsAddWarehouseModalOpen(false)}
        onSuccess={handleWarehouseSuccess}
      />
    </div>
  );
}
