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

export default function InventoryManagement() {
  const [isAddStockModalOpen, setIsAddStockModalOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockWarehouses.map((warehouse) => (
          <WarehouseCard key={warehouse.id} warehouse={warehouse} />
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        <StockLevelCard stockLevel={mockStockLevel} />
        <RecentlyStockCard recentStocks={mockRecentStock} />
      </div>

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
