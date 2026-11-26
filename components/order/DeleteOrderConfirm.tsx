"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";
import * as React from "react";

export function DeleteOrderConfirm({
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false,
  orderNumber,
  refundLabel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  isDeleting?: boolean;
  orderNumber?: string | null;
  refundLabel?: string | null;
}) {
  const [understood, setUnderstood] = React.useState(false);

  React.useEffect(() => {
    if (open) setUnderstood(false);
  }, [open]);

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!isDeleting) onOpenChange(next);
      }}
    >
      <AlertDialogContent className="rounded-2xl border-0 p-6 sm:max-w-md">
        <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-[#FEF3F2] text-[#D92D20]">
          <Trash2 className="size-5" />
        </div>
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle className="text-[18px] font-semibold text-[#101828]">
            Delete {orderNumber || "this order"}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-[#667085]">
            It disappears from order lists and reports. The payment and the
            {refundLabel ? ` ${refundLabel}` : ""} refund stay in Finance for
            bookkeeping. You can&apos;t undo this.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <label className="flex items-start gap-2 text-[13px] text-[#344054]">
          <input
            type="checkbox"
            checked={understood}
            onChange={(event) => setUnderstood(event.target.checked)}
            className="mt-0.5 size-4 rounded border-[#D0D5DD] accent-[#2F5BDB]"
          />
          I understand this order can&apos;t be restored
        </label>
        <div className="mt-2 flex gap-3">
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
            className="h-10 flex-1 rounded-lg border border-[#EAECF0] bg-white text-[13px] font-medium text-[#344054]"
          >
            Keep order
          </button>
          <button
            type="button"
            disabled={isDeleting || !understood}
            onClick={() => void onConfirm()}
            className="h-10 flex-1 rounded-lg bg-[#D92D20] text-[13px] font-medium text-white hover:bg-[#D92D20]/90 disabled:opacity-60"
          >
            {isDeleting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Deleting…
              </span>
            ) : (
              "Delete order"
            )}
          </button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
