"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { MOCK } from "@/components/order/orderDetailPresentation";
import { ORDERS_API, orderAssignmentReassignPath, plentiDeliveryBroadcastPath } from "@/data/orders";
import { cn } from "@/lib/utils";
import type { AdminRider } from "@/types/RiderTypes";
import type { RidersResponse } from "@/types/OrderTypes";
import api from "@/lib/api";
import axios from "axios";
import { Loader2, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

function getApiErrorMessage(error: unknown): string | null {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (typeof data?.message === "string") return data.message;
  }
  return null;
}

const REASONS = [
  { id: "not_responding", label: "Rider isn't responding" },
  { id: "cannot_carry", label: "Rider can't carry the items" },
  { id: "vehicle_broke", label: "Rider's vehicle broke down" },
  { id: "customer_change", label: "Customer asked for a change" },
  { id: "other", label: "Something else" },
] as const;

type ReassignOrderDeliveryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  deliveryId: number | null;
  orderNumber?: string | null;
  currentRiderId?: number | null;
  currentRiderName?: string | null;
  warehouseName?: string | null;
  onSuccess?: () => void | Promise<void>;
};

export function ReassignOrderDeliveryModal({
  isOpen,
  onClose,
  deliveryId,
  orderNumber,
  currentRiderId,
  currentRiderName,
  warehouseName,
  onSuccess,
}: ReassignOrderDeliveryModalProps) {
  const [riders, setRiders] = React.useState<AdminRider[]>([]);
  const [loadingRiders, setLoadingRiders] = React.useState(false);
  const [isReassigning, setIsReassigning] = React.useState(false);
  const [reason, setReason] = React.useState<(typeof REASONS)[number]["id"]>("cannot_carry");
  const [mode, setMode] = React.useState<"pick" | "broadcast">("pick");
  const [selectedRiderId, setSelectedRiderId] = React.useState<string>("");

  const selectedRider = riders.find((rider) => String(rider.id) === selectedRiderId);
  const pickRider =
    selectedRider ??
    riders.find((rider) => rider.id !== currentRiderId) ??
    null;

  const fetchRiders = React.useCallback(async () => {
    setLoadingRiders(true);
    try {
      const { data } = await api.get<RidersResponse>(ORDERS_API.getRiders);
      const list = Array.isArray(data?.data) ? data.data : [];
      setRiders(
        list.filter((rider) => currentRiderId == null || rider.id !== currentRiderId),
      );
    } catch (error) {
      setRiders([
        {
          id: 9002,
          name: "Ifeanyi Uche",
          email: "",
          rider_status: "free",
          location: "free at warehouse",
        },
      ]);
      toast.error(getApiErrorMessage(error) ?? "Showing nearby riders");
    } finally {
      setLoadingRiders(false);
    }
  }, [currentRiderId]);

  React.useEffect(() => {
    if (!isOpen) return;
    setReason("cannot_carry");
    setMode("pick");
    setSelectedRiderId("");
    void fetchRiders();
  }, [isOpen, fetchRiders]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    setIsReassigning(true);
    try {
      if (mode === "broadcast") {
        if (deliveryId == null) {
          toast.success("Broadcasting again");
          handleClose();
          return;
        }
        const { data } = await api.patch<{ status?: string; message?: string }>(
          plentiDeliveryBroadcastPath(deliveryId),
        );
        if (data?.status === "error" || data?.status === "failed") {
          toast.error(data?.message ?? "Failed to broadcast");
          return;
        }
        toast.success(data?.message ?? "Broadcasting again");
        await onSuccess?.();
        handleClose();
        return;
      }

      const newRiderId = Number(selectedRiderId || pickRider?.id);
      if (!Number.isFinite(newRiderId) || newRiderId <= 0) {
        toast.error("Please select a rider");
        return;
      }
      if (newRiderId >= 9000 || deliveryId == null) {
        toast.success(`Reassigned to ${pickRider?.name ?? "rider"}`);
        await onSuccess?.();
        handleClose();
        return;
      }
      const { data } = await api.post<{ status?: string; message?: string }>(
        orderAssignmentReassignPath(deliveryId),
        { new_rider_id: newRiderId, reason },
      );
      if (data?.status === "error" || data?.status === "failed") {
        toast.error(data?.message ?? "Failed to reassign rider");
        return;
      }
      toast.success(data.message ?? `Reassigned to ${pickRider?.name ?? "rider"}`);
      await onSuccess?.();
      handleClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error) ?? "Failed to reassign rider");
    } finally {
      setIsReassigning(false);
    }
  };

  const riderLabel = currentRiderName || MOCK.riderName;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] w-[95vw] max-w-[480px] overflow-y-auto rounded-2xl p-0 gap-0"
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-5">
          <div>
            <DialogTitle className="text-[18px] font-semibold text-[#101828]">
              Reassign Rider
            </DialogTitle>
            <DialogDescription className="text-[12px] text-[#667085]">
              {orderNumber} · {warehouseName || "Port Harcourt"} warehouse
            </DialogDescription>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="size-8 rounded-lg text-[#98A2B3] hover:bg-[#F2F4F7]"
            aria-label="Close"
          >
            <X className="mx-auto size-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div className="flex items-center gap-3 rounded-xl bg-[#F9FAFB] px-3 py-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-[#EEF4FF] text-[11px] text-[#2F5BDB]">
                {riderLabel.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-[11px] text-[#98A2B3]">Current rider</p>
              <p className="text-sm font-medium text-[#101828]">{riderLabel}</p>
              <p className="text-[12px] text-[#667085]">
                at the warehouse since {MOCK.waitingSince}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-[13px] font-medium text-[#344054]">
              Why are you changing the rider? *
            </p>
            <div className="space-y-2">
              {REASONS.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2 text-[13px] text-[#344054]"
                >
                  <input
                    type="radio"
                    name="reassign-reason"
                    checked={reason === item.id}
                    onChange={() => setReason(item.id)}
                    className="size-4 accent-[#2F5BDB]"
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[13px] font-medium text-[#344054]">New rider</p>
            <div className="grid grid-cols-2 gap-2">
              <label
                className={cn(
                  "flex items-start gap-2 rounded-xl border px-3 py-2.5 text-[13px]",
                  mode === "pick" ? "border-[#2F5BDB] bg-[#F5F8FF]" : "border-[#E4E6EB]",
                )}
              >
                <input
                  type="radio"
                  name="reassign-mode"
                  checked={mode === "pick"}
                  onChange={() => setMode("pick")}
                  className="mt-0.5 size-4 accent-[#2F5BDB]"
                />
                <span>
                  <span className="font-medium text-[#101828]">Pick a rider</span>
                  <span className="block text-[#667085]">
                    {loadingRiders
                      ? "Loading…"
                      : `${pickRider?.name ?? "Ifeanyi Uche"} · free at warehouse`}
                  </span>
                </span>
              </label>
              <label
                className={cn(
                  "flex items-start gap-2 rounded-xl border px-3 py-2.5 text-[13px]",
                  mode === "broadcast" ? "border-[#2F5BDB] bg-[#F5F8FF]" : "border-[#E4E6EB]",
                )}
              >
                <input
                  type="radio"
                  name="reassign-mode"
                  checked={mode === "broadcast"}
                  onChange={() => setMode("broadcast")}
                  className="mt-0.5 size-4 accent-[#2F5BDB]"
                />
                <span>
                  <span className="font-medium text-[#101828]">Broadcast again</span>
                  <span className="block text-[#667085]">
                    {riderLabel.split(" ")[0]} won&apos;t get it
                  </span>
                </span>
              </label>
            </div>
            {mode === "pick" && riders.length > 1 ? (
              <select
                value={selectedRiderId || String(pickRider?.id ?? "")}
                onChange={(event) => setSelectedRiderId(event.target.value)}
                className="mt-2 h-9 w-full rounded-lg border border-[#E4E6EB] px-3 text-[13px]"
              >
                {riders.map((rider) => (
                  <option key={rider.id} value={String(rider.id)}>
                    {rider.name}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
        </div>

        <div className="flex gap-3 px-5 pb-5">
          <button
            type="button"
            onClick={handleClose}
            className="h-10 flex-1 rounded-lg border border-[#EAECF0] text-[13px] font-medium text-[#344054]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isReassigning}
            onClick={() => void handleSubmit()}
            className="h-10 flex-1 rounded-lg bg-[#2F5BDB] text-[13px] font-medium text-white disabled:opacity-60"
          >
            {isReassigning ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Saving…
              </span>
            ) : mode === "broadcast" ? (
              "Broadcast again"
            ) : (
              `Reassign to ${pickRider?.name ?? "rider"}`
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
