"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

type RefundRequest = {
  refundId: string;
  customerName: string;
  amount: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  refund: RefundRequest | null;
};

export function RefundApprovalConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  refund,
}: Props) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (!refund) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md rounded-[12px] min-w-[550px]"
        showCloseButton={false}
      >
        <div className="flex items-start gap-4">
          {/* Warning Icon */}
          <div className="shrink-0">
            <div className="size-12 rounded-full bg-[#E8EEFF] flex items-center justify-center">
              <AlertTriangle className="text-[#0B1E66] size-6" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">
            <div>
              <DialogTitle className="text-[#0B1E66] text-base font-normal">
                You are about to approve {formatCurrency(refund.amount)} refund
                to {refund.customerName}. This action cannot be undone.
              </DialogTitle>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={onConfirm}
            variant="outline"
            className="flex-1 h-[52px] rounded-[8px] border-[#0B1E66] text-[#0B1E66] bg-white hover:bg-[#0B1E66]/10"
          >
            Approve Refund
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 h-[52px] rounded-[8px] bg-[#0B1E66] text-white hover:bg-[#0B1E66]/90"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
