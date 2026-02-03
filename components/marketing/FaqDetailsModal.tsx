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
import { X, Ellipsis, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMarketingStore } from "@/store/useMarketingStore";
import type { Faq } from "@/types/MarketingTypes";

interface FaqDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  faq: Faq | null;
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

export function FaqDetailsModal({
  isOpen,
  onClose,
  faq,
  onEditClick,
}: FaqDetailsModalProps) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const { deleteFaq, deletingFaq } = useMarketingStore();

  const handleDeleteConfirm = React.useCallback(async () => {
    if (!faq) return;
    const success = await deleteFaq(faq.id);
    if (success) {
      setDeleteConfirmOpen(false);
      onClose();
    }
  }, [faq, deleteFaq, onClose]);

  if (!faq) return null;

  const formattedDateCreated = formatDateCreated(faq.created_at);

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
                {faq.question}
              </DialogTitle>
              {faq.category && (
                <DialogDescription className="text-[#101928] text-base font-normal">
                  {faq.category}
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
                  Edit FAQ
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-[#D42620] text-[14px]"
                  onSelect={(e) => {
                    e.preventDefault();
                    setDeleteConfirmOpen(true);
                  }}
                >
                  Delete FAQ
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
          <div>
            <p className="text-[#667085] text-sm font-medium mb-1">Answer</p>
            <p className="text-[#101928] text-base font-medium whitespace-pre-wrap">
              {faq.answer}
            </p>
          </div>

          <div>
            <p className="text-[#667085] text-sm font-medium mb-1">Status</p>
            <p className="text-[#101928] text-base font-medium">
              {faq.is_active ? "Active" : "Inactive"}
            </p>
          </div>
        </div>
      </DialogContent>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="rounded-[12px] border-0 p-6 sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-[#0B1E66] text-[18px]">
              Are you sure you want to delete this FAQ?
            </AlertDialogTitle>
            <AlertDialogDescription className="sr-only">
              Confirm FAQ deletion
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-3 sm:justify-center">
            <AlertDialogCancel
              disabled={deletingFaq}
              className="rounded-[8px] h-12 border border-[#0B1E66] bg-transparent text-[#0B1E66] hover:bg-gray-50"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={deletingFaq}
              className="rounded-[8px] h-12"
              onClick={handleDeleteConfirm}
            >
              {deletingFaq ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Deleting…
                </span>
              ) : (
                "Delete FAQ"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
