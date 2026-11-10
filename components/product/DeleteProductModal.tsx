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
import type { Product } from "@/data/products";
import { toast } from "sonner";
import { useProductStore } from "@/store/useProductStore";

type DeleteProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
};

export function DeleteProductModal({
  isOpen,
  onClose,
  product,
}: DeleteProductModalProps) {
  const { deleteProduct, deletingById } = useProductStore();
  const isDeleting = !!deletingById[String(product?.id ?? "")];

  const handleDelete = async () => {
    if (!product) return;
    const ok = await deleteProduct(product.id);
    if (ok) {
      toast.success("Product deleted successfully");
      onClose();
    } else {
      toast.error("Failed to delete product");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md p-4 sm:p-6 w-[95vw] sm:w-full"
        showCloseButton={false}
      >
        <DialogHeader className="relative">
          <DialogTitle className="text-xs sm:text-[16px] font-semibold text-center text-[#0B1E66]">
            Are you sure you want to delete this product?
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              disabled={!product || isDeleting}
              className="btn btn-outline flex-1 order-2 sm:order-1 rounded-[6px]"
            >
              {isDeleting ? "Deleting..." : "Delete Product"}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="btn btn-primary flex-1 order-1 sm:order-2 rounded-[6px]"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type BulkDeleteProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  productIds: number[];
  onDeleted?: () => void;
};

export function BulkDeleteProductModal({
  isOpen,
  onClose,
  productIds,
  onDeleted,
}: BulkDeleteProductModalProps) {
  const { bulkDeleteProducts, bulkDeleting } = useProductStore();
  const count = productIds.length;

  const handleDelete = async () => {
    if (count === 0) return;
    const { ok, notFoundIds } = await bulkDeleteProducts(productIds);
    if (!ok) {
      toast.error(
        useProductStore.getState().bulkDeleteError ??
          "Failed to delete products",
      );
      return;
    }
    if (notFoundIds.length > 0) {
      toast.success(
        `Deleted selected products. ${notFoundIds.length} could not be found.`,
      );
    } else {
      toast.success(
        count === 1
          ? "Product deleted successfully"
          : `${count} products deleted successfully`,
      );
    }
    onDeleted?.();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !bulkDeleting) onClose();
      }}
    >
      <DialogContent
        className="max-w-md p-4 sm:p-6 w-[95vw] sm:w-full"
        showCloseButton={false}
      >
        <DialogHeader className="relative">
          <DialogTitle className="text-xs sm:text-[16px] font-semibold text-center text-[#0B1E66]">
            {count === 1
              ? "Are you sure you want to delete this product?"
              : `Are you sure you want to delete ${count} products?`}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-[#667085]">
            Products on past orders are kept on those orders. This cannot be
            undone for the rest.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => void handleDelete()}
              disabled={count === 0 || bulkDeleting}
              className="btn btn-outline flex-1 order-2 sm:order-1 rounded-[6px]"
            >
              {bulkDeleting
                ? "Deleting..."
                : count === 1
                  ? "Delete Product"
                  : "Delete Selected"}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              disabled={bulkDeleting}
              className="btn btn-primary flex-1 order-1 sm:order-2 rounded-[6px]"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
