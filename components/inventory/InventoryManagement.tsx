"use client";

import * as React from "react";
import {
  mockWarehouses,
  mockRecentStock,
  mockStockLevel,
} from "@/data/inventory";
import WarehouseCard from "./WarehouseCard";
import StockLevelCard from "./StockLevelCard";
import RecentlyStockCard from "./RecentlyStockCard";
import InventoryTableWrapper from "./InventoryTableWrapper";
import { AddNewStockModal } from "./AddNewStockModal";
import { useInventoryStore } from "@/store/useInventoryStore";
import type {
  Warehouse,
  StockLevel,
  RecentStock,
} from "@/types/InventoryTypes";

const PLACEHOLDER_PRODUCT_IMAGE = "https://ui-avatars.com/api/?name=P&size=56";

function useStatisticsMapped() {
  const { statistics, loadingStatistics } = useInventoryStore();

  const warehouses: Warehouse[] = React.useMemo(() => {
    if (!statistics?.warehouse_breakdown?.length) return mockWarehouses;
    return statistics.warehouse_breakdown.map((w) => ({
      id: w.warehouse_name.replace(/\s+/g, "-"),
      name: w.warehouse_name,
      units: Number(w.total_stock) || 0,
      fillPercentage: 0,
      manager: "",
      product_count: w.product_count,
      stock_value: w.stock_value,
    }));
  }, [statistics]);

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

  return { warehouses, stockLevel, recentStocks, loadingStatistics };
}

export default function InventoryManagement() {
  const [isAddStockModalOpen, setIsAddStockModalOpen] = React.useState(false);
  const { fetchInventoryStatistics } = useInventoryStore();
  const { warehouses, stockLevel, recentStocks, loadingStatistics } =
    useStatisticsMapped();

  React.useEffect(() => {
    fetchInventoryStatistics();
  }, [fetchInventoryStatistics]);

  return (
    <div className="space-y-6">
      {loadingStatistics ? (
        <div className="bg-white rounded-xl border border-[#EAECF0] p-8 shadow-xs flex items-center justify-center min-h-[240px]">
          <p className="text-neutral-500 text-sm">
            Loading inventory statistics…
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {warehouses.map((warehouse) => (
              <WarehouseCard key={warehouse.id} warehouse={warehouse} />
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <StockLevelCard stockLevel={stockLevel} />
            <RecentlyStockCard recentStocks={recentStocks.slice(0, 4)} />
          </div>
        </>
      )}

      <div className="space-y-4">
        <InventoryTableWrapper
          onAddStockClick={() => setIsAddStockModalOpen(true)}
        />
      </div>

      <AddNewStockModal
        isOpen={isAddStockModalOpen}
        onClose={() => setIsAddStockModalOpen(false)}
      />
    </div>
  );
}
