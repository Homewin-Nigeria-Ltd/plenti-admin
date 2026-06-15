"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RIDERS_API, riderReassignOrderPath } from "@/data/riders";
import { getInitialsFromName } from "@/lib/riderDisplay";
import { cn } from "@/lib/utils";
import type { AdminRider, RidersListResponse } from "@/types/RiderTypes";
import api from "@/lib/api";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

type ReassignRiderOrderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  riderId: number;
  riderName: string;
  orderNumber?: string | null;
  onSuccess?: () => void;
};

export function ReassignRiderOrderModal({
  isOpen,
  onClose,
  riderId,
  riderName,
  orderNumber,
  onSuccess,
}: ReassignRiderOrderModalProps) {
  const [riders, setRiders] = React.useState<AdminRider[]>([]);
  const [loadingRiders, setLoadingRiders] = React.useState(false);
  const [isReassigning, setIsReassigning] = React.useState(false);
  const [selectedRiderId, setSelectedRiderId] = React.useState<string>("");
  const [comboboxOpen, setComboboxOpen] = React.useState(false);

  const selectedRider = React.useMemo(
    () => riders.find((r) => String(r.id) === selectedRiderId) ?? null,
    [riders, selectedRiderId],
  );

  const fetchRiders = React.useCallback(async () => {
    setLoadingRiders(true);
    try {
      const { data } = await api.get<RidersListResponse>(RIDERS_API.list, {
        params: { per_page: 100 },
      });
      if (data?.status === "success" && data.data) {
        setRiders((data.data.items ?? []).filter((r) => r.id !== riderId));
      } else {
        setRiders([]);
        toast.error("Failed to load riders");
      }
    } catch (error) {
      console.error("Error fetching riders =>", error);
      setRiders([]);
      toast.error("Failed to load riders");
    } finally {
      setLoadingRiders(false);
    }
  }, [riderId]);

  React.useEffect(() => {
    if (!isOpen) return;
    setSelectedRiderId("");
    setComboboxOpen(false);
    void fetchRiders();
  }, [isOpen, fetchRiders]);

  const handleClose = () => {
    setSelectedRiderId("");
    setComboboxOpen(false);
    onClose();
  };

  const handleReassign = async () => {
    const newRiderId = Number(selectedRiderId);
    if (!Number.isFinite(newRiderId) || newRiderId <= 0) {
      toast.error("Please select a rider");
      return;
    }

    setIsReassigning(true);
    try {
      const { data } = await api.post<{ status?: string; message?: string }>(
        riderReassignOrderPath(riderId),
        { new_rider_id: newRiderId },
      );

      if (data?.status === "success") {
        toast.success(
          data.message ??
            `Order ${orderNumber ?? ""} reassigned to ${selectedRider?.name ?? "rider"}`,
        );
        onSuccess?.();
        handleClose();
      } else {
        toast.error(data?.message ?? "Failed to reassign order");
      }
    } catch (error) {
      console.error("Error reassigning order =>", error);
      toast.error("Failed to reassign order");
    } finally {
      setIsReassigning(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="max-w-[480px] w-[95vw] p-0 gap-0" showCloseButton={false}>
        <DialogHeader className="relative px-6 pt-6 pb-4 border-b border-neutral-100">
          <DialogTitle className="font-semibold text-xl text-[#101928] pr-12">
            Reassign Order
          </DialogTitle>
          <DialogDescription className="text-sm text-[#667085]">
            {orderNumber
              ? `Choose a new rider for ${orderNumber}`
              : `Choose a new rider for ${riderName}'s current delivery`}
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

        <div className="px-6 py-5 space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#101928]">Select Rider</p>
            {loadingRiders ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="size-6 animate-spin text-[#0B1E66]" />
              </div>
            ) : (
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={comboboxOpen}
                    disabled={isReassigning}
                    className={cn(
                      "w-full justify-between h-12 rounded-xl border-[#D0D5DD] font-normal",
                      !selectedRiderId && "text-[#667085]",
                    )}
                  >
                    {selectedRider ? selectedRider.name : "Select rider"}
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-(--radix-popover-trigger-width) p-0"
                  align="start"
                >
                  <Command>
                    <CommandInput placeholder="Search rider..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No riders found.</CommandEmpty>
                      <CommandGroup>
                        {riders.map((rider) => (
                          <CommandItem
                            key={rider.id}
                            value={`${rider.name} ${rider.email ?? ""} ${rider.phone_number ?? rider.phone ?? ""}`}
                            onSelect={() => {
                              setSelectedRiderId(String(rider.id));
                              setComboboxOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <Avatar className="size-7 shrink-0">
                                <AvatarFallback className="text-xs bg-[#E8EEFF] text-[#0B1E66]">
                                  {getInitialsFromName(rider.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{rider.name}</p>
                                {(rider.phone_number ?? rider.phone) ? (
                                  <p className="text-xs text-[#667085] truncate">
                                    {rider.phone_number ?? rider.phone}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto size-4 shrink-0",
                                selectedRiderId === String(rider.id)
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          </div>

          <Button
            type="button"
            onClick={() => void handleReassign()}
            disabled={!selectedRiderId || isReassigning || loadingRiders}
            className="w-full h-12 rounded-xl bg-[#0B1E66] hover:bg-[#0B1E66]/90 disabled:opacity-50"
          >
            {isReassigning ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Reassigning…
              </span>
            ) : (
              "Reassign Order"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
