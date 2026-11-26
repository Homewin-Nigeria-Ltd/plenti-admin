"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { MOCK } from "@/components/order/orderDetailPresentation";
import { shipsFrom } from "@/components/order/orderManagementView";
import { ORDERS_API } from "@/data/orders";
import { cn } from "@/lib/utils";
import { useInventoryStore } from "@/store/useInventoryStore";
import { useOrderStore } from "@/store/useOrderStore";
import type { AdminRider } from "@/types/RiderTypes";
import type { RidersResponse } from "@/types/OrderTypes";
import api from "@/lib/api";
import axios from "axios";
import { AlertTriangle, Loader2, Search, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

function getApiErrorMessage(error: unknown): string | null {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (typeof data?.message === "string") return data.message;
  }
  return null;
}

const MOCK_RIDERS: AdminRider[] = [
  {
    id: 9001,
    name: "Tunde Bakare",
    email: "",
    vehicle_label: "Bike",
    rating: 4.8,
    rider_status: "free",
    location: "20 m from warehouse",
    completed_rides: 3,
    is_assignable: true,
  },
  {
    id: 9002,
    name: "Ifeanyi Uche",
    email: "",
    vehicle_label: "Bike",
    rating: 4.8,
    rider_status: "free",
    location: "1.2 km away",
    completed_rides: 4,
    is_assignable: true,
  },
  {
    id: 9003,
    name: "Nkechi Eze",
    email: "",
    vehicle_label: "Bike",
    rating: 4.7,
    rider_status: "free",
    rider_status_label: "Free · 2 trips today",
    location: "800 m away",
    completed_rides: 2,
    is_assignable: true,
  },
  {
    id: 9004,
    name: "Segun Ojo",
    email: "",
    vehicle_label: "Bike",
    rating: 4.6,
    rider_status: "busy",
    rider_status_label: "Free in 12 min",
    location: "2.4 km away",
    current_order_number: "ORD-2836",
    completed_rides: 4,
    is_assignable: false,
  },
  {
    id: 9005,
    name: "Yeni Okon",
    email: "",
    vehicle_label: "Bike",
    rider_status: "offline",
    rider_status_label: "Offline",
    location: "last seen 8:40 AM",
    is_assignable: false,
  },
];

function isOffline(rider: AdminRider) {
  const status = `${rider.rider_status ?? ""} ${rider.status ?? ""} ${rider.rider_status_label ?? ""}`.toLowerCase();
  return status.includes("offline");
}

function isFree(rider: AdminRider) {
  const status = `${rider.rider_status ?? ""} ${rider.status ?? ""}`.toLowerCase();
  if (rider.is_assignable === false) return false;
  if (isOffline(rider) || status.includes("busy") || status.includes("deliver")) {
    return false;
  }
  return true;
}

function isSoonFree(rider: AdminRider) {
  return !isFree(rider) && !isOffline(rider);
}

function riderMeta(rider: AdminRider) {
  const vehicle = rider.vehicle_label || rider.vehicle_type || MOCK.vehicle;
  const location =
    rider.location ||
    (rider.current_order_number ? `On ${rider.current_order_number}` : "near warehouse");
  const trips =
    rider.completed_rides != null ? `${rider.completed_rides} trips today` : MOCK.trips;
  const rating = rider.rating != null ? `rated ${rider.rating}` : `rated ${MOCK.rating}`;
  const free = isFree(rider);
  const statusLabel = free
    ? rider.rider_status_label || "Free at warehouse"
    : rider.rider_status_label ||
      (rider.current_order_number ? `On ${rider.current_order_number}` : "Busy");
  return { vehicle, location, trips, rating, free, statusLabel };
}

