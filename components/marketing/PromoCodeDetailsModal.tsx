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
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X, Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PromoCode, PromoCodeType } from "@/types/MarketingTypes";
import { formatCurrency } from "@/lib/format";

interface PromoCodeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  promoCode: PromoCode | null;
  onEditClick?: () => void;
}

function formatDateCreated(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  const dateStr = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${dateStr} | ${timeStr}`;
}

function formatExpiry(iso: string | null | undefined) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function typeLabel(type: PromoCodeType) {
  return type === "percentage" ? "Percentage" : "Fixed";
}

export function PromoCodeDetailsModal({
  isOpen,
  onClose,
  promoCode,
  onEditClick,
}: PromoCodeDetailsModalProps) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);

  const handleDeleteConfirm = React.useCallback(() => {
    // Delete promo code endpoint not implemented yet; close dialog for now
    setDeleteConfirmOpen(false);
    onClose();
  }, [onClose]);

  if (!promoCode) return null;

  const formattedDateCreated = formatDateCreated(promoCode.created_at);
  const valueDisplay =
    promoCode.type === "percentage"
      ? `${promoCode.value}%`
      : formatCurrency(promoCode.value, { minimumFractionDigits: 2 });
  const minOrderDisplay =
    promoCode.min_order_amount > 0
      ? formatCurrency(promoCode.min_order_amount, {
          minimumFractionDigits: 2,
        })
      : "—";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="min-w-[600px] max-w-[700px]"
        showCloseButton={false}
      >
        <DialogHeader className="relative">
          <div className="flex items-start justify-between gap-4 pr-12">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-2xl font-bold text-[#101928] mb-1">
                {promoCode.code}
              </DialogTitle>
              {promoCode.description && (
                <DialogDescription className="text-[#101928] text-base font-normal">
                  {promoCode.description}
                </DialogDescription>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 absolute top-0 right-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="More actions"
                  className="border border-[#EEF1F6] rounded-lg size-8 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <Ellipsis color="#667085" size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-0 rounded-[12px] p-2 min-w-[180px]">
                <DropdownMenuItem
                  className="text-[#0B1E66] text-[14px] font-medium"
                  onSelect={(e) => {
                    e.preventDefault();
                    onEditClick?.();
                  }}
                >
                  Edit Promo Code
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-[#D42620] text-[14px]"
                  onSelect={(e) => {
                    e.preventDefault();
                    setDeleteConfirmOpen(true);
                  }}
                >
                  Delete Promo Code
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="flex items-center justify-center size-8 bg-[#E8EEFF] rounded-full hover:bg-[#E8EEFF]/80 transition-colors"
            >
              <X color="#0B1E66" size={18} />
            </button>
          </div>
        </DialogHeader>

        <div className="text-sm text-[#667085] whitespace-nowrap shrink-0">
          Date Created: {formattedDateCreated}
        </div>

        <div className="pb-6 space-y-6">
          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <p className="text-[#667085] text-sm font-medium mb-1">Type</p>
                <p className="text-[#101928] text-base font-medium">
                  {typeLabel(promoCode.type)}
                </p>
              </div>

              <div>
                <p className="text-[#667085] text-sm font-medium mb-1">Value</p>
                <p className="text-[#101928] text-base font-medium">
                  {valueDisplay}
                </p>
              </div>

              <div>
                <p className="text-[#667085] text-sm font-medium mb-1">
                  Min. Order Amount
                </p>
                <p className="text-[#101928] text-base font-medium">
                  {minOrderDisplay}
                </p>
              </div>

              <div>
                <p className="text-[#667085] text-sm font-medium mb-1">Usage</p>
                <p className="text-[#101928] text-base font-medium">
                  {promoCode.used_count} / {promoCode.usage_limit}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <p className="text-[#667085] text-sm font-medium mb-1">
                  Expiry Date
                </p>
                <p className="text-[#101928] text-base font-medium">
                  {formatExpiry(promoCode.expiry_date)}
                </p>
              </div>

              <div>
                <p className="text-[#667085] text-sm font-medium mb-1">
                  Status
                </p>
                <p className="text-[#101928] text-base font-medium">
                  {promoCode.is_active ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="rounded-[12px] border-0 p-6 sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-[#0B1E66] text-[18px]">
              Are you sure you want to delete this promo code?
            </AlertDialogTitle>
            <AlertDialogDescription className="sr-only">
              Confirm promo code deletion
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-3 sm:justify-center">
            <AlertDialogCancel className="rounded-[8px] h-12 border border-[#0B1E66] bg-transparent text-[#0B1E66] hover:bg-gray-50">
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              className="rounded-[8px] h-12"
              onClick={handleDeleteConfirm}
            >
              Delete Promo Code
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
