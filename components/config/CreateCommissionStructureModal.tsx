"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import * as React from "react";

type CreateCommissionStructureModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateCommissionStructureModal({
  isOpen,
  onClose,
}: CreateCommissionStructureModalProps) {
  const [name, setName] = React.useState("Referral");
  const [rate, setRate] = React.useState("0.005");
  const [bonusAmount, setBonusAmount] = React.useState("0");
  const [minThreshold, setMinThreshold] = React.useState("0");
  const [maxThreshold, setMaxThreshold] = React.useState("0");

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="min-w-[90vw] md:min-w-[50vw] rounded-2xl border border-[#EAECF0] p-0"
        showCloseButton={false}
      >
        <DialogHeader className="relative px-6 pt-6 pb-2 sm:px-8 sm:pt-8">
          <DialogTitle className="text-[24px] font-medium text-black">
            Create Commission Structure
          </DialogTitle>
          <DialogDescription className="mt-1 text-[14px] text-[#808080]">
            Set the commission rate, type, and thresholds.
          </DialogDescription>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-6 right-6 flex size-8 items-center justify-center rounded-full bg-[#E8EEFF] text-[#0B1E66]"
          >
            <X className="size-6" />
          </button>
        </DialogHeader>

        <form
          onSubmit={handleSave}
          className="space-y-5 px-6 pb-6 sm:px-8 sm:pb-8"
        >
          <div className="space-y-2">
            <Label className="text-[16px] font-medium text-[#878787]">
              Name
            </Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="form-control h-14 text-[16px] placeholder:text-[#101928]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[16px] font-medium text-[#878787]">
              Commission Type
            </Label>
            <Select>
              <SelectTrigger className="w-full h-14 py-6">
                <SelectValue placeholder="Select Commission Type" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="percentage">Flat Percentage</SelectItem>
                  <SelectItem value="tiered">Tiered</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-[16px] font-medium text-[#878787]">
                Rate (decimal, e.g. 0.05 = 5%)
              </Label>
              <Input
                value={rate}
                onChange={(event) => setRate(event.target.value)}
                className="form-control h-14 text-[16px] placeholder:text-[#101928]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[16px] font-medium text-[#878787]">
                Bonus Amount (₦)
              </Label>
              <Input
                value={bonusAmount}
                onChange={(event) => setBonusAmount(event.target.value)}
                className="form-control h-14 text-[16px] placeholder:text-[#101928]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-[16px] font-medium text-[#878787]">
                Min Threshold (₦)
              </Label>
              <Input
                value={minThreshold}
                onChange={(event) => setMinThreshold(event.target.value)}
                className="form-control h-14 text-[16px] placeholder:text-[#101928]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[16px] font-medium text-[#878787]">
                Max Threshold (₦)
              </Label>
              <Input
                value={maxThreshold}
                onChange={(event) => setMaxThreshold(event.target.value)}
                className="form-control h-14 text-[16px] placeholder:text-[#101928]"
              />
            </div>
          </div>

          <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-12 border-primary text-base font-semibold text-primary"
            >
              Cancel
            </Button>
            <Button type="submit" className="h-12 text-base font-semibold">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
