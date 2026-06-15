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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRiderStore } from "@/store/useRiderStore";
import type { RiderVehicleType } from "@/types/RiderTypes";
import { Loader2, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

const VEHICLE_OPTIONS: { value: RiderVehicleType; label: string }[] = [
  { value: "motorcycle", label: "Motorcycle" },
  { value: "bicycle", label: "Bicycle" },
  { value: "van", label: "Van" },
];

type OnboardRiderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="text-sm font-medium text-[#344054] block mb-2">
      {children}
      {required ? <span className="text-red-500 ml-0.5">*</span> : null}
    </label>
  );
}

const emptyForm = () => ({
  fullName: "",
  phone: "",
  email: "",
  vehicleType: "" as RiderVehicleType | "",
});

export function OnboardRiderModal({
  isOpen,
  onClose,
  onSuccess,
}: OnboardRiderModalProps) {
  const { createRider, creatingRider } = useRiderStore();
  const [form, setForm] = React.useState(emptyForm);
  const [fieldErrors, setFieldErrors] = React.useState<{
    name?: string;
    phone?: string;
    email?: string;
    vehicle_type?: string;
  }>({});

  const isValid = React.useMemo(() => {
    const name = form.fullName.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return name.length > 0 && phone.length > 0 && emailOk;
  }, [form]);

  const handleClose = () => {
    setForm(emptyForm());
    setFieldErrors({});
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setFieldErrors({});
    const res = await createRider({
      name: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      vehicle_type: form.vehicleType || undefined,
    });

    if (!res.ok) {
      setFieldErrors({
        name: res.errors?.name?.[0] ?? res.errors?.full_name?.[0],
        phone: res.errors?.phone?.[0] ?? res.errors?.phone_number?.[0],
        email: res.errors?.email?.[0],
        vehicle_type: res.errors?.vehicle_type?.[0],
      });
      toast.error(res.message ?? "Failed to onboard rider");
      return;
    }

    toast.success(res.message ?? "Rider onboarded successfully");
    handleClose();
    onSuccess?.();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        className="max-w-[480px] w-[95vw] p-0 gap-0 overflow-hidden"
        showCloseButton={false}
      >
        <DialogHeader className="relative px-6 pt-6 pb-4 border-b border-neutral-100">
          <DialogTitle className="text-xl font-semibold text-[#101928] pr-12">
            Onboard New Rider
          </DialogTitle>
          <DialogDescription className="sr-only">
            Add a new rider to the onboarding queue
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

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="px-6 py-5 space-y-5">
            <div>
              <FieldLabel required>Full Name</FieldLabel>
              <Input
                placeholder="Input full name here"
                value={form.fullName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, fullName: e.target.value }))
                }
                className="form-control h-[53px] bg-white"
              />
              {fieldErrors.name ? (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>
              ) : null}
            </div>

            <div>
              <FieldLabel required>Phone Number</FieldLabel>
              <Input
                type="tel"
                placeholder="Input phone number here"
                value={form.phone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="form-control h-[53px] bg-white"
              />
              {fieldErrors.phone ? (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>
              ) : null}
            </div>

            <div>
              <FieldLabel required>Email Address</FieldLabel>
              <Input
                type="email"
                placeholder="Input email address here"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="form-control h-[53px] bg-white"
              />
              {fieldErrors.email ? (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
              ) : null}
            </div>

            <div>
              <FieldLabel>Vehicle Type</FieldLabel>
              <Select
                value={form.vehicleType || undefined}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    vehicleType: value as RiderVehicleType,
                  }))
                }
              >
                <SelectTrigger className="form-control h-[53px] w-full bg-white">
                  <SelectValue placeholder="Select Vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.vehicle_type ? (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.vehicle_type}</p>
              ) : null}
            </div>
          </div>

          <div className="px-6 pb-6 pt-2">
            <Button
              type="submit"
              disabled={!isValid || creatingRider}
              className="btn btn-primary w-full h-12 font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#C7D7FF] disabled:text-[#667085]"
            >
              {creatingRider ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Onboarding…
                </>
              ) : (
                "Onboard Rider"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
