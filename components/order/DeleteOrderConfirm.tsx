"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function DeleteOrderConfirm({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-[12px] border-0 p-6 sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-[#0B1E66] text-[18px]">
            Are you sure you want to cancel this order?
          </AlertDialogTitle>
          <AlertDialogDescription className="sr-only">
            Confirm order deletion
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <AlertDialogAction
            className="rounded-[8px] h-[52px] border border-[#0B1E66] bg-transparent hover:bg-white hover:text-[#0B1E66] text-[#0B1E66]"
            onClick={onConfirm}>
            Delete Order
          </AlertDialogAction>
          <AlertDialogCancel
            className="rounded-[8px] h-[52px] bg-[#0B1E66] text-white hover:bg-[#0B1E66] hover:text-white"
            onClick={() => onOpenChange(false)}>
            Close
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
