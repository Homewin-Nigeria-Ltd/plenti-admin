"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Check, Info, X } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import type { IncomingOrderDetail } from "@/components/dashboard/incomingOrderView";

type IncomingOrderDetailsModalProps = {
  open: boolean;
  detail: IncomingOrderDetail | null;
  submitting?: boolean;
  onClose: () => void;
  onDecline: () => void;
  onAccept: (warehouseId: string) => void;
};

export default function IncomingOrderDetailsModal({
  open,
  detail,
  submitting = false,
  onClose,
  onDecline,
  onAccept,
}: IncomingOrderDetailsModalProps) {
  const [warehouseId, setWarehouseId] = React.useState("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  React.useEffect(() => {
    if (detail) setWarehouseId(detail.warehouseId);
  }, [detail]);

  React.useEffect(() => {
    if (!open) setConfirmOpen(false);
  }, [open]);

  if (!detail) return null;
  const warehouse =
    detail.warehouses.find((item) => item.id === warehouseId) ?? detail.warehouses[0];

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] overflow-y-auto w-[95vw] max-w-[560px] rounded-2xl p-0 gap-0"
      >
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <DialogTitle className="text-[16px] font-semibold text-[#101828] inline-flex items-center gap-2">
                {detail.isNew ? (
                  <span className="rounded-md bg-[#FEE4E2] text-[#D92D20] text-[10px] font-semibold uppercase px-1.5 py-0.5">
                    New
                  </span>
                ) : null}
                Order Details · {detail.orderNumber}
              </DialogTitle>
              <DialogDescription className="text-[12px] text-[#667085] mt-1">
                {detail.placedLabel} · {detail.waitingLabel}
              </DialogDescription>
            </div>
            <button
              type="button"
              className="size-8 rounded-lg text-[#98A2B3] hover:bg-[#F2F4F7] inline-flex items-center justify-center"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-4 flex items-start gap-3">
            <Avatar className="size-10">
              <AvatarImage src={detail.customerAvatar || ""} />
              <AvatarFallback
                className="text-white text-sm"
                style={{ backgroundColor: detail.customerColor }}
              >
                {detail.customerInitial}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#101828]">{detail.customerName}</p>
              <p className="text-[12px] text-[#667085]">
                {[detail.phone, detail.orderCountLabel].filter(Boolean).join(" · ")}
              </p>
              <p className="text-[12px] text-[#667085]">
                {[detail.address, detail.distanceLabel].filter(Boolean).join(" · ")}
              </p>
            </div>
            <span className="shrink-0 rounded-md bg-[#ECFDF3] text-[#027A48] text-[11px] font-medium px-2 py-1">
              {detail.paymentLabel}
            </span>
          </div>
        </div>

        <div className="px-5 pb-4">
          <p className="text-[11px] font-semibold tracking-wide text-[#98A2B3] uppercase">
            Items · stock at {detail.warehouseName}
          </p>
          <div className="mt-2 space-y-2">
            {detail.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-[#E4E6EB] px-3 py-2.5"
              >
                <div className="size-10 rounded-lg bg-[#F2F4F7] overflow-hidden shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={40}
                      height={40}
                      className="size-10 object-cover"
                      unoptimized
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#101828] truncate">{item.name}</p>
                  <p
                    className={cn(
                      "text-[12px]",
                      item.stockTone === "low" ? "text-[#F79009]" : "text-[#12B76A]",
                    )}
                  >
                    {item.stockLabel}
                  </p>
                </div>
                <p className="text-[12px] text-[#667085]">× {item.qty}</p>
                <p className="text-sm font-semibold text-[#101828]">
                  {formatCurrency(item.price)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1.5 text-[13px]">
            <div className="flex justify-between text-[#667085]">
              <span>Subtotal</span>
              <span>{formatCurrency(detail.subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#667085]">
              <span>Delivery</span>
              <span>
                {detail.deliveryFee > 0
                  ? formatCurrency(detail.deliveryFee)
                  : detail.deliveryNote || "Free"}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-[#101828] pt-1">
              <span>Total paid</span>
              <span>{formatCurrency(detail.total)}</span>
            </div>
          </div>
        </div>

        <div className="px-5 pb-5 space-y-3">
          <div>
            <p className="text-[12px] font-medium text-[#344054] mb-1.5">Fulfil from</p>
            <select
              value={warehouseId}
              onChange={(event) => setWarehouseId(event.target.value)}
              className="h-10 w-full rounded-lg border border-[#E4E6EB] bg-white px-3 text-[13px] text-[#344054] outline-none"
            >
              {detail.warehouses.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                  {option.hint ? ` · ${option.hint}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl bg-[#EFF4FF] px-3.5 py-3 text-[12px] text-[#3538CD] flex items-start gap-2">
            <Info className="size-4 mt-0.5 shrink-0" />
            <p>
              When you accept, this order goes straight to riders within 100 m of{" "}
              {warehouse?.name || detail.warehouseName} warehouse who are free right
              now. You don&apos;t need to assign anyone.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              className="h-10 px-3 rounded-lg text-[13px] font-medium text-[#D92D20] hover:bg-[#FEF3F2]"
              onClick={onDecline}
            >
              Decline order
            </button>
            <button
              type="button"
              className="h-10 px-4 rounded-lg bg-[#2F5BDB] text-white text-[13px] font-medium inline-flex items-center gap-1.5 hover:bg-[#2F5BDB]/90 disabled:opacity-60"
              disabled={submitting}
              onClick={() => setConfirmOpen(true)}
            >
              <Check className="size-4" />
              Accept and send to riders
            </button>
          </div>
        </div>
      </DialogContent>
      <AlertDialog
        open={confirmOpen}
        onOpenChange={(nextOpen) => {
          if (!submitting) setConfirmOpen(nextOpen);
        }}
      >
        <AlertDialogContent className="rounded-xl border-0 p-6 sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[18px] font-semibold text-[#101828]">
              Accept this order?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-[#667085]">
              This sends the order to riders near{" "}
              {warehouse?.name || detail.warehouseName} warehouse.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-3 sm:justify-end">
            <AlertDialogCancel
              disabled={submitting}
              className="h-9 rounded-lg border border-[#EAECF0] bg-white text-[13px] font-medium text-[#344054]"
            >
              Cancel
            </AlertDialogCancel>
            <button
              type="button"
              disabled={submitting}
              onClick={() => onAccept(warehouseId)}
              className="h-9 shrink-0 rounded-lg bg-[#2F5BDB] px-3.5 text-[13px] font-medium text-white hover:bg-[#2F5BDB]/90 disabled:opacity-60"
            >
              {submitting ? "Accepting…" : "Accept and send to riders"}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
