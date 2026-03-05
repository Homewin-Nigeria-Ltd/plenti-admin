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
import {
  type CommissionStructure,
  type CommissionType,
  useCommissionStructuresStore,
} from "@/store/useCommissionStructuresStore";

type CreateCommissionStructureModalProps = {
  isOpen: boolean;
  structure?: CommissionStructure | null;
  onClose: () => void;
};

export default function CreateCommissionStructureModal({
  isOpen,
  structure,
  onClose,
}: CreateCommissionStructureModalProps) {
  const [name, setName] = React.useState("");
  const [commissionType, setCommissionType] =
    React.useState<CommissionType>("FLAT_COMMISSION");
  const [rate, setRate] = React.useState("");
  const [bonusAmount, setBonusAmount] = React.useState("");
  const [minThreshold, setMinThreshold] = React.useState("");
  const [maxThreshold, setMaxThreshold] = React.useState("");
  const [minimumLevel, setMinimumLevel] = React.useState("");
  const [maximumLevel, setMaximumLevel] = React.useState("");
  const [localError, setLocalError] = React.useState<string | null>(null);

  const { saving, error, createStructure, updateStructure } =
    useCommissionStructuresStore();

  React.useEffect(() => {
    if (!isOpen) return;

    if (structure) {
      setName(structure.name ?? "");
      setCommissionType(structure.commission_type ?? "  FLAT_COMMISSION");
      setRate(structure.rate !== undefined ? String(structure.rate) : "");
      setBonusAmount(
        structure.bonus_amount !== undefined
          ? String(structure.bonus_amount)
          : "",
      );
      setMinThreshold(
        structure.min_threshold !== undefined
          ? String(structure.min_threshold)
          : "",
      );
      setMaxThreshold(
        structure.max_threshold !== undefined
          ? String(structure.max_threshold)
          : "",
      );
      setMinimumLevel(
        structure.minimum_level !== undefined
          ? String(structure.minimum_level)
          : "",
      );
      setMaximumLevel(
        structure.maximum_level !== undefined
          ? String(structure.maximum_level)
          : "",
      );
      setLocalError(null);
      return;
    }

    setName("");
    setCommissionType("FLAT_COMMISSION");
    setRate("");
    setBonusAmount("");
    setMinThreshold("");
    setMaxThreshold("");
    setMinimumLevel("");
    setMaximumLevel("");
    setLocalError(null);
  }, [isOpen, structure]);

  const isTier = commissionType === "TIER";

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      name: name.trim(),
      commission_type: commissionType,
      rate: Number(rate),
      bonus_amount: Number(bonusAmount),
      min_threshold: Number(minThreshold),
      max_threshold: Number(maxThreshold),
      minimum_level: isTier ? Number(minimumLevel) : null,
      maximum_level: isTier ? Number(maximumLevel) : null,
    };

    if (!payload.name) {
      setLocalError("Name is required");
      return;
    }

    if (Number.isNaN(payload.rate) || payload.rate < 0 || payload.rate > 1) {
      setLocalError("Rate must be between 0 and 1");
      return;
    }

    if (payload.min_threshold > payload.max_threshold) {
      setLocalError("Min threshold cannot be greater than max threshold");
      return;
    }

    if (
      isTier &&
      (Number.isNaN(payload.minimum_level ?? NaN) ||
        Number.isNaN(payload.maximum_level ?? NaN))
    ) {
      setLocalError("Minimum and maximum level are required for tier type");
      return;
    }

    setLocalError(null);

    const success = structure
      ? await updateStructure(structure.id, payload)
      : await createStructure(payload);

    if (!success) {
      return;
    }

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
            {structure
              ? "Edit Commission Structure"
              : "Create Commission Structure"}
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
              placeholder="Enter a commission name"
              className="form-control h-14 text-[16px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[16px] font-medium text-[#878787]">
              Commission Type
            </Label>
            <Select
              value={commissionType}
              onValueChange={(value: CommissionType) =>
                setCommissionType(value)
              }
            >
              <SelectTrigger className="w-full h-14 py-6">
                <SelectValue placeholder="Select Commission Type" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="FLAT_COMMISSION">
                    Flat Commission
                  </SelectItem>
                  <SelectItem value="TIER">Tier</SelectItem>
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
                placeholder="Enter a rate"
                className="form-control h-14 text-[16px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[16px] font-medium text-[#878787]">
                Bonus Amount (₦)
              </Label>
              <Input
                value={bonusAmount}
                onChange={(event) => setBonusAmount(event.target.value)}
                placeholder="Enter a bonus amount"
                className="form-control h-14 text-[16px]"
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
                placeholder="Enter a minimum threshold"
                className="form-control h-14 text-[16px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[16px] font-medium text-[#878787]">
                Max Threshold (₦)
              </Label>
              <Input
                value={maxThreshold}
                onChange={(event) => setMaxThreshold(event.target.value)}
                placeholder="Enter a maximum threshold"
                className="form-control h-14 text-[16px]"
              />
            </div>
          </div>

          {isTier ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-[16px] font-medium text-[#878787]">
                  Minimum Level
                </Label>
                <Input
                  value={minimumLevel}
                  onChange={(event) => setMinimumLevel(event.target.value)}
                  placeholder="Enter a minimum level"
                  className="form-control h-14 text-[16px]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[16px] font-medium text-[#878787]">
                  Maximum Level
                </Label>
                <Input
                  value={maximumLevel}
                  onChange={(event) => setMaximumLevel(event.target.value)}
                  placeholder="Enter a maximum level"
                  className="form-control h-14 text-[16px]"
                />
              </div>
            </div>
          ) : null}

          {localError || error ? (
            <p className="text-sm text-red-600">{localError ?? error}</p>
          ) : null}

          <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-12 border-primary text-base font-semibold text-primary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-12 text-base font-semibold"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
