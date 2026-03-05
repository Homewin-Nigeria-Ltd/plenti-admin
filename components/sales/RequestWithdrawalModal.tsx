"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type RequestWithdrawalModalProps = {
  isOpen: boolean;
  onClose: () => void;
  availableBalance?: number;
};

export function RequestWithdrawalModal({
  isOpen,
  onClose,
  availableBalance = 125500,
}: RequestWithdrawalModalProps) {
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = useMemo(
    () => amount.trim().length > 0 && parseFloat(amount) > 0,
    [amount],
  );

  const handleClose = () => {
    setAmount("");
    setNotes("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      // TODO: Call withdrawal API endpoint
      // await api.post('/api/sales/withdrawals', {
      //   amount: parseFloat(amount),
      //   notes: notes.trim(),
      // });

      // For now, just close the modal
      console.log("Withdrawal request:", { amount, notes });
      toast.success("Withdrawal request submitted successfully!");
      handleClose();
    } catch (error) {
      console.error("Failed to submit withdrawal request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="rounded-xl p-0 sm:max-w-md"
        showCloseButton={false}
      >
        <div className="p-8">
          <div className="relative pr-12">
            <DialogTitle className="text-2xl font-semibold text-[#101928]">
              Request Withdrawal
            </DialogTitle>

            <button
              type="button"
              onClick={handleClose}
              aria-label="Close dialog"
              className="absolute top-0 right-0 flex size-8 items-center justify-center rounded-full hover:bg-[#F2F4F7]"
            >
              <X className="size-5 text-[#0B1E66]" />
            </button>
          </div>

          <div className="mt-8 space-y-6">
            {/* Amount Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#101928]">
                Amount (₦)
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount to withdraw"
                className="rounded-lg border-[#D0D5DD] bg-white px-4 py-3 text-base text-[#101928] placeholder:text-[#B8C0CC]"
              />
              <p className="text-sm font-medium text-[#12B76A]">
                Available balance: ₦{availableBalance.toLocaleString()}
              </p>
            </div>

            {/* Notes Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#101928]">
                Notes (optional)
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add a Comment about this ticket"
                className="min-h-32 rounded-lg border-[#D0D5DD] bg-white p-4 text-base text-[#101928] placeholder:text-[#B8C0CC] focus-visible:border-[#D0D5DD] focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="mt-8 w-full rounded-lg bg-[#0B1E66] py-3 text-base font-semibold text-white hover:bg-[#0B1E66]/90 disabled:cursor-not-allowed disabled:bg-[#C9D1E5] transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
