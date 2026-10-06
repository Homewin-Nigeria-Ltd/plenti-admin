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
import { Banner } from "@/types/MarketingTypes";
import { useMarketingStore } from "@/store/useMarketingStore";

interface BannerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  banner: Banner | null;
  onEditClick?: () => void;
}

export function BannerDetailsModal({
  isOpen,
  onClose,
  banner,
  onEditClick,
}: BannerDetailsModalProps) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const { deleteBanner, deletingBanner } = useMarketingStore();

  const handleDeleteConfirm = React.useCallback(async () => {
    if (!banner) return;
    const success = await deleteBanner(banner.id);
    if (success) {
      setDeleteConfirmOpen(false);
      onClose();
    }
  }, [banner, deleteBanner, onClose]);

  if (!banner) return null;

  const formattedDateCreated = banner.created_at
    ? (() => {
        const d = new Date(banner.created_at!);
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
      })()
    : "—";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-full max-w-[calc(100%-2rem)] sm:max-w-[700px]"
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base sm:text-lg font-bold text-[#101928] mb-1 leading-snug break-words">
                {banner.title}
              </DialogTitle>
              {banner.subheading && (
                <DialogDescription className="text-[#101928] text-sm font-normal">
                  {banner.subheading}
                </DialogDescription>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
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
                  Edit Banner
                </DropdownMenuItem>
                {/* <DropdownMenuSeparator />
                <DropdownMenuItem className="text-[#667085] text-[14px]">
                  Duplicate
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-[#D42620] text-[14px]"
                  onSelect={(e) => {
                    e.preventDefault();
                    setDeleteConfirmOpen(true);
                  }}
                >
                  Delete Banner
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
          </div>
        </DialogHeader>

        <div className="text-sm text-[#667085] whitespace-nowrap shrink-0">
          Date Created: {formattedDateCreated}
        </div>

        <div className=" pb-6 space-y-6">
          {/* Link */}
          {banner.link_url && (
            <div>
              <a
                href={banner.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2390FA] underline hover:opacity-80 text-sm font-medium break-all"
              >
                {banner.link_url}
              </a>
            </div>
          )}

          {/* Two Column Layout - Left: Screen Location, Number of Clicks, Sort | Right: Type, Click Per Day */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <p className="text-[#667085] text-sm font-medium mb-1">
                  Screen Location
                </p>
                <p className="text-[#101928] text-base font-medium">
                  {banner.screen_location ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-[#667085] text-sm font-medium mb-1">
                  Number of Clicks
                </p>
                <p className="text-[#101928] text-base font-medium">
                  {new Intl.NumberFormat("en-US").format(banner.total_clicks)}
                </p>
              </div>

              <div>
                <p className="text-[#667085] text-sm font-medium mb-1">Sort</p>
                <p className="text-[#101928] text-base font-medium">
                  {banner.position}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <p className="text-[#667085] text-sm font-medium mb-1">Type</p>
                <p className="text-[#101928] text-base font-medium">
                  {banner.banner_type}
                </p>
              </div>

              <div>
                <p className="text-[#667085] text-sm font-medium mb-1">
                  Click Per Day
                </p>
                <p className="text-[#101928] text-base font-medium">
                  {new Intl.NumberFormat("en-US").format(banner.clicks_per_day)}
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
              Are you sure you want to delete this banner?
            </AlertDialogTitle>
            <AlertDialogDescription className="sr-only">
              Confirm banner deletion
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-3 sm:justify-center">
            <AlertDialogCancel
              disabled={deletingBanner}
              className="rounded-[8px] h-12 border border-[#0B1E66] bg-transparent text-[#0B1E66] hover:bg-gray-50"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={deletingBanner}
              className="rounded-[8px] h-12"
              onClick={handleDeleteConfirm}
            >
              {deletingBanner ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Deleting…
                </span>
              ) : (
                "Delete Banner"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
