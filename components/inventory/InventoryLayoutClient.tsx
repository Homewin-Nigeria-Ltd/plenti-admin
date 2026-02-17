"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InventoryTabNav } from "./InventoryTabNav";
import { NewStockTransferModal } from "./NewStockTransferModal";

export function InventoryLayoutClient() {
  const pathname = usePathname();
  const [isNewTransferModalOpen, setIsNewTransferModalOpen] =
    React.useState(false);
  const isStockTransferPage = pathname === "/inventory/stock-transfer";

  return (
    <div className="flex items-center justify-between gap-4 ">
      <InventoryTabNav />
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
          onSuccess={() => setIsNewTransferModalOpen(false)}
        />
      )}
    </div>
  );
}
