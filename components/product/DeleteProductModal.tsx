"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";
import { toast } from "sonner";

type DeleteProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirm: () => void;
};

export function DeleteProductModal({
  isOpen,
  onClose,
  product,
  onConfirm,
}: DeleteProductModalProps) {
  const handleDelete = () => {
    onConfirm();
    toast.error("Product deleted successfully");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-4 sm:p-6 w-[95vw] sm:w-full">
        <DialogTitle className="sr-only">
          Delete Product Confirmation
        </DialogTitle>
        <div className="space-y-4 sm:space-y-6">
          <p className="text-center text-neutral-700 text-sm sm:text-base font-medium">
            Are you sure you want to delete this product?
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              className="flex-1 border-primary text-primary hover:bg-primary/5 order-2 sm:order-1">
              Delete Product
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-primary hover:bg-primary/90 text-white order-1 sm:order-2">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
