"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
// import { mockRecentStock, mockStockLevel } from "@/data/inventory";
// import StockLevelCard from "./StockLevelCard";
// import RecentlyStockCard from "./RecentlyStockCard";
import InventoryTableWrapper from "./InventoryTableWrapper";
import { useInventoryStore } from "@/store/useInventoryStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
// import type { StockLevel, RecentStock } from "@/types/InventoryTypes";
import { Skeleton } from "@/components/ui/skeleton";

// const PLACEHOLDER_PRODUCT_IMAGE = "https://ui-avatars.com/api/?name=P&size=56";

// function useStatisticsMapped() {
//   const { statistics, loadingStatistics } = useInventoryStore();

//   const stockLevel: StockLevel = React.useMemo(() => {
//     if (!statistics?.stock_level_breakdown) return mockStockLevel;
//     const b = statistics.stock_level_breakdown;
//     return {
//       activeInStock: Number(statistics.total_stock_quantity) || 0,
//       highStock: b.in_stock.percentage,
//       mediumStock: b.low_stock.percentage,
//       lowStock: b.out_of_stock.percentage,
//       highStockItems: b.in_stock.count,
//       mediumStockItems: b.low_stock.count,
//       lowStockItems: b.out_of_stock.count,
//     };
//   }, [statistics]);

//   const recentStocks: RecentStock[] = React.useMemo(() => {
//     if (!statistics?.recent_stocks?.length) return mockRecentStock;
//     return statistics.recent_stocks.map((s) => ({
//       id: String(s.id),
//       productName: s.name,
//       productImage: PLACEHOLDER_PRODUCT_IMAGE,
//       purchasedBy: "—",
//       quantity: s.stock,
//       category: s.category,
//       price: s.price,
//     }));
//   }, [statistics]);

//   return { stockLevel, recentStocks, loadingStatistics };
// }

type WarehouseDetailViewProps = {
  warehouseId: string;
};

export default function WarehouseDetailView({
  warehouseId,
}: WarehouseDetailViewProps) {
  const router = useRouter();
  const {
    fetchInventoryStatistics,
    warehouses,
    loadingWarehouses,
    fetchWarehouses,
  } = useInventoryStore();
  // const { stockLevel, recentStocks, loadingStatistics } = useStatisticsMapped();

  React.useEffect(() => {
    fetchInventoryStatistics();
    fetchWarehouses();
  }, [fetchInventoryStatistics, fetchWarehouses]);

  const warehouse = React.useMemo(() => {
    return warehouses.find((w) => String(w.id) === warehouseId);
  }, [warehouses, warehouseId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="shrink-0"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div className="flex-1">
          {loadingWarehouses ? (
            <div className="space-y-2">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          ) : warehouse ? (
            <div>
              <h1 className="text-2xl font-semibold text-[#101928]">
                {warehouse.name}
              </h1>
              <p className="text-sm text-neutral-500 mt-1">
                {warehouse.location} · Manager: {warehouse.manager}
              </p>
              {warehouse.description && (
                <p className="text-sm text-neutral-600 mt-2">
                  {warehouse.description}
                </p>
              )}
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-semibold text-[#101928]">
                Warehouse Not Found
              </h1>
            </div>
          )}
        </div>
      </div>

      {/* {!loadingStatistics && (
        <div className="grid grid-col-1 md:grid-cols-2 gap-4">
          <StockLevelCard stockLevel={stockLevel} />
          <RecentlyStockCard recentStocks={recentStocks.slice(0, 4)} />
        </div>
      )} */}

      <div className="space-y-4">
        <InventoryTableWrapper
          onAddStockClick={() => {}}
          warehouseId={warehouseId}
        />
      </div>
    </div>
  );
}
