"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { WithdrawalRequestRow } from "@/types/sales";

type ReviewWithdrawalModalProps = {
  isOpen: boolean;
  onClose: () => void;
  withdrawal: WithdrawalRequestRow | null;
};

export function ReviewWithdrawalModal({
  isOpen,
  onClose,
  withdrawal,
}: ReviewWithdrawalModalProps) {
  const [reason, setReason] = useState("");

  const hasReason = useMemo(() => reason.trim().length > 0, [reason]);

  const handleClose = () => {
    setReason("");
    onClose();
  };

  if (!withdrawal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="rounded-3xl p-0 sm:max-w-180"
        showCloseButton={false}
      >
        <div className="p-10">
          <div className="relative pr-14">
            <DialogTitle className="text-[24px] font-semibold leading-[1.1] text-[#101928] sm:text-[24px]">
              Review Withdrawal
            </DialogTitle>

            <p className="mt-2 text-[14px] text-[#667085] sm:text-[14px]">
              Amount: {withdrawal.amount.replace(".00", "")}
            </p>

            <button
              type="button"
              onClick={handleClose}
              aria-label="Close dialog"
              className="absolute top-0 right-0 flex size-8 items-center justify-center rounded-full bg-[#E8EEFF]"
            >
              <X className="size-6 text-[#0B1E66]" />
            </button>
          </div>

          <div className="mt-10 space-y-3">
            <p className="text-[16px] font-medium text-[#667085]">
              Rejection reason (required if rejecting)
            </p>

            <Textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Provide detailed explanation on the reason for Rejection"
              className="min-h-45 rounded-2xl border-[#D0D5DD] p-6 text-base text-[#101928] placeholder:text-[#B8C0CC] focus-visible:border-[#D0D5DD] focus-visible:ring-0"
            />
          </div>

          <div className="mt-10 grid grid-cols-2 gap-5">
            <button
              type="button"
              disabled={hasReason}
              className="h-12.5 rounded-xl bg-[#0B1E66] text-[20px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#C9D1E5]"
            >
              Approve
            </button>

            <button
              type="button"
              disabled={!hasReason}
              className="h-12.5 rounded-xl bg-[#E71D36] text-[20px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#F3E2E5]"
            >
              Reject
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
