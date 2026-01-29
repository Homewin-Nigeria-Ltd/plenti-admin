"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Banner } from "@/types/MarketingTypes";

interface BannerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  banner: Banner | null;
}

export function BannerDetailsModal({
  isOpen,
  onClose,
  banner,
}: BannerDetailsModalProps) {
  if (!banner) return null;

  // const formatNumber = (num: number) => {
  //   return new Intl.NumberFormat("en-US").format(num);
  // };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="min-w-[600px] max-w-[700px]"
        showCloseButton={false}
      >
        <DialogHeader className="relative pb-4">
          <div className="flex items-start justify-between gap-4 pr-12">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-[#101928] mb-2">
                {banner.title}
              </DialogTitle>
              <DialogDescription className="text-[#667085] text-base font-normal">
                {/* {banner.subHeading} */}
              </DialogDescription>
            </div>
            <div className="text-right text-sm text-[#667085] whitespace-nowrap shrink-0">
              Position: {banner.position}
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
                <DropdownMenuItem className="text-[#0B1E66] text-[14px] font-medium">
                  Edit Banner
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-[#667085] text-[14px]">
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-[#D42620] text-[14px]">
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
        </DialogHeader>

        <div className="px-6 pb-6 space-y-6">
          {/* Link */}
          {banner.link_url && (
            <div>
              <a
                href={banner.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1F3A78] hover:underline text-sm font-medium break-all"
              >
                {banner.link_url}
              </a>
            </div>
          )}

          {/* Two Column Layout */}
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
                <p className="text-[#667085] text-sm font-medium mb-1">Type</p>
                <p className="text-[#101928] text-base font-medium">
                  {banner.banner_type}
                </p>
              </div>

              <div>
                <p className="text-[#667085] text-sm font-medium mb-1">
                  Total Clicks
                </p>
                <p className="text-[#101928] text-base font-medium">
                  {new Intl.NumberFormat("en-US").format(banner.total_clicks)}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <p className="text-[#667085] text-sm font-medium mb-1">
                  Clicks Per Day
                </p>
                <p className="text-[#101928] text-base font-medium">
                  {new Intl.NumberFormat("en-US").format(banner.clicks_per_day)}
                </p>
              </div>

              <div>
                <p className="text-[#667085] text-sm font-medium mb-1">
                  Position
                </p>
                <p className="text-[#101928] text-base font-medium">
                  {banner.position}
                </p>
              </div>

              <div>
                <p className="text-[#667085] text-sm font-medium mb-1">
                  Status
                </p>
                <p className="text-[#101928] text-base font-medium">
                  {banner.is_active ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
