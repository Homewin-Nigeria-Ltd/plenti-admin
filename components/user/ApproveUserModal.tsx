"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";

type ApproveUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onConfirm: () => void;
};

export function ApproveUserModal({
  isOpen,
  onClose,
  userName,
  onConfirm,
}: ApproveUserModalProps) {
  const handleApprove = () => {
    onConfirm();
    toast.success("User account approved successfully");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-4 sm:p-6 w-[95vw] sm:w-full">
        <DialogTitle className="sr-only">Approve User Confirmation</DialogTitle>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="size-16 rounded-full bg-[#0F973D]/10 flex items-center justify-center">
              <Check className="size-8 text-[#0F973D]" />
            </div>
            <p className="text-center text-neutral-700 text-sm sm:text-base font-medium">
              Are you sure you want to approve {userName}'s account?
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="btn btn-outline flex-1 order-2 sm:order-1">
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleApprove}
              className="flex-1 bg-[#0F973D] hover:bg-[#0d7d33] text-white order-1 sm:order-2 rounded-md">
              Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
