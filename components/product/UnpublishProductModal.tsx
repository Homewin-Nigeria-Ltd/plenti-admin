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
import { Check } from "lucide-react";

type UnpublishProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
};

export function UnpublishProductModal({
  isOpen,
  onClose,
  product,
}: UnpublishProductModalProps) {
  const { toggleProductStatus, togglingStatusById } = useProductStore();
  const [reason, setReason] = React.useState("");
  const isToggling = !!togglingStatusById[String(product?.id ?? "")];

  React.useEffect(() => {
    if (!isOpen) setReason("");
  }, [isOpen]);

  const handleUnpublish = async () => {
    if (!product) return;
    const ok = await toggleProductStatus(product.id);
    if (ok) {
      toast.success("Product unpublished");
      onClose();
    } else {
      toast.error("Failed to unpublish product");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="w-[95vw] max-w-[420px] p-0 sm:max-w-[420px]"
        showCloseButton={false}
      >
        <div className="px-5 py-5 sm:px-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-[18px] font-semibold text-[#101828]">
              Unpublish {product?.name || "this product"}?
            </DialogTitle>
            <DialogDescription className="sr-only">
              Confirm unpublishing this product
            </DialogDescription>
          </DialogHeader>
          <ul className="mt-4 space-y-2 text-sm text-[#344054]">
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 text-[#027A48]" />
              Customers can&apos;t find or buy it in the shop
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 text-[#027A48]" />
              {product?.stockLevel ?? 12} units stay in inventory across
              warehouses
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 text-[#027A48]" />
              Open orders, including ones still getting delivered, stay on track
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 text-[#027A48]" />
              You can publish it again any time
            </li>
          </ul>
          <div className="mt-4 space-y-1.5">
            <p className="text-[13px] font-medium text-[#344054]">
              Reason{" "}
              <span className="font-normal text-[#98A2B3]">
                (goes in the Audit Log)
              </span>
            </p>
            <Input
              placeholder="Supplier is changing the price"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-10 rounded-lg border-[#EAECF0]"
            />
          </div>
          <div className="mt-5 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              className="h-10 rounded-lg text-[#344054]"
              onClick={onClose}
              disabled={isToggling}
            >
              Keep it live
            </Button>
            <Button
              type="button"
              className="h-10 rounded-lg bg-[#0B1E66] text-white hover:bg-[#0B1E66]/90"
              onClick={handleUnpublish}
              disabled={!product || isToggling}
            >
              {isToggling ? "Unpublishing..." : "Unpublish"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
