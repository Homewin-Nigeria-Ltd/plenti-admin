"use client";

import * as React from "react";
import {
  mockWarehouses,
  mockInventoryItems,
  mockRecentStock,
  mockStockLevel,
} from "@/data/inventory";
import WarehouseCard from "./WarehouseCard";
import StockLevelCard from "./StockLevelCard";
import RecentlyStockCard from "./RecentlyStockCard";
import InventoryTable from "./InventoryTable";
import { AddNewStockModal } from "./AddNewStockModal";

export default function InventoryManagement() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedWarehouse, setSelectedWarehouse] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [isAddStockModalOpen, setIsAddStockModalOpen] = React.useState(false);
  const pageSize = 10;

  const filteredItems = React.useMemo(() => {
    let filtered = mockInventoryItems;

    if (selectedWarehouse !== "all") {
      filtered = filtered.filter((item) => item.warehouseId === selectedWarehouse);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.productId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.batch.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.supplier.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedWarehouse, searchQuery]);

  React.useEffect(() => {
    setPage(1);
  }, [selectedWarehouse, searchQuery]);

  const paginatedItems = React.useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, page, pageSize]);

  const warehouses = React.useMemo(() => {
    return mockWarehouses.map((wh) => wh.id);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockWarehouses.map((warehouse) => (
          <WarehouseCard key={warehouse.id} warehouse={warehouse} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StockLevelCard stockLevel={mockStockLevel} />
        <RecentlyStockCard recentStocks={mockRecentStock} />
      </div>

      <div className="space-y-4">
     
        <InventoryTable
          items={paginatedItems}
          total={filteredItems.length}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedWarehouse={selectedWarehouse}
          onWarehouseChange={setSelectedWarehouse}
          warehouses={warehouses}
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
