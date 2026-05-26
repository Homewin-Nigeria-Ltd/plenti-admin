"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  formatDocumentStatusLabel,
  getDocumentStatusBadgeClass,
  getRiderApplicationDocuments,
  getRiderSubmittedDate,
  getRiderVehicleLabel,
} from "@/lib/riderDisplay";
import { useRiderStore } from "@/store/useRiderStore";
import type { AdminRider } from "@/types/RiderTypes";
import { FileText, Loader2, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

type ApplicationReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  riderId: number | null;
  previewRider?: AdminRider | null;
  onReviewed?: () => void;
};

type ReviewStep = "review" | "reject";

function InfoCell({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-[#F9FAFB] border border-[#EAECF0] px-4 py-3 min-h-[72px] flex flex-col justify-center gap-1">
      <p className="text-xs text-[#667085]">{label}</p>
      <p className="text-sm font-medium text-[#101928] break-words">{value}</p>
    </div>
  );
}

export function ApplicationReviewModal({
  isOpen,
  onClose,
  riderId,
  previewRider,
  onReviewed,
}: ApplicationReviewModalProps) {
  const [step, setStep] = React.useState<ReviewStep>("review");
  const [rejectionReason, setRejectionReason] = React.useState("");

  const {
    singleRider,
    loadingSingle,
    reviewingApplication,
    fetchSingleRider,
    approveOnboardingRider,
    rejectOnboardingRider,
    clearSingleRider,
  } = useRiderStore();

  React.useEffect(() => {
    if (!isOpen || !riderId) return;
    setStep("review");
    setRejectionReason("");
    void fetchSingleRider(riderId, previewRider ?? null);
  }, [isOpen, riderId, previewRider, fetchSingleRider]);

  const handleClose = () => {
    setStep("review");
    setRejectionReason("");
    clearSingleRider();
    onClose();
  };

  const rider = singleRider;
  const documents = rider ? getRiderApplicationDocuments(rider) : [];
  const canSubmitRejection = rejectionReason.trim().length > 0;

  const handleApprove = async () => {
    if (!rider?.id) return;
    const ok = await approveOnboardingRider(rider.id);
    if (ok) {
      toast.success(`${rider.name}'s application has been approved`);
      handleClose();
      onReviewed?.();
    } else {
      toast.error("Failed to approve application");
    }
  };

  const handleConfirmReject = async () => {
    if (!rider?.id || !canSubmitRejection) return;
    const ok = await rejectOnboardingRider(rider.id, rejectionReason.trim());
    if (ok) {
      toast.success(`${rider.name}'s application has been rejected`);
      handleClose();
      onReviewed?.();
    } else {
      toast.error("Failed to reject application");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        className="max-w-[520px] w-[95vw] p-0 gap-0 overflow-hidden"
        showCloseButton={false}
      >
        {loadingSingle && !rider ? (
          <>
            <DialogTitle className="sr-only">Loading application</DialogTitle>
            <div className="flex flex-col items-center justify-center min-h-[320px] gap-3 px-6 py-12">
              <Loader2 className="size-10 animate-spin text-[#0B1E66]" />
              <p className="text-sm text-[#667085]">Loading application…</p>
            </div>
          </>
        ) : !rider ? (
          <>
            <DialogTitle className="sr-only">Application not found</DialogTitle>
            <div className="px-6 py-12 text-center text-sm text-[#667085]">
              Application could not be loaded.
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="relative px-6 pt-6 pb-4 border-b border-neutral-100">
              <DialogTitle className="text-lg font-semibold text-[#101928] pr-12">
                Application Review — {rider.name}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {step === "reject"
                  ? `Provide rejection reason for ${rider.name}`
                  : `Review onboarding application for ${rider.name}`}
              </DialogDescription>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close dialog"
                className="absolute top-6 right-6 flex items-center justify-center size-[30px] bg-[#E8EEFF] rounded-full"
              >
                <X color="#0B1E66" size={20} />
              </button>
            </DialogHeader>

            {step === "review" ? (
              <>
                <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoCell label="Phone" value={rider.phone || "—"} />
                    <InfoCell label="Email" value={rider.email || "—"} />
                    <InfoCell label="Vehicle" value={getRiderVehicleLabel(rider)} />
                    <InfoCell label="Submitted" value={getRiderSubmittedDate(rider)} />
                  </div>

                  <div className="space-y-3">
                    {documents.map((doc) => {
                      const status = doc.status ?? "pending";
                      const statusLabel = formatDocumentStatusLabel(status);
                      return (
                        <div
                          key={doc.key}
                          className="flex items-center justify-between gap-4 rounded-xl border border-[#EAECF0] bg-[#F9FAFB] px-4 py-3.5"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="size-10 rounded-lg bg-white border border-[#EAECF0] flex items-center justify-center shrink-0">
                              <FileText className="size-5 text-[#667085]" />
                            </div>
                            <p className="text-sm font-medium text-[#101928] truncate">
                              {doc.label}
                            </p>
                          </div>
                          <span
                            className={`badge capitalize shrink-0 ${getDocumentStatusBadgeClass(status)}`}
                          >
                            {statusLabel}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 space-y-3 border-t border-neutral-100">
                  <Button
                    type="button"
                    disabled={reviewingApplication}
                    onClick={() => void handleApprove()}
                    className="btn btn-primary w-full h-12 font-semibold rounded-xl"
                  >
                    {reviewingApplication ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        Processing…
                      </>
                    ) : (
                      "Approve"
                    )}
                  </Button>
                  <Button
                    type="button"
                    disabled={reviewingApplication}
                    onClick={() => setStep("reject")}
                    className="w-full h-12 font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white"
                  >
                    Reject
                  </Button>
                </div>
              </>
            ) : (
              <div className="px-6 py-6 space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="rejection-reason"
                    className="text-sm font-medium text-[#667085]"
                  >
                    Rejection Reason
                  </label>
                  <Textarea
                    id="rejection-reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter reason for rejecting this application"
                    rows={6}
                    className="min-h-[160px] resize-none rounded-xl border-[#D0D5DD] text-[#101928] placeholder:text-[#98A2B3] focus-visible:ring-[#2E5CDB]"
                  />
                  <p className="text-xs text-[#98A2B3]">
                    This reason will be communicated to the customer and support team.
                  </p>
                </div>

                <Button
                  type="button"
                  disabled={!canSubmitRejection || reviewingApplication}
                  onClick={() => void handleConfirmReject()}
                  className="w-full h-12 font-semibold rounded-full text-white disabled:bg-[#FDE8E8] disabled:text-[#F04438]/60 enabled:bg-red-600 enabled:hover:bg-red-700"
                >
                  {reviewingApplication ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Rejecting…
                    </>
                  ) : (
                    "Reject"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
