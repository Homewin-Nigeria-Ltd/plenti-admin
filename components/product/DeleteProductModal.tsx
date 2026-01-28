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
import type { Product } from "@/data/products";
import { toast } from "sonner";
import { useProductStore } from "@/store/useProductStore";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
          <DialogDescription
            className={`text-xs sm:text-[16px] font-semibold text-center text-[#0B1E66] ${raleway.className}`}
          >
            Are you sure you want to delete this product?
          </DialogDescription>
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
