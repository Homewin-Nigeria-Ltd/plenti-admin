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
      <DialogContent className="max-w-md p-6">
        <DialogTitle className="sr-only">
          Delete Product Confirmation
        </DialogTitle>
        <div className="space-y-6">
          <p className="text-center text-neutral-700 text-base font-medium">
            Are you sure you want to delete this product?
          </p>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              className="flex-1 border-primary text-primary hover:bg-primary/5">
              Delete Product
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-primary hover:bg-primary/90 text-white">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
