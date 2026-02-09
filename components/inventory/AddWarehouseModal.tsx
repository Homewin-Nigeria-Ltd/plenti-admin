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
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { INVENTORY_API } from "@/data/inventory";
import type { CreateWarehouseRequest } from "@/types/InventoryTypes";
import api from "@/lib/api";

type AddWarehouseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function AddWarehouseModal({
  isOpen,
  onClose,
  onSuccess,
}: AddWarehouseModalProps) {
  const [name, setName] = React.useState("");
  const [manager, setManager] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: CreateWarehouseRequest = {
        name: name.trim(),
        manager: manager.trim(),
        location: location.trim(),
        description: description.trim(),
      };

      const { data } = await api.post<{
        status?: string;
        message?: string;
      }>(INVENTORY_API.createWarehouse, payload);

      if (data?.status === "success") {
        toast.success("Warehouse created successfully");
        setName("");
        setManager("");
        setLocation("");
        setDescription("");
        onClose();
        onSuccess?.();
      } else {
        toast.error(data?.message || "Failed to create warehouse");
      }
    } catch (error) {
      console.error("Error creating warehouse =>", error);
      toast.error("Failed to create warehouse");
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
        className="max-h-[90vh] flex flex-col p-0 w-[95vw] max-w-[557px] sm:w-[557px] sm:max-w-[557px]"
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
            className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center justify-center size-[30px] bg-[#E8EEFF] rounded-full disabled:opacity-50"
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

          <div className="space-y-2">
            <Label htmlFor="manager">Manager</Label>
            <Input
              id="manager"
              placeholder="John Manager"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              className="form-control"
              required
              disabled={isSubmitting}
            />
          </div>

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
              className="form-control w-full min-h-[100px] resize-none"
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
