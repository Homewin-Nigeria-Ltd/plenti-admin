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
import { Input } from "@/components/ui/input";
import type { Product } from "@/data/products";
import { toast } from "sonner";
import { useProductStore } from "@/store/useProductStore";
import { productSku } from "./productManagementView";
import Image from "next/image";
import { productDisplayImages } from "@/lib/mappers/products";
import { AlertCircle } from "lucide-react";

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
  const sku = product ? productSku(product) : "";
  const [confirmText, setConfirmText] = React.useState("");
  const imageUrl = product
    ? productDisplayImages(product)[0] ?? product.imageUrl
    : "";

  React.useEffect(() => {
    if (!isOpen) setConfirmText("");
  }, [isOpen]);

  const handleDelete = async () => {
    if (!product) return;
    if (confirmText.trim() !== sku) {
      toast.error("Type the SKU to confirm");
      return;
    }
    const ok = await deleteProduct(product.id);
    if (ok) {
      toast.success("Product deleted successfully");
      onClose();
    } else {
      toast.error("Failed to delete product");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="w-[95vw] max-w-[440px] p-0 sm:max-w-[440px]"
        showCloseButton={false}
      >
        <div className="px-5 py-5 sm:px-6">
          <DialogHeader className="space-y-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#FEF3F2]">
              <AlertCircle className="size-5 text-[#D92D20]" />
            </div>
            <DialogTitle className="text-[18px] font-semibold text-[#101828]">
              Delete {product?.name || "this product"}?
            </DialogTitle>
            <DialogDescription className="text-sm text-[#667085]">
              It&apos;s removed from Product Management and the shop for good.
              Past orders keep its name and price so reports still add up.
            </DialogDescription>
          </DialogHeader>

          {product ? (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#EAECF0] p-3">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-[#F8FAFC]">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain p-1"
                    unoptimized
                  />
                ) : null}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#101828]">
                  {product.name}
                </p>
                <p className="text-xs text-[#667085]">
                  {sku} · {product.category}
                </p>
                <p className="mt-1 text-xs text-[#667085]">
                  <span className="text-[#B42318]">
                    {product.stockLevel} in stock
                  </span>
                  {" · "}
                  no open orders · Unpublished 1 month
                </p>
              </div>
            </div>
          ) : null}

          <div className="mt-4 space-y-1.5">
            <p className="text-[13px] font-medium text-[#344054]">
              Type {sku} to confirm
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={sku}
              className="h-10 rounded-lg border-[#EAECF0]"
            />
          </div>

          <div className="mt-5 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              className="h-10 rounded-lg text-[#344054]"
              onClick={onClose}
              disabled={isDeleting}
            >
              Keep product
            </Button>
            <Button
              type="button"
              className="h-10 rounded-lg bg-[#D92D20] text-white hover:bg-[#B42318]"
              onClick={handleDelete}
              disabled={!product || isDeleting || confirmText.trim() !== sku}
            >
              {isDeleting ? "Deleting..." : "Delete product"}
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
