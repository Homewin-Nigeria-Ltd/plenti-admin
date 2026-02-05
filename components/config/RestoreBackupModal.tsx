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
import { X } from "lucide-react";
import { WarningIcon } from "../ui/warning-icon";
import Image from "next/image";

export type RestoreBackupInfo = {
  id: string;
  createdAt: string;
  size: string;
  type: string;
};

type RestoreBackupModalProps = {
  isOpen: boolean;
  backup: RestoreBackupInfo | null;
  onClose: () => void;
};

export default function RestoreBackupModal({
  isOpen,
  backup,
  onClose,
}: RestoreBackupModalProps) {
  if (!backup) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-[640px] p-6 sm:p-8"
        showCloseButton={false}
      >
        <DialogHeader className="relative pr-10">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-[#101928]">
            Restore from Backup
          </DialogTitle>
          <DialogDescription className="text-sm text-[#667085]">
            Restore your database from a backup. This action will replace your
            current data.
          </DialogDescription>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-0 right-0 flex items-center justify-center size-8 rounded-full bg-[#EEF4FF]"
          >
            <X className="size-4 text-[#1F3A78]" />
          </button>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          <div className="rounded-xl bg-[#FFF7E7] border border-[#F6E2B8] p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <Image
                src="/icons/danger.png"
                alt="warning"
                width={30}
                height={30}
              />
              <div>
                <p className="text-[#523300] font-semibold text-base">
                  Warning
                </p>
                <p className="text-sm text-[#523300]">
                  Restoring from a backup will overwrite all current data. This
                  action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between bg-[#F9FAFB] border border-[#EAECF0] rounded-lg px-4 py-3 text-sm">
              <span className="text-[#667085]">Backup ID:</span>
              <span className="text-[#101928] font-medium">{backup.id}</span>
            </div>
            <div className="flex items-center justify-between bg-[#F9FAFB] border border-[#EAECF0] rounded-lg px-4 py-3 text-sm">
              <span className="text-[#667085]">Created:</span>
              <span className="text-[#101928] font-medium">
                {backup.createdAt}
              </span>
            </div>
            <div className="flex items-center justify-between bg-[#F9FAFB] border border-[#EAECF0] rounded-lg px-4 py-3 text-sm">
              <span className="text-[#667085]">Size:</span>
              <span className="text-[#101928] font-medium">{backup.size}</span>
            </div>
            <div className="flex items-center justify-between bg-[#F9FAFB] border border-[#EAECF0] rounded-lg px-4 py-3 text-sm">
              <span className="text-[#667085]">Type:</span>
              <span className="text-[#101928] font-medium">{backup.type}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            variant="outline"
            className="btn btn-outline w-full sm:w-1/2 border-[#D0D5DD] text-[#344054] hover:text-[#344054]"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button className="btn btn-primary w-full sm:w-1/2">
            Confirm Restore
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
