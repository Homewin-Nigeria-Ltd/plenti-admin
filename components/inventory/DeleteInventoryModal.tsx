"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { InventoryItemApi } from "@/types/InventoryTypes";

type DeleteInventoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItemApi | null;
  onConfirm: () => void | Promise<void>;
};

export function DeleteInventoryModal({
  isOpen,
  onClose,
  item,
  onConfirm,
}: DeleteInventoryModalProps) {
  const [deleting, setDeleting] = React.useState(false);
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md p-4 sm:p-6 w-[95vw] sm:w-full"
        showCloseButton={false}>
        <DialogHeader className="relative">
          <DialogTitle className="text-xl sm:text-2xl font-semibold">
            Delete Inventory Item
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-neutral-500">
            {item
              ? `Are you sure you want to delete "${item.name}"?`
              : "Are you sure you want to delete this inventory item?"}
          </DialogDescription>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-0 right-0 flex items-center justify-center size-[30px] bg-[#E8EEFF] rounded-full">
            <X color="#0B1E66" size={20} cursor="pointer" />
          </button>
        </DialogHeader>
        <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              disabled={!item || deleting}
              className="btn btn-outline flex-1 order-2 sm:order-1">
              {deleting ? "Deleting…" : "Delete Item"}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="btn btn-primary flex-1 order-1 sm:order-2">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
