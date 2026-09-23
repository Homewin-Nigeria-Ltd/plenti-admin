"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { X } from "lucide-react";

export type RefundDetailsView = {
  refundId: number | string;
  customerName: string;
  customerEmail: string;
  amount: number;
  orderId?: string;
  status: string;
  reason?: string;
  requestedAt?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  refund: RefundDetailsView | null;
  loading?: boolean;
  canManage?: boolean;
  actionLoading?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onMarkProcessed?: () => void;
};

function normalizeStatus(status: string) {
  return status.trim().toLowerCase().replace(/_/g, " ");
}

export function canApproveRefund(status: string) {
  const value = normalizeStatus(status);
  return value.includes("awaiting approval") || value === "pending";
}

export function canMarkRefundProcessed(status: string) {
  const value = normalizeStatus(status);
  return value.includes("awaiting processing") || value === "processing";
}

export function canRejectRefund(status: string) {
  return canApproveRefund(status) || canMarkRefundProcessed(status);
}

function formatDate(iso?: string) {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function RefundDetailsModal({
  isOpen,
  onClose,
  refund,
  loading,
  canManage,
  actionLoading,
  onApprove,
  onReject,
  onMarkProcessed,
}: Props) {
  if (!refund && !loading) return null;

  const status = refund?.status ?? "";
  const showApprove = !!canManage && canApproveRefund(status);
  const showProcessed = !!canManage && canMarkRefundProcessed(status);
  const showReject = !!canManage && canRejectRefund(status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-3xl rounded-[12px] max-h-[90vh] overflow-y-auto"
        showCloseButton={false}
      >
        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div>
              <DialogTitle className="text-[#101928] text-[24px] font-semibold">
                Refund Details{refund ? ` - ${refund.refundId}` : ""}
              </DialogTitle>
              <DialogDescription className="text-[#667085] mt-1">
                Complete information about this refund request
              </DialogDescription>
            </div>
            <button
              aria-label="Close"
              className="size-8 rounded-full bg-[#E8EEFF] flex items-center justify-center"
              onClick={onClose}
            >
              <X color="#0B1E66" />
            </button>
          </div>

          {loading && !refund ? (
            <p className="text-center text-[#667085] py-8">
              Loading refund details…
            </p>
          ) : refund ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 bg-[#F8F9FB] p-5 rounded-[8px]">
                  <h3 className="text-[#0B1E66] text-[20px] font-semibold">
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-black text-sm mb-1">Customer Name</p>
                      <p className="text-[#909090] text-base font-medium">
                        {refund.customerName || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-black text-sm mb-1">Email Address</p>
                      <p className="text-[#909090] text-base font-medium">
                        {refund.customerEmail || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-black text-sm mb-1">Requested At</p>
                      <p className="text-[#909090] text-base font-medium">
                        {formatDate(refund.requestedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 bg-[#F8F9FB] p-5 rounded-[8px]">
                  <h3 className="text-[#0B1E66] text-lg font-semibold">
                    Order & Refund Details
                  </h3>
                  <div className="space-y-3 grid grid-cols-2 gap-5">
                    <div>
                      <p className="text-black text-sm mb-1">Order ID</p>
                      <p className="text-[#909090] text-base font-medium">
                        {refund.orderId || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-black text-sm mb-1">Refund ID</p>
                      <p className="text-[#909090] text-base font-medium">
                        {refund.refundId}
                      </p>
                    </div>
                    <div>
                      <p className="text-black text-sm mb-1">Refund Amount</p>
                      <p className="text-[#909090] text-base font-medium">
                        {formatCurrency(refund.amount, {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-black text-sm mb-1">Status</p>
                      <p className="text-[#909090] text-base font-medium">
                        {refund.status || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 bg-[#F8F9FB] p-5 rounded-[8px]">
                <h3 className="text-[#0B1E66] text-lg font-semibold">
                  Refund Reason
                </h3>
                <p className="text-[#909090] text-base">
                  {refund.reason || "-"}
                </p>
              </div>
            </div>
          ) : null}

          {(showApprove || showProcessed || showReject) && (
            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[#EEF1F6]">
              {showReject && (
                <Button
                  onClick={onReject}
                  disabled={actionLoading}
                  variant="outline"
                  className="flex-1 h-[52px] rounded-[8px] border-[#0B1E66] text-[#0B1E66] hover:bg-[#0B1E66]/10"
                >
                  Reject
                </Button>
              )}
              {showApprove && (
                <Button
                  onClick={onApprove}
                  disabled={actionLoading}
                  className="flex-1 h-[52px] rounded-[8px] bg-[#0B1E66] text-white hover:bg-[#0B1E66]/90"
                >
                  Approve
                </Button>
              )}
              {showProcessed && (
                <Button
                  onClick={onMarkProcessed}
                  disabled={actionLoading}
                  className="flex-1 h-[52px] rounded-[8px] bg-[#0B1E66] text-white hover:bg-[#0B1E66]/90"
                >
                  Mark processed
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
