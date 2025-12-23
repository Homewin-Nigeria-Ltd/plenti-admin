"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";
import { toast } from "sonner";

type SuspendUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onConfirm: () => void;
};

export function SuspendUserModal({
  isOpen,
  onClose,
  userName,
  onConfirm,
}: SuspendUserModalProps) {
  const handleSuspend = () => {
    onConfirm();
    toast.warning("User account suspended");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-4 sm:p-6 w-[95vw] sm:w-full">
        <DialogTitle className="sr-only">Suspend User Confirmation</DialogTitle>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="size-16 rounded-full bg-neutral-400/10 flex items-center justify-center">
              <UserX className="size-8 text-neutral-400" />
            </div>
            <p className="text-center text-neutral-700 text-sm sm:text-base font-medium">
              Are you sure you want to suspend {userName}'s account?
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-neutral-200 text-neutral-700 hover:bg-neutral-50 order-2 sm:order-1">
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSuspend}
              className="flex-1 bg-neutral-400 hover:bg-neutral-500 text-white order-1 sm:order-2">
              Suspend
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
