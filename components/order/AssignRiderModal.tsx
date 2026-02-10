"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import * as React from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useOrderStore } from "@/store/useOrderStore";
import { ORDERS_API } from "@/data/orders";
import type { Rider, RidersResponse } from "@/types/OrderTypes";
import api from "@/lib/api";

export function AssignRiderModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { singleOrder, fetchSingleOrders } = useOrderStore();
  const [selectedRiderId, setSelectedRiderId] = React.useState<string>("");
  const [riders, setRiders] = React.useState<Rider[]>([]);
  const [loadingRiders, setLoadingRiders] = React.useState(false);
  const [isAssigning, setIsAssigning] = React.useState(false);

  const fetchRiders = React.useCallback(async () => {
    setLoadingRiders(true);
    try {
      const { data } = await api.get<RidersResponse>(ORDERS_API.getRiders);

      if (data?.status === "success" && Array.isArray(data?.data)) {
        setRiders(data.data);
      } else {
        toast.error("Failed to fetch riders");
      }
    } catch (error) {
      console.error("Error fetching riders =>", error);
      toast.error("Failed to fetch riders");
    } finally {
      setLoadingRiders(false);
    }
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      fetchRiders();
    }
  }, [isOpen, fetchRiders]);

  const assignRider = async () => {
    if (!singleOrder?.id || !selectedRiderId) {
      toast.error("Please select a rider");
      return;
    }

    setIsAssigning(true);
    try {
      const { data } = await api.post<{ status?: string; message?: string }>(
        `${ORDERS_API.assignRider}/${singleOrder.id}/assign-rider`,
        { rider_id: Number(selectedRiderId) }
      );

      if (data?.status === "success") {
        toast.success(
          `Rider has been assigned to order ${singleOrder.order_number ?? ""}`
        );
        await fetchSingleOrders(singleOrder.id);
        onClose();
        setSelectedRiderId("");
      } else {
        toast.error(data?.message || "Failed to assign rider");
      }
    } catch (error) {
      console.error("Error assigning rider =>", error);
      toast.error("Failed to assign rider");
    } finally {
      setIsAssigning(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[750px]" showCloseButton={false}>
        <DialogHeader className="relative">
          <DialogTitle className="font-medium text-[24px]">
            Assign Rider to Order – {singleOrder?.order_number ?? "—"}
          </DialogTitle>
          <DialogDescription className="text-[#808080] text-[14px] font-normal">
            Select a delivery agent for the order
          </DialogDescription>

          <div className="flex items-center gap-2 absolute top-2 right-6">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="flex items-center justify-center size-[30px] bg-[#E8EEFF] rounded-full"
            >
              <X color="#0B1E66" size={20} cursor="pointer" />
            </button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-6">
          <div className="space-y-2">
            <p className="text-[14px] text-[#1A1A1A]">Select Rider</p>
            {loadingRiders ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="size-5 animate-spin text-[#0B1E66]" />
              </div>
            ) : (
              <Select
                value={selectedRiderId}
                onValueChange={setSelectedRiderId}
                disabled={isAssigning}
              >
                <SelectTrigger className="w-full rounded-[6px] border border-[#D0D5DD] px-3 py-6">
                  <SelectValue placeholder="Click to select Rider" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="rounded-2xl border-0 shadow-lg focus-visible:ring-0 translate-y-12"
                  side="bottom"
                >
                  {riders.length === 0 ? (
                    <div className="px-2 py-4 text-sm text-[#667085] text-center">
                      No riders available
                    </div>
                  ) : (
                    riders.map((rider) => (
                      <SelectItem key={rider.id} value={String(rider.id)}>
                        <div className="flex items-center gap-2">
                          <Avatar className="size-6">
                            <AvatarFallback className="text-xs">
                              {getInitials(rider.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{rider.name}</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-[#EEF1F6] bg-[#F9FAFB] p-6 space-y-4">
              <p className="text-[#1F3A78] font-semibold">Payment Details</p>
              <div className="space-y-1">
                <p className="text-[#101928] font-medium">Payment Method</p>
                <p className="text-[#667085] text-sm">
                  {singleOrder?.payment_method ?? "—"}
                </p>
              </div>
              <div className="space-y-1 mt-5">
                <p className="text-[#101928] font-medium">Payment Status</p>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${
                    (singleOrder?.payment_status ?? "").toLowerCase() === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  <span
                    className={`size-2 rounded-full ${
                      (singleOrder?.payment_status ?? "").toLowerCase() ===
                      "paid"
                        ? "bg-green-600"
                        : "bg-amber-600"
                    }`}
                  />
                  {singleOrder?.payment_status ?? "—"}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-[#101928] text-[16px] font-medium">
                  Transaction Reference
                </p>
                <p className="text-[#98A2B3] text-sm">
                  {singleOrder?.payment_reference ?? "—"}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-[#EEF1F6] bg-[#F9FAFB] p-6 space-y-4">
              <p className="text-[#1F3A78] font-semibold">Shipping Details</p>
              <div className="space-y-1">
                <p className="text-[#101928] font-medium">Shipping Address</p>
                <p className="text-[#667085] text-sm">
                  {singleOrder?.shipping_address ?? "—"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[#101928] font-medium">Shipping Details</p>
                <p className="text-[#98A2B3] text-sm">
                  {singleOrder?.delivery_tracking ?? "—"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[#101928] font-medium">Shipping Fee</p>
                <p className="text-[#98A2B3] text-sm">—</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#101928] font-medium">Phone</p>
                <p className="text-[#98A2B3] text-sm">
                  {singleOrder?.phone_number ?? "—"}
                </p>
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={assignRider}
            disabled={!selectedRiderId || isAssigning || loadingRiders}
            className="w-full h-[52px] rounded-xl bg-[#0B1E66] hover:bg-[#0B1E66] disabled:opacity-50"
          >
            {isAssigning ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Assigning...
              </span>
            ) : (
              "Assign Rider"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
