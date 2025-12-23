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

type RefundRequest = {
  refundDate: string;
  refundId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number;
  orderAmount?: number;
  orderId?: string;
  transactionId?: string;
  paymentMethod?: string;
  paymentGateway?: string;
  orderStatus: string;
  orderStatusDescription: string;
  status: "Approved" | "Processing" | "Rejected";
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  refund: RefundRequest | null;
  onApprove?: () => void;
  onReject?: () => void;
};

export function RefundDetailsModal({
  isOpen,
  onClose,
  refund,
  onApprove,
  onReject,
}: Props) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleApproveClick = () => {
    if (onApprove) {
      onApprove();
    }
    onClose(); // Close the refund details modal
  };

  const handleRejectClick = () => {
    if (onReject) {
      onReject();
    }
    onClose(); // Close the refund details modal
  };

  if (!refund) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-3xl rounded-[12px] max-h-[90vh] overflow-y-auto"
        showCloseButton={false}
      >
        <div className="relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <DialogTitle className="text-[#101928] text-[24px] font-semibold">
                Refund Details - {refund.refundId}
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

          {/* Content */}
          <div className="space-y-6">
            {/* Customer Information and Order & Payment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="space-y-4 bg-[#F8F9FB] p-5 rounded-[8px]">
                <h3 className="text-[#0B1E66] text-[20px] font-semibold">
                  Customer Information
                </h3>
                <div className="space-y-3 flex flex-col justify-between">
                  <div>
                    <p className="text-black text-sm mb-1">Customer Name</p>
                    <p className="text-[#909090] text-base font-medium">
                      {refund.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-black text-sm mb-1">Email Address</p>
                    <p className="text-[#909090] text-base font-medium">
                      {refund.customerEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-black text-sm mb-1">Phone Number</p>
                    <p className="text-[#909090] text-base font-medium">
                      {refund.customerPhone || "+234 801 234 5678"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order & Payment Details */}
              <div className="space-y-4 bg-[#F8F9FB] p-5 rounded-[8px]">
                <h3 className="text-[#0B1E66] text-lg font-semibold">
                  Order & Payment Details
                </h3>
                <div className="space-y-3 grid grid-cols-2 gap-5">
                  <div>
                    <p className="text-black text-sm mb-1">Order ID</p>
                    <p className="text-[#909090] text-base font-medium">
                      {refund.orderId || "ORD-2841"}
                    </p>
                  </div>
                  <div>
                    <p className="text-black text-sm mb-1">Transaction ID</p>
                    <p className="text-[#909090] text-base font-medium">
                      {refund.transactionId || "TXN-8901"}
                    </p>
                  </div>
                  <div>
                    <p className="text-black text-sm mb-1">Order Amount</p>
                    <p className="text-[#909090] text-base font-medium">
                      {refund.orderAmount
                        ? formatCurrency(refund.orderAmount)
                        : formatCurrency(refund.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-black text-sm mb-1">Refund Amount</p>
                    <p className="text-[#909090] text-base font-medium">
                      {formatCurrency(refund.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-black text-sm mb-1">Payment Method</p>
                    <p className="text-[#909090] text-base font-medium">
                      {refund.paymentMethod || "Card"}
                    </p>
                  </div>
                  <div>
                    <p className="text-black text-sm mb-1">Payment Gateway</p>
                    <p className="text-[#909090] text-base font-medium">
                      {refund.paymentGateway || "Paystack"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Refund Reason */}
            <div className="space-y-4 bg-[#F8F9FB] p-5 rounded-[8px]">
              <h3 className="text-[#0B1E66] text-lg font-semibold">
                Refund Reason
              </h3>
              <div className="space-y-3 grid grid-cols-2 gap-5">
                <div>
                  <p className="text-black text-sm mb-1">Category</p>
                  <p className="text-[#909090] text-base font-medium">
                    {refund.orderStatus}
                  </p>
                </div>
                <div>
                  <p className="text-black text-sm mb-1">Details</p>
                  <p className="text-[#909090] text-base">
                    {refund.orderStatusDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[#EEF1F6]">
            <Button
              onClick={handleRejectClick}
              variant="outline"
              className="flex-1 h-[52px] rounded-[8px] border-[#0B1E66] text-[#0B1E66] hover:bg-[#0B1E66]/10"
            >
              Reject
            </Button>
            <Button
              onClick={handleApproveClick}
              className="flex-1 h-[52px] rounded-[8px] bg-[#0B1E66] text-white hover:bg-[#0B1E66]/90"
            >
              Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
