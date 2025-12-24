"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function NewRefundRequestModal({ isOpen, onClose }: Props) {
  const [reason, setReason] = React.useState<string>("");
  const [orderId, setOrderId] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const [notes, setNotes] = React.useState<string>("");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.info("Refund Request Issued Succesfully");
    onClose();
    setReason("");
    setOrderId("");
    setAmount("");
    setNotes("");
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-xl rounded-[12px]"
        showCloseButton={false}
      >
        <div className="relative">
          <div className="">
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-[#101928] text-[24px]">
                  Create New Refund Request
                </DialogTitle>
                <DialogDescription className="text-[#667085]">
                  Initiate a new refund for a customer order
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
          </div>

          <form onSubmit={submit}>
            <div className="mt-4 space-y-4">
              <div className="space-y-1">
                <Label
                  htmlFor="order-id"
                  className="text-[#878787] text-[16px]"
                >
                  Order ID
                </Label>
                <Input
                  id="order-id"
                  placeholder="Input customer order ID"
                  className="placeholder:text-[#98A2B3] border-[#D0D5DD] h-[55px] rounded-[6px]"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="amount" className="text-[#878787] text-[16px]">
                  Refund Amount
                </Label>
                <Input
                  id="amount"
                  placeholder="Input refund amount"
                  className="placeholder:text-[#98A2B3] border-[#D0D5DD] h-[55px] rounded-[6px]"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="reason" className="text-[#878787] text-[16px]">
                  Refund Reason
                </Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger className="w-full py-7">
                    <SelectValue placeholder="Select refund reason" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="damaged">Damaged item</SelectItem>
                    <SelectItem value="wrong-item">
                      Wrong item delivered
                    </SelectItem>
                    <SelectItem value="late">Late delivery</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="notes" className="text-[#878787] text-[16px]">
                  Refund Reason Details
                </Label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Provide detailed explanation on the reason for refund"
                  className="w-full min-h-28 rounded-md border border-[#EEF1F6] p-3 outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-[#98A2B3]"
                />
              </div>
            </div>

            <div className="mt-4">
              <Button
                type="submit"
                className="w-full h-[52px] rounded-[8px] bg-[#0B1E66] text-white hover:bg-[#0B1E66]/90"
              >
                Create Refund Request
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
