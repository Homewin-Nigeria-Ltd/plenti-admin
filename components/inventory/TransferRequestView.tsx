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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  ArrowRightLeft,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  X,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransferRequestsStore, type TransferRequestRow } from "@/store/useTransferRequestsStore";

type RequestStatus = TransferRequestRow["status"];

function statusLabel(status: RequestStatus): string {
  if (status === "complete") return "Complete";
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  return "Awaiting Approval";
}

function statusClass(status: RequestStatus): string {
  if (status === "complete") return "bg-blue-100 text-blue-700";
  if (status === "approved") return "bg-emerald-100 text-emerald-700";
  if (status === "rejected") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
}

export function TransferRequestView() {
  const {
    requests,
    loading,
    page,
    setPage,
    lastPage,
    total,
    fetchTransferRequests,
  } = useTransferRequestsStore();
  const [selected, setSelected] = React.useState<TransferRequestRow | null>(null);

  React.useEffect(() => {
    fetchTransferRequests(page);
  }, [page, fetchTransferRequests]);

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-[#EAECF0] p-4 sm:p-5 animate-pulse"
            >
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-neutral-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-32" />
                  <div className="h-3 bg-neutral-100 rounded w-48" />
                  <div className="h-3 bg-neutral-100 rounded w-20" />
                </div>
                <div className="h-6 w-16 rounded-full bg-neutral-100" />
              </div>
            </div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#EAECF0] p-8 text-center text-[#667085] text-sm">
          No transfer requests found.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((request) => (
              <button
                key={request.apiId}
                type="button"
                onClick={() => setSelected(request)}
                className="bg-white rounded-xl border border-[#EAECF0] p-4 sm:p-5 text-left hover:border-[#0B1E66]/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-[#0B1E66] shrink-0">
                    <ArrowRightLeft className="size-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-primary text-sm">{request.id}</p>
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-medium",
                          statusClass(request.status),
                        )}
                      >
                        {statusLabel(request.status)}
                      </span>
                    </div>
                    <p className="text-primary font-medium mt-1">{request.product}</p>
                    <p className="text-[#667085] text-sm mt-0.5">
                      {request.sourceWarehouse} → {request.destinationWarehouse} •{" "}
                      {request.quantity} units
                    </p>
                    <p className="text-[#98A2B3] text-xs mt-1">{request.date}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {lastPage > 1 && (
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <p className="text-[#667085] text-sm">
                Showing page {page} of {lastPage} ({total} requests)
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 text-sm font-medium rounded-[3px] border border-[#EAECF0] text-[#101928] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                  disabled={page >= lastPage}
                  className="px-3 py-1.5 text-sm font-medium rounded-[3px] border border-[#EAECF0] text-[#101928] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <TransferRequestModal
        isOpen={selected != null}
        request={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

type TransferRequestModalProps = {
  isOpen: boolean;
  request: TransferRequestRow | null;
  onClose: () => void;
};

function TransferRequestModal({ isOpen, request, onClose }: TransferRequestModalProps) {
  const approveTransferRequest = useTransferRequestsStore((s) => s.approveTransferRequest);
  const rejectTransferRequest = useTransferRequestsStore((s) => s.rejectTransferRequest);
  const [pendingAction, setPendingAction] = React.useState<"approve" | "reject" | null>(null);
  const [reason, setReason] = React.useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setPendingAction(null);
      setReason("");
      setIsRejectDialogOpen(false);
    }
  }, [isOpen]);

  React.useEffect(() => {
    setReason("");
  }, [request?.apiId]);

  if (!request) return null;

  const alertContent =
    request.status === "awaiting_approval"
      ? {
          border: "border-[#A47D3A]",
          bg: "bg-[#F5EFDE]",
          icon: AlertTriangle,
          iconClass: "text-[#7A5B1E]",
          title: "Awaiting Approval",
          titleClass: "text-[#7A5B1E]",
          bodyClass: "text-[#5F4A1D]",
          body:
            request.note !== "—"
              ? request.note
              : "This transfer is pending review. An email notification may have been sent to the warehouse manager.",
        }
      : request.status === "complete"
        ? {
            border: "border-blue-200",
            bg: "bg-blue-50",
            icon: CheckCircle2,
            iconClass: "text-blue-700",
            title: "Complete",
            titleClass: "text-blue-800",
            bodyClass: "text-blue-900/80",
            body:
              request.note !== "—"
                ? request.note
                : "This transfer has been completed.",
          }
      : request.status === "approved"
        ? {
            border: "border-emerald-200",
            bg: "bg-emerald-50",
            icon: CheckCircle2,
            iconClass: "text-emerald-700",
            title: "Approved",
            titleClass: "text-emerald-800",
            bodyClass: "text-emerald-900/80",
            body:
              request.note !== "—"
                ? request.note
                : "This transfer request has been approved.",
          }
        : {
            border: "border-red-200",
            bg: "bg-red-50",
            icon: XCircle,
            iconClass: "text-red-700",
            title: "Rejected",
            titleClass: "text-red-800",
            bodyClass: "text-red-900/80",
            body:
              request.note !== "—"
                ? request.note
                : "This transfer request was rejected.",
          };

  const AlertIcon = alertContent.icon;

  const busy = pendingAction !== null;

  const handleApprove = async () => {
    setPendingAction("approve");
    try {
      const ok = await approveTransferRequest(request.apiId, reason);
      if (ok) onClose();
    } finally {
      setPendingAction(null);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error("Please enter a reason for rejection");
      return;
    }
    setPendingAction("reject");
    try {
      const ok = await rejectTransferRequest(request.apiId, reason);
      if (ok) {
        setIsRejectDialogOpen(false);
        onClose();
      }
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
          className="max-h-[90vh] flex flex-col p-0 w-[95vw] max-w-139.25 sm:w-139.25 sm:max-w-139.25"
          showCloseButton={false}
        >
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-neutral-100 relative">
          <div className="pr-10 sm:pr-12 flex items-start justify-between gap-3">
            <div>
              <DialogTitle className="text-xl sm:text-2xl font-semibold text-primary">
                Transfer Request
              </DialogTitle>
              <DialogDescription className="text-[#98A2B3] mt-2 text-xs sm:text-sm">
                {request.id}
              </DialogDescription>
            </div>
            <span
              className={cn(
                "inline-flex px-2.5 py-1 rounded-full text-xs font-medium shrink-0",
                statusClass(request.status),
              )}
            >
              {statusLabel(request.status)}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 sm:top-6 right-4 sm:right-6 size-7.5 rounded-full bg-[#E8EEFF] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="size-4 text-primary" />
          </button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 sm:space-y-6">
          <div
            className={cn(
              "rounded-xl border p-4",
              alertContent.border,
              alertContent.bg,
            )}
          >
            <div className="flex gap-2">
              <AlertIcon className={cn("size-5 shrink-0 mt-0.5", alertContent.iconClass)} />
              <div>
                <p className={cn("font-semibold", alertContent.titleClass)}>
                  {alertContent.title}
                </p>
                <p className={cn("text-sm mt-1", alertContent.bodyClass)}>{alertContent.body}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-[#F4F6FB] p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-primary text-sm font-medium">Product</p>
              <p className="text-primary font-semibold mt-1 wrap-break-word">{request.product}</p>
            </div>
            <p className="text-primary font-semibold shrink-0">
              {request.quantity} units
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-primary text-sm">Source Warehouse</p>
              <p className="text-[#98A2B3] mt-1 leading-tight">
                {request.sourceWarehouse}
              </p>
            </div>
            <div>
              <p className="text-primary text-sm">Destination Warehouse</p>
              <p className="text-[#98A2B3] mt-1 leading-tight">
                {request.destinationWarehouse}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-primary text-sm">Date:</p>
              <p className="text-[#98A2B3] mt-1">{request.date}</p>
            </div>
            <div>
              <p className="text-primary text-sm">Notes:</p>
              <p className="text-[#98A2B3] mt-1 leading-relaxed">{request.note}</p>
            </div>
          </div>

            {request.status === "awaiting_approval" && (
              <div className="grid grid-cols-2 gap-3 pt-2 pb-1">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 border-primary text-primary hover:bg-primary/5 inline-flex items-center justify-center"
                  disabled={busy}
                  onClick={() => setIsRejectDialogOpen(true)}
                >
                  Reject
                </Button>
                <Button
                  type="button"
                  className="h-11 bg-primary hover:bg-primary text-white inline-flex items-center justify-center"
                  disabled={busy}
                  onClick={handleApprove}
                >
                  {pendingAction === "approve" ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2" aria-hidden />
                      Approving…
                    </>
                  ) : (
                    "Approve"
                  )}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent
          className="max-h-[90vh] flex flex-col p-0 w-[95vw] max-w-[560px] sm:w-[560px] sm:max-w-[560px]"
          showCloseButton={false}
        >
          <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-neutral-100 relative">
            <DialogTitle className="text-xl sm:text-2xl font-semibold text-primary">
              Reject Transfer Request
            </DialogTitle>
            <DialogDescription className="mt-2 text-[#98A2B3] text-xs sm:text-sm">
              Provide a reason for rejecting {request.id}
            </DialogDescription>
            <button
              type="button"
              onClick={() => setIsRejectDialogOpen(false)}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 size-7.5 rounded-full bg-[#E8EEFF] flex items-center justify-center"
              aria-label="Close reject modal"
            >
              <X className="size-4 text-primary" />
            </button>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="transfer-request-reject-reason"
                className="text-primary text-sm font-medium"
              >
                Rejection Reason
              </Label>
              <Textarea
                id="transfer-request-reject-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="State the reason for rejecting this transfer request."
                disabled={busy}
                className="min-h-[120px] resize-y rounded-xl border-[#EAECF0] text-primary placeholder:text-[#98A2B3] focus-visible:ring-0 focus-visible:outline-none"
              />
              <p className="text-[#98A2B3] text-xs">
                This reason will be communicated to the customer and support team.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.8fr] gap-3 pt-2 pb-1">
              <Button
                type="button"
                variant="outline"
                className="h-11 border-primary text-primary hover:bg-primary/5 inline-flex items-center justify-center"
                disabled={busy}
                onClick={() => setIsRejectDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="h-11 bg-[#E02424] hover:bg-[#C81E1E] text-white inline-flex items-center justify-center"
                disabled={busy}
                onClick={handleReject}
              >
                {pendingAction === "reject" ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" aria-hidden />
                    Rejecting…
                  </>
                ) : (
                  "Reject Transfer Request"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
