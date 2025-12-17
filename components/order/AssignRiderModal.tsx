"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import { ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import * as React from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

export function AssignRiderModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [value, setValue] = React.useState<string | undefined>(undefined);
  const riders = [
    { name: "Ayibaemi Obubra", initial: "A" },
    { name: "Aisha Garba", initial: "A" },
    { name: "Oluwaseun Oyeleke", initial: "O" },
    { name: "Simon Obiano", initial: "S" },
    { name: "Martha Okafor", initial: "M" },
    { name: "Martha Wokoma", initial: "M" },
    { name: "Stephen Oduah", initial: "S" },
  ];

  function assignRider() {
    onClose();
    toast.success("Rider has been assigned to order ORD-2841");
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[750px]" showCloseButton={false}>
        <DialogHeader className="relative">
          <DialogTitle className="font-medium text-[24px]">
            Assign Rider to Order - ORD-2841
          </DialogTitle>
          <DialogDescription className="text-[#808080] text-[14px] font-normal">
            Select a delivery agent for the order
          </DialogDescription>

          <div className="flex items-center gap-[8px] absolute top-2 right-6">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="flex items-center justify-center size-[30px] bg-[#E8EEFF] rounded-full">
              <X color="#0B1E66" size={20} cursor="pointer" />
            </button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-6">
          <div className="space-y-2">
            <p className="text-[14px] text-[#1A1A1A]">Select Rider</p>
            <Select value={value} onValueChange={setValue}>
              <SelectTrigger className="w-full rounded-[6px] border border-[#D0D5DD] px-3 py-6">
                <SelectValue placeholder="Click to select Rider" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="rounded-[12px] border-0 shadow-lg focus-visible:ring-0 translate-y-12"
                side="bottom">
                {riders.map((r) => (
                  <SelectItem key={r.name} value={r.name}>
                    <Avatar className="size-6">
                      <AvatarFallback>{r.initial}</AvatarFallback>
                    </Avatar>
                    <span>{r.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-[#EEF1F6] bg-[#F9FAFB] p-6 space-y-4">
              <p className="text-[#1F3A78] font-semibold">Payment Details</p>
              <div className="space-y-1">
                <p className="text-[#101928] font-medium">Payment Method</p>
                <p className="text-[#667085] text-sm">
                  Pay with Cards, Bank Transfer or USSD
                </p>
              </div>
              <div className="space-y-1 mt-5">
                <p className="text-[#101928] font-medium">Payment Status</p>
                <span className="inline-flex items-center gap-2 rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm">
                  <span className="size-2 rounded-full bg-green-600"></span>
                  Successful
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-[#101928] text-[16px] font-medium">
                  Transaction Reference
                </p>
                <p className="text-[#98A2B3] text-sm">197HIT237-MOTES</p>
              </div>
            </div>

            <div className="rounded-xl border border-[#EEF1F6] bg-[#F9FAFB] p-6 space-y-4">
              <p className="text-[#1F3A78] font-semibold">Shipping Details</p>
              <div className="space-y-1">
                <p className="text-[#101928] font-medium">Shipping Address</p>
                <p className="text-[#667085] text-sm">
                  188 Awolowo Way Ikoyi Lagos
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[#101928] font-medium">Shipping Details</p>
                <p className="text-[#98A2B3] text-sm">
                  Door Delivery. Delivery between 27 Aug and 28 Aug.
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[#101928] font-medium">Shipping Fee</p>
                <p className="text-[#98A2B3] text-sm">₦ 200</p>
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={assignRider}
            className="w-full h-[52px] rounded-[8px] bg-[#0B1E66] hover:bg-[#0B1E66]">
            Assign Rider
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
