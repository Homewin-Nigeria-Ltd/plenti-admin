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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Copy, Calendar } from "lucide-react";
import { toast } from "sonner";
import type { PromoCodeType } from "@/data/promoCodes";

type CreatePromoCodeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const discountTypes: PromoCodeType[] = ["Percentage", "Fixed Amount"];

export function CreatePromoCodeModal({
  isOpen,
  onClose,
}: CreatePromoCodeModalProps) {
  const [discountCode, setDiscountCode] = React.useState("");
  const [discountType, setDiscountType] = React.useState<PromoCodeType | "">(
    ""
  );
  const [usageLimit, setUsageLimit] = React.useState("");
  const [value, setValue] = React.useState("");
  const [expiryDate, setExpiryDate] = React.useState("");

  const handleCopyCode = () => {
    if (discountCode) {
      navigator.clipboard.writeText(discountCode);
      toast.success("Discount code copied to clipboard");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!discountCode || !discountType || !usageLimit || !value || !expiryDate) {
      toast.error("Please fill in all fields");
      return;
    }

    // Here you would typically make an API call to create the promo code
    console.log({
      discountCode,
      discountType,
      usageLimit,
      value,
      expiryDate,
    });

    toast.success("Discount code created successfully");

    // Reset form
    setDiscountCode("");
    setDiscountType("");
    setUsageLimit("");
    setValue("");
    setExpiryDate("");

    onClose();
  };

  const handleClose = () => {
    // Reset form when closing
    setDiscountCode("");
    setDiscountType("");
    setUsageLimit("");
    setValue("");
    setExpiryDate("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[600px]" showCloseButton={false}>
        <DialogHeader className="relative pb-4">
          <DialogTitle className="text-2xl font-bold text-[#101928] mb-2">
            Create Discount Code
          </DialogTitle>
          <DialogDescription className="text-[#667085] text-base font-normal">
            Create a new discount code for customers
          </DialogDescription>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="absolute top-0 right-0 flex items-center justify-center size-8 bg-[#E8EEFF] rounded-full hover:bg-[#E8EEFF]/80 transition-colors"
          >
            <X color="#0B1E66" size={18} />
          </button>
        </DialogHeader>

        <form
          id="create-promo-code-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="discountCode" className="text-[#101928] font-medium">
              Discount Code
            </Label>
            <div className="relative">
              <Input
                id="discountCode"
                placeholder="e.g DISCOUNT 123"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                className="focus-visible:ring-0 h-[48px] pr-10"
                required
              />
              {discountCode && (
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#101928] transition-colors"
                  aria-label="Copy discount code"
                >
                  <Copy size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountType" className="text-[#101928] font-medium">
              Discount Type
            </Label>
            <Select
              value={discountType}
              onValueChange={(value) => setDiscountType(value as PromoCodeType)}
            >
              <SelectTrigger
                id="discountType"
                className="w-full focus-visible:ring-0 h-[48px]"
              >
                <SelectValue placeholder="Select discount type" />
              </SelectTrigger>
              <SelectContent>
                {discountTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="usageLimit" className="text-[#101928] font-medium">
              Usage Limit
            </Label>
            <Input
              id="usageLimit"
              type="number"
              placeholder="Input usage Limit"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              className="focus-visible:ring-0 h-[48px]"
              required
              min="1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="value" className="text-[#101928] font-medium">
              Value
            </Label>
            <Input
              id="value"
              type="number"
              placeholder="Input value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="focus-visible:ring-0 h-[48px]"
              required
              min="0"
              step={discountType === "Percentage" ? "1" : "0.01"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate" className="text-[#101928] font-medium">
              Expiry Data
            </Label>
            <div className="relative">
              <Input
                id="expiryDate"
                type="date"
                placeholder="Input expiry date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="focus-visible:ring-0 h-[48px] pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                required
                min={new Date().toISOString().split("T")[0]}
              />
              <Calendar
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none"
                size={18}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              form="create-promo-code-form"
              className="bg-[#1F3A78] hover:bg-[#1F3A78]/90 text-white w-full h-[52px] text-base font-medium"
            >
              Create Discount
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

