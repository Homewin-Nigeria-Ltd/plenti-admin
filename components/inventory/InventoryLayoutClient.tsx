"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import api from "@/lib/api";
import { INVENTORY_API } from "@/data/inventory";
import type { LowStockAlertsResponse } from "@/types/InventoryTypes";
import { useTransfersStore } from "@/store/useTransfersStore";
import { InventoryTabNav } from "./InventoryTabNav";
import { NewStockTransferModal } from "./NewStockTransferModal";
import { AddWarehouseModal } from "./AddWarehouseModal";
import { useInventoryStore } from "@/store/useInventoryStore";
import { cn } from "@/lib/utils";

export function InventoryLayoutClient() {
  const { fetchWarehouses } = useInventoryStore();

  const pathname = usePathname();
  const refreshTransfers = useTransfersStore((s) => s.refreshTransfers);
  const [isNewTransferModalOpen, setIsNewTransferModalOpen] =
    React.useState(false);
  const [isAddWarehouseModalOpen, setIsAddWarehouseModalOpen] =
    React.useState(false);
  const [stockAlertsCount, setStockAlertsCount] = React.useState<number | null>(
    null
  );
  const isStockTransferPage = pathname === "/inventory/stock-transfer";
  const isOverview = pathname === "/inventory";

  React.useEffect(() => {
    api
      .get<LowStockAlertsResponse>(INVENTORY_API.lowStockAlerts)
      .then(({ data }) => {
        if (data?.status === "success" && data?.data?.count != null) {
          setStockAlertsCount(data.data.count);
        }
      })
      .catch(() => setStockAlertsCount(0));
  }, []);

  const handleWarehouseSuccess = () => {
    fetchWarehouses();
  };

  return (
    <div
      className={cn(
        "items-center justify-between gap-5",
        pathname.includes("/inventory/warehouse") ? "hidden" : "flex"
      )}
    >
      <InventoryTabNav stockAlertsCount={stockAlertsCount} />
      {isStockTransferPage && (
        <Button
          onClick={() => setIsNewTransferModalOpen(true)}
          className="bg-[#0B1E66] hover:bg-[#0B1E66] text-white shrink-0 h-11.25"
        >
          <Plus className="size-4 mr-2 " />
          New Transfer
        </Button>
      )}

      {isOverview && (
        <Button
          onClick={() => setIsAddWarehouseModalOpen(true)}
          className="bg-[#0B1E66] hover:bg-[#0B1E66] text-white shrink-0 h-11.25"
        >
          <Plus className="size-4 mr-2 " />
          Add Warehouse
        </Button>
      )}
      {isStockTransferPage && (
        <NewStockTransferModal
          isOpen={isNewTransferModalOpen}
          onClose={() => setIsNewTransferModalOpen(false)}
          onSuccess={() => {
            setIsNewTransferModalOpen(false);
            refreshTransfers();
          }}
        />
      )}

      {isOverview && (
        <AddWarehouseModal
          isOpen={isAddWarehouseModalOpen}
          onClose={() => setIsAddWarehouseModalOpen(false)}
          onSuccess={handleWarehouseSuccess}
        />
      )}
    </div>
  );
}
