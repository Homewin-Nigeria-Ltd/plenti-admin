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
import { Switch } from "@/components/ui/switch";
import { X, Copy, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useMarketingStore } from "@/store/useMarketingStore";
import type { CreatePromoCodeRequest, PromoCode, PromoCodeType } from "@/types/MarketingTypes";

type EditPromoCodeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  promoCode: PromoCode | null;
};

const DISCOUNT_OPTIONS: { value: PromoCodeType; label: string }[] = [
  { value: "percentage", label: "Percentage" },
  { value: "fixed", label: "Fixed Amount" },
];

function expiryToDateInput(expiry: string | null): string {
  if (!expiry) return "";
  try {
    const d = new Date(expiry);
    return d.toISOString().split("T")[0];
  } catch {
    return "";
  }
}

export function EditPromoCodeModal({
  isOpen,
  onClose,
  promoCode,
}: EditPromoCodeModalProps) {
  const { updatePromoCode, updatingPromoCode } = useMarketingStore();
  const [discountCode, setDiscountCode] = React.useState("");
  const [discountType, setDiscountType] = React.useState<PromoCodeType | "">("");
  const [usageLimit, setUsageLimit] = React.useState("");
  const [value, setValue] = React.useState("");
  const [minOrderAmount, setMinOrderAmount] = React.useState("");
  const [expiryDate, setExpiryDate] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);

  React.useEffect(() => {
    if (promoCode) {
      setDiscountCode(promoCode.code);
      setDiscountType(promoCode.type);
      setUsageLimit(String(promoCode.usage_limit));
      setValue(String(promoCode.value));
      setMinOrderAmount(String(promoCode.min_order_amount));
      setExpiryDate(expiryToDateInput(promoCode.expiry_date));
      setIsActive(promoCode.is_active);
    }
  }, [promoCode]);

  const handleCopyCode = () => {
    if (discountCode) {
      navigator.clipboard.writeText(discountCode);
      toast.success("Discount code copied to clipboard");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode) return;

    const code = discountCode.trim().toUpperCase();
    if (!code) {
      toast.error("Please enter a discount code");
      return;
    }
    if (!discountType) {
      toast.error("Please select a discount type");
      return;
    }
    const usageLimitNum = Number(usageLimit);
    const valueNum = Number(value);
    const minOrderNum = Number(minOrderAmount);
    if (!Number.isInteger(usageLimitNum) || usageLimitNum < 1) {
      toast.error("Please enter a valid usage limit (1 or more)");
      return;
    }
    if (!Number.isFinite(valueNum) || valueNum < 0) {
      toast.error("Please enter a valid value");
      return;
    }
    if (!Number.isFinite(minOrderNum) || minOrderNum < 0) {
      toast.error("Please enter a valid min order amount");
      return;
    }
    if (!expiryDate) {
      toast.error("Please select an expiry date");
      return;
    }

    const expiryDateTime = `${expiryDate}T23:59:59`;

    const payload: CreatePromoCodeRequest = {
      code,
      type: discountType,
      value: valueNum,
      min_order_amount: minOrderNum,
      usage_limit: usageLimitNum,
      expiry_date: expiryDateTime,
      is_active: isActive,
    };

    const ok = await updatePromoCode(promoCode.id, payload);

    if (!ok) {
      toast.error("Failed to update promo code");
      return;
    }

    toast.success("Promo code updated successfully");
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!promoCode) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[600px]" showCloseButton={false}>
        <DialogHeader className="relative pb-4">
          <DialogTitle className="text-2xl font-bold text-[#101928] mb-2">
            Edit Discount Code
          </DialogTitle>
          <DialogDescription className="text-[#667085] text-base font-normal">
            Update this discount code
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
          id="edit-promo-code-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label
              htmlFor="edit-discountCode"
              className="text-[#101928] font-medium"
            >
              Discount Code
            </Label>
            <div className="relative">
              <Input
                id="edit-discountCode"
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
            <Label
              htmlFor="edit-discountType"
              className="text-[#101928] font-medium"
            >
              Discount Type
            </Label>
            <Select
              value={discountType}
              onValueChange={(v) => setDiscountType(v as PromoCodeType)}
            >
              <SelectTrigger
                id="edit-discountType"
                className="w-full focus-visible:ring-0 h-[48px]"
              >
                <SelectValue placeholder="Select discount type" />
              </SelectTrigger>
              <SelectContent>
                {DISCOUNT_OPTIONS.map(({ value: v, label }) => (
                  <SelectItem key={v} value={v}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="edit-minOrderAmount"
              className="text-[#101928] font-medium"
            >
              Min. order amount
            </Label>
            <Input
              id="edit-minOrderAmount"
              type="number"
              placeholder="e.g. 5000"
              value={minOrderAmount}
              onChange={(e) => setMinOrderAmount(e.target.value)}
              className="focus-visible:ring-0 h-[48px]"
              min="0"
              step="1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-usageLimit" className="text-[#101928] font-medium">
              Usage Limit
            </Label>
            <Input
              id="edit-usageLimit"
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
            <Label htmlFor="edit-value" className="text-[#101928] font-medium">
              Value
            </Label>
            <Input
              id="edit-value"
              type="number"
              placeholder="Input value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="focus-visible:ring-0 h-[48px]"
              required
              min="0"
              step={discountType === "percentage" ? "1" : "0.01"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-expiryDate" className="text-[#101928] font-medium">
              Expiry date
            </Label>
            <div className="relative">
              <Input
                id="edit-expiryDate"
                type="date"
                placeholder="Input expiry date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="focus-visible:ring-0 h-[48px] pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                required
              />
              <Calendar
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none"
                size={18}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-input p-4">
            <Label htmlFor="edit-is_active" className="text-[#101928] font-medium">
              Active
            </Label>
            <Switch
              id="edit-is_active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              form="edit-promo-code-form"
              className="bg-[#1F3A78] hover:bg-[#1F3A78]/90 text-white w-full h-[52px] text-base font-medium"
              disabled={updatingPromoCode}
            >
              {updatingPromoCode ? "Updating…" : "Update Discount"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