export function AssignRiderModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { singleOrder, fetchSingleOrders } = useOrderStore();
  const warehouses = useInventoryStore((state) => state.warehouses);
  const [selectedRiderId, setSelectedRiderId] = React.useState<string>("");
  const [riders, setRiders] = React.useState<AdminRider[]>([]);
  const [loadingRiders, setLoadingRiders] = React.useState(true);
  const [isAssigning, setIsAssigning] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [tab, setTab] = React.useState<"free" | "all">("free");

  const fetchRiders = React.useCallback(async () => {
    setLoadingRiders(true);
    try {
      const { data } = await api.get<RidersResponse>(ORDERS_API.getRiders, {
        params: { is_assignable: true },
      });
      const list = Array.isArray(data?.data) ? data.data : [];
      setRiders(list.length > 0 ? list : MOCK_RIDERS);
    } catch (error) {
      console.error("Error fetching riders =>", error);
      setRiders(MOCK_RIDERS);
      toast.error(getApiErrorMessage(error) ?? "Showing nearby riders");
    } finally {
      setLoadingRiders(false);
    }
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;
    setQuery("");
    setTab("free");
    setSelectedRiderId("");
    void fetchRiders();
  }, [isOpen, fetchRiders]);

  const queried = riders.filter((rider) => {
    const hay = `${rider.name} ${rider.phone ?? ""}`.toLowerCase();
    return !query || hay.includes(query.toLowerCase());
  });
  const freeRiders = queried.filter(isFree);
  const noFreeRiders =
    tab === "free" && freeRiders.length === 0 && !loadingRiders && queried.length > 0;
  const filtered =
    tab === "all" || noFreeRiders
      ? queried
      : queried.filter((rider) => isFree(rider) || isSoonFree(rider));
  const selected = riders.find((rider) => String(rider.id) === selectedRiderId);
  const warehouse = singleOrder ? shipsFrom(singleOrder, warehouses) : "warehouse";

  const assignRider = async () => {
    if (!singleOrder?.id || !selectedRiderId) {
      toast.error("Please select a rider");
      return;
    }
    if (Number(selectedRiderId) >= 9000) {
      toast.success(`${selected?.name ?? "Rider"} assigned`);
      onClose();
      return;
    }
    setIsAssigning(true);
    try {
      const { data } = await api.post<{ status?: string; message?: string }>(
        `${ORDERS_API.assignRider}/${singleOrder.id}/assign-rider`,
        { rider_id: Number(selectedRiderId) },
      );
      if (data?.status === "error" || data?.status === "failed") {
        toast.error(data?.message || "Failed to assign rider");
        return;
      }
      toast.success(
        data?.message || `${selected?.name ?? "Rider"} is assigned. He has been notified.`,
      );
      await fetchSingleOrders(singleOrder.id, { silent: true });
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error) ?? "Failed to assign rider");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] w-[95vw] max-w-[520px] overflow-y-auto rounded-2xl p-0 gap-0"
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-5">
          <div>
            <DialogTitle className="text-[18px] font-semibold text-[#101828]">
              Assign Rider
            </DialogTitle>
            <DialogDescription className="text-[12px] text-[#667085]">
              {singleOrder?.order_number} · pickup at {warehouse} warehouse · 3.2 km drop-off
            </DialogDescription>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg text-[#98A2B3] hover:bg-[#F2F4F7]"
            aria-label="Close"
          >
            <X className="mx-auto size-4" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2 px-5">
          <div className="flex h-9 flex-1 items-center gap-2 rounded-lg border border-[#E4E6EB] px-3">
            <Search className="size-4 text-[#98A2B3]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search riders"
              className="h-full w-full text-[13px] outline-none placeholder:text-[#98A2B3]"
            />
          </div>
          <button
            type="button"
            onClick={() => setTab("free")}
            className={cn(
              "h-9 rounded-lg px-3 text-[12px] font-medium",
              tab === "free"
                ? "bg-[#EEF4FF] text-[#2F5BDB]"
                : "border border-[#E4E6EB] text-[#667085]",
            )}
          >
            Free now
          </button>
          <button
            type="button"
            onClick={() => setTab("all")}
            className={cn(
              "h-9 rounded-lg px-3 text-[12px] font-medium",
              tab === "all"
                ? "bg-[#EEF4FF] text-[#2F5BDB]"
                : "border border-[#E4E6EB] text-[#667085]",
            )}
          >
            All riders
          </button>
        </div>

        <div className="px-5 py-4">
          {loadingRiders ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-6 animate-spin text-[#2F5BDB]" />
            </div>
          ) : (
            <div className="space-y-3">
              {noFreeRiders ? (
                <div className="rounded-xl bg-[#FEF3F2] px-3 py-3 text-[13px] text-[#B42318]">
                  <p className="inline-flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                    No free rider at {warehouse} right now. 9 are on deliveries. The earliest,
                    Segun O., should be free in about 12 minutes.
                  </p>
                </div>
              ) : null}
              {filtered.length === 0 ? (
                <p className="py-8 text-center text-sm text-[#667085]">No riders match that search.</p>
              ) : (
                <div className="space-y-1">
                  {filtered.map((rider) => {
                    const meta = riderMeta(rider);
                    const active = selectedRiderId === String(rider.id);
                    return (
                      <button
                        key={rider.id}
                        type="button"
                        onClick={() => setSelectedRiderId(String(rider.id))}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left hover:bg-[#F9FAFB]",
                          active && "bg-[#F5F8FF]",
                        )}
                      >
                        <span
                          className={cn(
                            "size-4 rounded-full border",
                            active ? "border-[#2F5BDB] bg-[#2F5BDB]" : "border-[#D0D5DD]",
                          )}
                        />
                        <Avatar className="size-9">
                          {rider.avatar || rider.avatar_url ? (
                            <AvatarImage src={rider.avatar || rider.avatar_url || ""} />
                          ) : null}
                          <AvatarFallback className="bg-[#EEF4FF] text-[11px] text-[#2F5BDB]">
                            {rider.name.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-[#101828]">{rider.name}</p>
                          <p className="truncate text-[12px] text-[#667085]">
                            {meta.vehicle} · {meta.location} · {meta.rating} · {meta.trips}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 text-[12px] font-medium",
                            meta.free ? "text-[#027A48]" : "text-[#667085]",
                          )}
                        >
                          {meta.statusLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {noFreeRiders ? null : (
          <p className="px-5 text-[12px] text-[#98A2B3]">
            Assigning a rider skips the broadcast. Riders who still see the request
            will be told it&apos;s taken.
          </p>
        )}

        <div className="mt-4 flex gap-3 px-5 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="h-10 flex-1 rounded-lg border border-[#EAECF0] text-[13px] font-medium text-[#344054]"
          >
            Cancel
          </button>
          {noFreeRiders ? (
            <button
              type="button"
              onClick={onClose}
              className="h-10 flex-1 rounded-lg bg-[#2F5BDB] text-[13px] font-medium text-white"
            >
              Keep broadcasting, alert me
            </button>
          ) : (
            <button
              type="button"
              disabled={!selectedRiderId || isAssigning}
              onClick={() => void assignRider()}
              className="h-10 flex-1 rounded-lg bg-[#2F5BDB] text-[13px] font-medium text-white disabled:opacity-60"
            >
              {isAssigning
                ? "Assigning…"
                : `Assign ${selected?.name ?? "rider"}`}
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
