"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  refundId: string | null;
};

export function RejectRefundModal({
  isOpen,
  onClose,
  onConfirm,
  refundId,
}: Props) {
  const [rejectionReason, setRejectionReason] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectionReason.trim()) {
      onConfirm(rejectionReason);
      setRejectionReason("");
    }
  };

  const handleClose = () => {
    setRejectionReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-md min-w-[600px] rounded-[12px]"
        showCloseButton={false}
      >
        <div className="relative">
          {/* Header */}
          <div className="items-start justify-between mb-6 relative">
            <DialogTitle className="text-[#101928] text-[24px] font-semibold">
              Reject Refund Request
            </DialogTitle>
            <DialogDescription>
              <p className="text-[#667085] text-sm">
                Provide a reason for rejecting{" "}
                <span className="font-medium">{refundId || "this refund"}</span>
              </p>
            </DialogDescription>
            <button
              aria-label="Close"
              className="absolute right-0 top-2 size-8 rounded-full bg-[#E8EEFF] flex items-center justify-center"
              onClick={handleClose}
            >
              <X color="#0B1E66" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="rejection-reason"
                  className="text-[#667185] text-base font-semibold block"
                >
                  Rejection Reason
                </label>
                <textarea
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide detailed explanation on the reason for refund"
                  className="w-full min-h-[120px] rounded-md border border-[#D0D5DD] p-3 outline-none focus:ring-2 focus:ring-[#0B1E66]/20 placeholder:text-[#98A2B3] resize-none"
                  required
                />
                <p className="text-[#D0D5DD] text-sm">
                  This reason will be communicated to the customer and support
                  team.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-6">
              <Button
                type="button"
                onClick={handleClose}
                variant="outline"
                className="flex w-[130px] h-[52px] rounded-[8px] border-[#0B1E66] text-[#0B1E66] bg-white hover:bg-[#0B1E66]/10 font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!rejectionReason.trim()}
                className="flex-1 h-[52px] text-white rounded-[8px] bg-[#D42620] disabled:bg-[#FBEAE9] hover:bg-[#D42620]/90"
              >
                Reject Refund
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
