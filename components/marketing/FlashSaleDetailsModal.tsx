"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  flashSaleItemName,
  flashSaleItemsCount,
  formatSaleDateTime,
  resolveFlashSaleStatus,
} from "@/lib/flashSale";
import { cn } from "@/lib/utils";
import { useFlashSaleStore } from "@/store/useFlashSaleStore";
import type { FlashSale, FlashSaleStatus } from "@/types/FlashSaleTypes";
import { Ellipsis, Loader2, X } from "lucide-react";
import { toast } from "sonner";

const STATUS_STYLES: Record<FlashSaleStatus, string> = {
  scheduled: "bg-[#E8EEFF] text-[#0B1E66]",
  running: "bg-green-100 text-green-700",
  ended: "bg-gray-100 text-gray-700",
  off: "bg-red-100 text-red-700",
};

type FlashSaleDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sale: FlashSale | null;
  onEditClick?: () => void;
};

export function FlashSaleDetailsModal({
  isOpen,
  onClose,
  sale,
  onEditClick,
}: FlashSaleDetailsModalProps) {
  const { updateFlashSale, deleteFlashSale, savingFlashSale, deletingById } =
    useFlashSaleStore();
  const [confirm, setConfirm] = React.useState<"end" | "delete" | null>(null);

  if (!sale) return null;

  const status = resolveFlashSaleStatus(sale);
  const items = sale.items ?? [];
  const deleting = Boolean(deletingById[sale.id]);
  const canEndNow = sale.is_active && status !== "ended";

  const handleEndNow = async () => {
    const ok = await updateFlashSale(sale.id, { is_active: false });
    if (ok) {
      toast.success("Flash sale ended");
      setConfirm(null);
      onClose();
    } else {
      toast.error(
        useFlashSaleStore.getState().saveError ?? "Failed to end flash sale",
      );
    }
  };

  const handleDelete = async () => {
    const ok = await deleteFlashSale(sale.id);
    if (ok) {
      toast.success("Flash sale deleted");
      setConfirm(null);
      onClose();
    } else {
      toast.error("Failed to delete flash sale");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="w-full max-w-[calc(100%-2rem)] sm:max-w-[640px] max-h-[90dvh] overflow-y-auto"
          showCloseButton={false}
        >
          <DialogHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-base sm:text-lg font-bold text-[#101928] mb-1 leading-snug break-words">
                  {sale.name}
                </DialogTitle>
                <DialogDescription className="text-[#667085] text-sm font-normal">
                  {flashSaleItemsCount(sale)} product
                  {flashSaleItemsCount(sale) === 1 ? "" : "s"}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-label="More actions"
                      className="border border-[#EEF1F6] rounded-lg size-8 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Ellipsis color="#667085" size={18} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="border-0 rounded-[12px] p-2 min-w-[160px]">
                    <DropdownMenuItem
                      onSelect={() => onEditClick?.()}
                      className="text-[#0B1E66] text-sm font-medium"
                    >
                      Edit
                    </DropdownMenuItem>
                    {canEndNow ? (
                      <DropdownMenuItem
                        onSelect={() => setConfirm("end")}
                        className="text-[#0B1E66] text-sm font-medium"
                      >
                        End now
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={() => setConfirm("delete")}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="flex items-center justify-center size-8 bg-[#E8EEFF] rounded-full"
                >
                  <X color="#0B1E66" size={18} />
                </button>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[#98A2B3] text-xs mb-1">Start</p>
                <p className="text-[#101928]">{formatSaleDateTime(sale.starts_at)}</p>
              </div>
              <div>
                <p className="text-[#98A2B3] text-xs mb-1">End</p>
                <p className="text-[#101928]">{formatSaleDateTime(sale.ends_at)}</p>
              </div>
              <div>
                <p className="text-[#98A2B3] text-xs mb-1">Status</p>
                <span
                  className={cn(
                    "inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize",
                    STATUS_STYLES[status],
                  )}
                >
                  {status}
                </span>
              </div>
            </div>

            <div>
              <p className="text-[#98A2B3] text-xs mb-2">Products</p>
              {items.length === 0 ? (
                <p className="text-sm text-[#667085]">No products on this sale.</p>
              ) : (
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li
                      key={`${item.product_id}-${item.discount_percent}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-[#EAECF0] px-3 py-2"
                    >
                      <span className="text-sm text-[#101928] truncate">
                        {flashSaleItemName(item)}
                      </span>
                      <span className="text-sm font-medium text-[#0B1E66] shrink-0">
                        {item.discount_percent}%
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={confirm != null}
        onOpenChange={(open) => {
          if (!open && !savingFlashSale && !deleting) setConfirm(null);
        }}
      >
        <AlertDialogContent className="rounded-[12px] border-0 p-6 sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-[#0B1E66] text-[18px]">
              {confirm === "end"
                ? `End ${sale.name} now?`
                : `Delete ${sale.name}?`}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm text-[#667085]">
              {confirm === "end"
                ? "Products on this sale will return to their original price."
                : "This cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={savingFlashSale || deleting}
              className="rounded-[8px] h-[52px] border border-[#D42620] bg-transparent hover:bg-white hover:text-[#D42620] text-[#D42620]"
              onClick={() =>
                void (confirm === "end" ? handleEndNow() : handleDelete())
              }
            >
              {savingFlashSale || deleting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  {confirm === "end" ? "Ending…" : "Deleting…"}
                </span>
              ) : confirm === "end" ? (
                "End now"
              ) : (
                "Delete"
              )}
            </Button>
            <AlertDialogCancel
              disabled={savingFlashSale || deleting}
              className="rounded-[8px] h-[52px] bg-[#0B1E66] text-white hover:bg-[#0B1E66] hover:text-white"
              onClick={() => setConfirm(null)}
            >
              Close
            </AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
