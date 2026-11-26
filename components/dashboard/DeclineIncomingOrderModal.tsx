"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AlertTriangle, X } from "lucide-react";
import * as React from "react";
import {
  DECLINE_REASONS,
  defaultDeclineMessage,
  type DeclineReason,
  type IncomingOrderDetail,
} from "@/components/dashboard/incomingOrderView";

type DeclineIncomingOrderModalProps = {
  open: boolean;
  detail: IncomingOrderDetail | null;
  submitting?: boolean;
  onClose: () => void;
  onBack: () => void;
  onConfirm: (payload: { reason: string; message: string }) => void;
};

export default function DeclineIncomingOrderModal({
  open,
  detail,
  submitting = false,
  onClose,
  onBack,
  onConfirm,
}: DeclineIncomingOrderModalProps) {
  const [reason, setReason] = React.useState<DeclineReason>(DECLINE_REASONS[0].id);
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    if (detail && open) {
      setReason(DECLINE_REASONS[0].id);
      setMessage(defaultDeclineMessage(detail));
    }
  }, [detail, open]);

  if (!detail) return null;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] overflow-y-auto w-[95vw] max-w-[520px] rounded-2xl p-0 gap-0"
      >
        <div className="px-5 pt-5 pb-4">
          <span className="size-10 rounded-full bg-[#FEF3F2] text-[#D92D20] inline-flex items-center justify-center mb-3">
            <X className="size-5" />
          </span>
          <DialogTitle className="text-[18px] font-semibold text-[#101828]">
            Decline order {detail.orderNumber}?
          </DialogTitle>
          <DialogDescription className="text-[13px] text-[#667085] mt-1.5">
            {detail.customerName} will get an SMS and an in-app message with your
            reason. This can&apos;t be undone.
          </DialogDescription>
        </div>

        <div className="px-5 pb-5 space-y-4">
          <div>
            <p className="text-[13px] font-medium text-[#344054] mb-2">
              Why are you declining? <span className="text-[#D92D20]">*</span>
            </p>
            <div className="space-y-2">
              {DECLINE_REASONS.map((option) => {
                const selected = reason === option.id;
                return (
                  <label
                    key={option.id}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-[13px] cursor-pointer",
                      selected
                        ? "border-[#2F5BDB] bg-[#F5F8FF] text-[#101828]"
                        : "border-[#E4E6EB] text-[#344054]",
                    )}
                  >
                    <input
                      type="radio"
                      name="decline-reason"
                      className="size-4 accent-[#2F5BDB]"
                      checked={selected}
                      onChange={() => setReason(option.id)}
                    />
                    {option.label}
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-[13px] font-medium text-[#344054] mb-1.5">
              Message to customer{" "}
              <span className="text-[#98A2B3] font-normal">(optional)</span>
            </p>
            <Textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="min-h-24 rounded-lg border-[#E4E6EB] text-[13px] shadow-none"
            />
          </div>

          {detail.paid ? (
            <div className="rounded-xl bg-[#FFFAEB] border border-[#FEDF89] px-3.5 py-3 text-[12px] text-[#B54708] flex items-start gap-2">
              <AlertTriangle className="size-4 mt-0.5 shrink-0" />
              <p>
                This order was paid by card. A full refund of{" "}
                <span className="font-semibold">{formatCurrency(detail.total)}</span>{" "}
                starts automatically and shows in Finance.
              </p>
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              className="h-10 px-4 rounded-lg border border-[#E4E6EB] bg-white text-[13px] font-medium text-[#344054] hover:bg-[#F9FAFB]"
              onClick={onBack}
            >
              Go back
            </button>
            <button
              type="button"
              className="h-10 px-4 rounded-lg bg-[#D92D20] text-white text-[13px] font-medium hover:bg-[#D92D20]/90 disabled:opacity-60"
              disabled={submitting || !reason}
              onClick={() => onConfirm({ reason, message })}
            >
              Decline order
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
