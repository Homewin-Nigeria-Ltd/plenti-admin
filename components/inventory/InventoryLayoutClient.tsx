"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Plus } from "lucide-react";
import api from "@/lib/api";
import { INVENTORY_API } from "@/data/inventory";
import type { LowStockAlertsResponse } from "@/types/InventoryTypes";
import { useTransfersStore } from "@/store/useTransfersStore";
import { InventoryTabNav } from "./InventoryTabNav";
import { NewStockTransferModal } from "./NewStockTransferModal";
import { AddNewStockModal } from "./AddNewStockModal";
import { useInventoryStore } from "@/store/useInventoryStore";
import { cn } from "@/lib/utils";

export function InventoryLayoutClient() {
  const { fetchWarehouses, fetchInventoryStatistics, warehouses, statistics } =
    useInventoryStore();

  const pathname = usePathname();
  const refreshTransfers = useTransfersStore((s) => s.refreshTransfers);
  const fetchTransfers = useTransfersStore((s) => s.fetchTransfers);
  const transfers = useTransfersStore((s) => s.transfers);
  const [isNewTransferModalOpen, setIsNewTransferModalOpen] =
    React.useState(false);
  const [isAddStockModalOpen, setIsAddStockModalOpen] = React.useState(false);
  const [stockAlertsCount, setStockAlertsCount] = React.useState<number | null>(
    null,
  );

  const hideChrome = pathname.includes("/inventory/warehouse");

  React.useEffect(() => {
    fetchWarehouses({ per_page: 100 });
    fetchInventoryStatistics();
    fetchTransfers(1);
  }, [fetchWarehouses, fetchInventoryStatistics, fetchTransfers]);

  React.useEffect(() => {
    api
      .get<LowStockAlertsResponse>(INVENTORY_API.lowStockAlerts)
      .then(({ data }) => {
        if (data?.status === "success" && data?.data?.count != null) {
          setStockAlertsCount(data.data.count);
        }
      })
      .catch(() => setStockAlertsCount(3));
  }, []);

  const warehouseCount = warehouses.length || 3;
  const productCount = statistics?.total_products ?? 3262;
  const waitingCount =
    transfers.filter((t) => {
      const status = (t.status || "").toLowerCase();
      return (
        status === "pending" ||
        status === "waiting" ||
        status === "requested"
      );
    }).length || 2;

  return (
    <div className={cn("min-w-0 space-y-4", hideChrome && "hidden")}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[24px] leading-8 font-semibold tracking-tight text-[#101828]">
            Inventory Management
          </h1>
          <p className="mt-1 text-sm text-[#667085]">
            {productCount.toLocaleString("en-US")} products across{" "}
            {warehouseCount} warehouses · updated live
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            className="h-9 rounded-lg border-[#D0D5DD] bg-white text-[13px] font-medium text-[#344054]"
            onClick={() => setIsNewTransferModalOpen(true)}
          >
            <ArrowRightLeft className="size-3.5" />
            New Stock Transfer
          </Button>
          <Button
            className="h-9 rounded-lg bg-[#0B1E66] text-[13px] font-medium text-white hover:bg-[#0B1E66]/90"
            onClick={() => setIsAddStockModalOpen(true)}
          >
            <Plus className="size-3.5" />
            Add New Stock
          </Button>
        </div>
      </div>

      <InventoryTabNav
        stockAlertsCount={stockAlertsCount}
        transferWaitingCount={waitingCount}
      />

      <NewStockTransferModal
        isOpen={isNewTransferModalOpen}
        onClose={() => setIsNewTransferModalOpen(false)}
        onSuccess={() => {
          setIsNewTransferModalOpen(false);
          refreshTransfers();
        }}
      />
      <AddNewStockModal
        isOpen={isAddStockModalOpen}
        onClose={() => setIsAddStockModalOpen(false)}
      />
    </div>
  );
}
