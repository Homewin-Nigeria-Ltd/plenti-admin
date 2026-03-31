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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { INVENTORY_API } from "@/data/inventory";
import type { CreateWarehouseRequest } from "@/types/InventoryTypes";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAccountStore } from "@/store/useAccountStore";

type AddWarehouseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

type ManagerOption = {
  id: number;
  name: string;
  displayName: string;
};

export function AddWarehouseModal({
  isOpen,
  onClose,
  onSuccess,
}: AddWarehouseModalProps) {
  const account = useAccountStore((state) => state.account);
  const isAdminUser = (account?.role ?? "").toLowerCase() === "admin";
  const [name, setName] = React.useState("");
  const [managerUserId, setManagerUserId] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [managerOptions, setManagerOptions] = React.useState<ManagerOption[]>([]);
  const [loadingManagers, setLoadingManagers] = React.useState(false);
  const [openManager, setOpenManager] = React.useState(false);

  const getApiErrorMessage = (err: unknown): string | null => {
    if (typeof err !== "object" || err === null) return null;
    const response = (err as { response?: unknown }).response;
    if (typeof response !== "object" || response === null) return null;
    const data = (response as { data?: unknown }).data;
    if (typeof data !== "object" || data === null) return null;
    const message = (data as { message?: unknown }).message;
    return typeof message === "string" ? message : null;
  };

  React.useEffect(() => {
    if (!isOpen || !isAdminUser) return;
    let cancelled = false;
    const fetchManagers = async () => {
      setLoadingManagers(true);
      try {
        const { data } = await api.get<{
          data?: Array<
            | string
            | {
                id?: number | string | null;
                name?: string | null;
                full_name?: string | null;
                manager_code?: string | null;
                display_name?: string | null;
                role?: string | null;
              }
          >;
        }>(INVENTORY_API.getWarehouseManagersList);
        if (cancelled) return;
        const list = Array.isArray(data?.data) ? data.data : [];
        const managers = list
          .map((entry): ManagerOption | null => {
            if (typeof entry === "string") return null;
            const id = Number(entry?.id);
            const name = (entry?.name ?? entry?.full_name ?? "").trim();
            const role = (entry?.role ?? "").trim().toLowerCase();
            const displayName =
              (entry?.display_name ?? "").trim() ||
              (entry?.manager_code ? `${name} (${String(entry.manager_code).trim()})` : name);
            if (!Number.isFinite(id) || id <= 0 || !name || role !== "admin") return null;
            return { id, name, displayName };
          })
          .filter((entry): entry is ManagerOption => entry !== null);
        const unique = Array.from(new Map(managers.map((m) => [m.id, m])).values());
        setManagerOptions(unique);
      } catch (error) {
        if (cancelled) return;
        console.error("Error fetching warehouse managers =>", error);
        setManagerOptions([]);
      } finally {
        if (cancelled) return;
        setLoadingManagers(false);
      }
    };
    void fetchManagers();
    return () => {
      cancelled = true;
    };
  }, [isOpen, isAdminUser]);

  React.useEffect(() => {
    if (!isAdminUser) {
      setManagerUserId("");
      setOpenManager(false);
    }
  }, [isAdminUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const resolvedManagerUserId = managerUserId.trim()
        ? Number(managerUserId)
        : (!isAdminUser && account?.id ? Number(account.id) : undefined);

      const payload: CreateWarehouseRequest = {
        name: name.trim(),
        location: location.trim(),
        description: description.trim(),
        ...(typeof resolvedManagerUserId === "number" && Number.isFinite(resolvedManagerUserId)
          ? { manager_user_id: resolvedManagerUserId }
          : {}),
      };

      const { data } = await api.post<{
        status?: string;
        message?: string;
      }>(INVENTORY_API.createWarehouse, payload);

      if (data?.status === "success") {
        toast.success("Warehouse created successfully");
        setName("");
        setManagerUserId("");
        setLocation("");
        setDescription("");
        onClose();
        onSuccess?.();
      } else {
        toast.error(data?.message || "Failed to create warehouse");
      }
    } catch (error) {
      console.error("Error creating warehouse =>", error);
      toast.error(getApiErrorMessage(error) ?? "Failed to create warehouse");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-h-[90vh] flex flex-col p-0 w-[95vw] max-w-139.25 sm:w-139.25 sm:max-w-139.25"
        showCloseButton={false}
      >
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-neutral-100 relative">
          <DialogTitle className="text-xl sm:text-2xl font-semibold">
            Add Warehouse
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-neutral-500">
            Create a new warehouse location
          </DialogDescription>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            disabled={isSubmitting}
            className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center justify-center size-7.5 bg-[#E8EEFF] rounded-full disabled:opacity-50"
          >
            <X color="#0B1E66" size={20} cursor="pointer" />
          </button>
        </DialogHeader>

        <form
          id="add-warehouse-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 sm:space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="warehouse-name">Warehouse Name</Label>
            <Input
              id="warehouse-name"
              placeholder="Lagos Main Warehouse"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              required
              disabled={isSubmitting}
            />
          </div>

          {isAdminUser && (
            <div className="space-y-2">
              <Label htmlFor="manager">Manager</Label>
              <Popover open={openManager} onOpenChange={setOpenManager}>
                <PopoverTrigger asChild>
                  <Button
                    id="manager"
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={openManager}
                    disabled={isSubmitting || loadingManagers}
                    className={cn(
                      "form-control w-full justify-between font-normal",
                      !managerUserId && "text-muted-foreground",
                    )}
                  >
                    {loadingManagers
                      ? "Loading managers..."
                      : managerOptions.find((m) => String(m.id) === managerUserId)?.displayName ||
                        "Select manager"}
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search manager..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No manager found.</CommandEmpty>
                      <CommandGroup>
                        {managerOptions.map((option) => (
                          <CommandItem
                            key={option.id}
                            value={`${option.name} ${option.displayName} ${option.id}`}
                            onSelect={() => {
                              setManagerUserId(String(option.id));
                              setOpenManager(false);
                            }}
                          >
                            {option.displayName}
                            <Check
                              className={cn(
                                "ml-auto size-4",
                                managerUserId === String(option.id) ? "opacity-100" : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Ikeja, Lagos"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="form-control"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              placeholder="Main distribution center"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control w-full min-h-25 resize-none"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#0B1E66] hover:bg-[#0B1E66]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Creating...
                </span>
              ) : (
                "Create Warehouse"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
