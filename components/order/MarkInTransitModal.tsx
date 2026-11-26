"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { itemProductName } from "@/components/order/orderManagementView";
import { pickupCodeDigits } from "@/components/order/orderDetailPresentation";
import type { Order } from "@/types/OrderTypes";
import { Loader2, Truck } from "lucide-react";
import * as React from "react";

type MarkInTransitModalProps = {
  open: boolean;
  order: Order;
  riderName: string;
  submitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function MarkInTransitModal({
  open,
  order,
  riderName,
  submitting = false,
  onOpenChange,
  onConfirm,
}: MarkInTransitModalProps) {
  const items = order.items ?? [];
  const [checked, setChecked] = React.useState<Record<number, boolean>>({});
  const code = pickupCodeDigits(order);

  React.useEffect(() => {
    if (!open) return;
    const next: Record<number, boolean> = {};
    items.forEach((item) => {
      next[item.id] = true;
    });
    setChecked(next);
  }, [open, order.id]);

  const allChecked =
    items.length === 0 || items.every((item) => checked[item.id]);
  const firstName = riderName.split(" ")[0] || "the rider";

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!submitting) onOpenChange(next);
      }}
    >
      <AlertDialogContent className="rounded-2xl border-0 p-6 sm:max-w-md">
        <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2F5BDB]">
          <Truck className="size-5" />
        </div>
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle className="text-[18px] font-semibold text-[#101828]">
            Mark {order.order_number} In Transit?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-[#667085]">
            Enter the pickup code from {firstName}&apos;s app to confirm he has
            the items. The customer gets an SMS with the ETA.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <p className="mb-2 text-[12px] font-medium text-[#344054]">Pickup code</p>
          <div className="flex gap-2">
            {code.split("").map((digit, index) => (
              <span
                key={`${digit}-${index}`}
                className="flex size-12 items-center justify-center rounded-xl border border-[#E4E6EB] text-lg font-semibold text-[#101828]"
              >
                {digit}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[12px] font-medium text-[#344054]">Handed over</p>
          {(items.length > 0 ? items : [{ id: 0, quantity: 1, product_name: "Order items" }]).map(
            (item) => (
              <label
                key={item.id}
                className="flex items-center gap-2 text-[13px] text-[#344054]"
              >
                <input
                  type="checkbox"
                  checked={item.id === 0 ? true : Boolean(checked[item.id])}
                  onChange={(event) =>
                    setChecked((current) => ({
                      ...current,
                      [item.id]: event.target.checked,
                    }))
                  }
                  className="size-4 rounded border-[#D0D5DD] accent-[#2F5BDB]"
                />
                {itemProductName(item as never) || "Item"} × {item.quantity}
              </label>
            ),
          )}
        </div>
        <div className="mt-2 flex gap-3">
          <AlertDialogCancel
            disabled={submitting}
            className="h-10 flex-1 rounded-lg border border-[#EAECF0] bg-white text-[13px] font-medium text-[#344054]"
          >
            Cancel
          </AlertDialogCancel>
          <button
            type="button"
            disabled={submitting || !allChecked}
            onClick={onConfirm}
            className="h-10 flex-1 rounded-lg bg-[#2F5BDB] text-[13px] font-medium text-white hover:bg-[#2F5BDB]/90 disabled:opacity-60"
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Marking…
              </span>
            ) : (
              "Mark In Transit"
            )}
          </button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
