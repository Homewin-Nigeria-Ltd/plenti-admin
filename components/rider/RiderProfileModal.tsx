"use client";

import { ReassignRiderOrderModal } from "@/components/rider/ReassignRiderOrderModal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  formatRiderStatusLabel,
  getCompletedRides,
  getRiderActiveOrderNumber,
  getRiderJoinedDate,
  getRiderLocation,
  getRiderPhone,
  getRiderRating,
  getRiderStatus,
  RIDER_EMPTY,
  getRiderStatusBadgeClass,
  riderHasActiveDelivery,
} from "@/lib/riderDisplay";
import { useRiderStore } from "@/store/useRiderStore";
import type { AdminRider } from "@/types/RiderTypes";
import { Loader2, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

type RiderProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  riderId: number | null;
  previewRider?: AdminRider | null;
  onOpenChat?: (riderId: number) => void;
  onRiderUpdated?: () => void;
};

function InfoCell({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-[#F9FAFB] border border-[#EAECF0] px-4 py-3 min-h-[72px] flex flex-col justify-center gap-1">
      <p className="text-xs text-[#667085]">{label}</p>
      <p className="text-sm font-medium text-[#101928] break-words">{value}</p>
    </div>
  );
}

export function RiderProfileModal({
  isOpen,
  onClose,
  riderId,
  previewRider,
  onOpenChat,
  onRiderUpdated,
}: RiderProfileModalProps) {
  const {
    singleRider,
    currentDelivery,
    loadingSingle,
    suspending,
    fetchRiderDetail,
    suspendRider,
    unsuspendRider,
    clearSingleRider,
  } = useRiderStore();

  const [isReassignOpen, setIsReassignOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen || !riderId) return;
    void fetchRiderDetail(riderId);
  }, [isOpen, riderId, fetchRiderDetail]);

  const handleClose = () => {
    clearSingleRider();
    onClose();
  };

  const rider = singleRider;
  const status = rider ? getRiderStatus(rider) : "";
  const statusLabel = rider?.rider_status_label?.trim()
    ? rider.rider_status_label
    : formatRiderStatusLabel(status);
  const showActiveDelivery =
    currentDelivery != null ||
    (rider ? riderHasActiveDelivery(rider) : false);
  const activeOrderNumber =
    currentDelivery?.order_number?.trim() ||
    (rider ? getRiderActiveOrderNumber(rider) : null);

  const isSuspended = status.toLowerCase() === "suspended";

  const handleSuspendToggle = async () => {
    if (!rider?.id) return;
    const ok = isSuspended
      ? await unsuspendRider(rider.id)
      : await suspendRider(rider.id);
    if (ok) {
      toast.success(
        isSuspended
          ? `${rider.name} has been unsuspended`
          : `${rider.name} has been suspended`,
      );
      onRiderUpdated?.();
    } else {
      toast.error(isSuspended ? "Failed to unsuspend rider" : "Failed to suspend rider");
    }
  };

  const handleOpenChat = () => {
    if (!rider?.id) return;
    const riderId = rider.id;
    handleClose();
    onOpenChat?.(riderId);
  };

  const handleReassign = () => {
    if (!rider?.id) return;
    setIsReassignOpen(true);
  };

  const handleReassignSuccess = () => {
    if (!rider?.id) return;
    void fetchRiderDetail(rider.id);
    onRiderUpdated?.();
  };

  return (
    <>
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        className="max-w-[520px] w-[95vw] p-0 gap-0 overflow-hidden"
        showCloseButton={false}
      >
        {loadingSingle ? (
          <>
            <DialogTitle className="sr-only">Loading rider profile</DialogTitle>
            <div className="flex flex-col items-center justify-center min-h-[320px] gap-3 px-6 py-12">
              <Loader2 className="size-10 animate-spin text-[#0B1E66]" />
              <p className="text-sm text-[#667085]">Loading rider profile…</p>
            </div>
          </>
        ) : !rider ? (
          <>
            <DialogTitle className="sr-only">Rider not found</DialogTitle>
            <div className="px-6 py-12 text-center text-sm text-[#667085]">
              Rider profile could not be loaded.
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="relative px-6 pt-6 pb-4 border-b border-neutral-100 shrink-0">
              <DialogTitle className="font-semibold text-xl text-[#101928] pr-12">
                Rider Profile
              </DialogTitle>
              <DialogDescription className="sr-only">
                Profile and actions for {rider.name}
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

            <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-semibold text-[#101928]">{rider.name}</h2>
                <span className={`badge capitalize ${getRiderStatusBadgeClass(status)}`}>
                  {statusLabel}
                </span>
              </div>

              {showActiveDelivery && (
                <div className="rounded-xl bg-[#E8EEFF] border border-[#C7D7FF] px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-[#0B1E66] mb-1">
                      Currently Delivering
                    </p>
                    <p className="text-2xl font-bold text-[#0B1E66] tracking-tight">
                      {activeOrderNumber ?? RIDER_EMPTY}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReassign}
                    className="btn btn-outline bg-white shrink-0"
                  >
                    Reassign Order
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoCell label="Phone" value={getRiderPhone(rider) || RIDER_EMPTY} />
                <InfoCell label="Email" value={rider.email || RIDER_EMPTY} />
                <InfoCell label="Rating" value={getRiderRating(rider)} />
                <InfoCell
                  label="Completed Orders"
                  value={String(getCompletedRides(rider))}
                />
                <InfoCell label="Location" value={getRiderLocation(rider)} />
                <InfoCell label="Date Joined" value={getRiderJoinedDate(rider)} />
              </div>
            </div>

            <div className="px-6 py-5 border-t border-neutral-100 flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={suspending}
                onClick={() => void handleSuspendToggle()}
                className={
                  isSuspended
                    ? "flex-1 h-12 rounded-xl border-[#0B1E66] text-[#0B1E66] hover:bg-[#E8EEFF] bg-white"
                    : "flex-1 h-12 rounded-xl border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 bg-white"
                }
              >
                {suspending ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    {isSuspended ? "Unsuspending…" : "Suspending…"}
                  </>
                ) : isSuspended ? (
                  "Unsuspend Rider"
                ) : (
                  "Suspend Rider"
                )}
              </Button>
              <Button
                type="button"
                onClick={handleOpenChat}
                className="flex-1 h-12 rounded-xl bg-[#E8EEFF] text-[#0B1E66] hover:bg-[#d6e2ff] font-semibold"
              >
                Open Chat
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>

    {rider ? (
      <ReassignRiderOrderModal
        isOpen={isReassignOpen}
        onClose={() => setIsReassignOpen(false)}
        riderId={rider.id}
        riderName={rider.name}
        orderNumber={activeOrderNumber}
        onSuccess={handleReassignSuccess}
      />
    ) : null}
    </>
  );
}
