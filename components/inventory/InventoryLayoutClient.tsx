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

export function InventoryLayoutClient() {
  const pathname = usePathname();
  const refreshTransfers = useTransfersStore((s) => s.refreshTransfers);
  const [isNewTransferModalOpen, setIsNewTransferModalOpen] =
    React.useState(false);
  const [stockAlertsCount, setStockAlertsCount] = React.useState<
    number | null
  >(null);
  const isStockTransferPage = pathname === "/inventory/stock-transfer";

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

  return (
    <div className="flex items-center justify-between gap-4 ">
      <InventoryTabNav stockAlertsCount={stockAlertsCount} />
      {isStockTransferPage && (
        <Button
          onClick={() => setIsNewTransferModalOpen(true)}
          className="bg-[#0B1E66] hover:bg-[#0B1E66] text-white shrink-0 h-[45px]"
        >
          <Plus className="size-4 mr-2 " />
          New Transfer
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
    </div>
  );
}
