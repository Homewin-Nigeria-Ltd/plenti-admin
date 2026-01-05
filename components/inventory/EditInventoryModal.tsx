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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { X, CalendarIcon } from "lucide-react";
import type { InventoryItem, InventoryStatus } from "@/data/inventory";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type EditInventoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  warehouses: string[];
};

const statuses: InventoryStatus[] = ["High Stock", "Medium Stock", "Low Stock"];

export function EditInventoryModal({
  isOpen,
  onClose,
  item,
  warehouses,
}: EditInventoryModalProps) {
  const [warehouse, setWarehouse] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [expiryDate, setExpiryDate] = React.useState<Date | undefined>(undefined);
  const [status, setStatus] = React.useState<InventoryStatus | "">("");
  const [batch, setBatch] = React.useState("");
  const [supplier, setSupplier] = React.useState("");

  React.useEffect(() => {
    if (item) {
      setWarehouse(item.warehouseId);
      setQuantity(item.quantity.toString());
      setExpiryDate(item.expiryDate ? new Date(item.expiryDate) : undefined);
      setStatus(item.status);
      setBatch(item.batch);
      setSupplier(item.supplier);
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      itemId: item?.id,
      warehouse,
      quantity,
      expiryDate: expiryDate ? expiryDate.toISOString().split("T")[0] : "",
      status,
      batch,
      supplier,
    });
    toast.success("Inventory item updated successfully");
    onClose();
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] flex flex-col p-0 w-[95vw] !max-w-[557px] sm:!w-[557px] sm:!max-w-[557px]"
        showCloseButton={false}>
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-neutral-100 relative">
          <DialogTitle className="text-2xl font-semibold">
            Edit Inventory Item
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-500">
            Update inventory item information
          </DialogDescription>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-6 right-6 flex items-center justify-center size-[30px] bg-[#E8EEFF] rounded-full">
            <X color="#0B1E66" size={20} cursor="pointer" />
          </button>
        </DialogHeader>

        <form
          id="edit-inventory-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="edit-productName">Product Name</Label>
            <Input
              id="edit-productName"
              value={item.productName}
              className="form-control"
              readOnly
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-warehouse">Warehouse</Label>
              <Select value={warehouse} onValueChange={setWarehouse}>
                <SelectTrigger id="edit-warehouse" className="form-control !w-full">
                  <SelectValue placeholder="Select Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((wh) => (
                    <SelectItem key={wh} value={wh}>
                      {wh}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Quantity</Label>
              <Input
                id="edit-quantity"
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-expiryDate">Expiry Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="edit-expiryDate"
                    variant="outline"
                    className={cn(
                      "form-control w-full justify-start text-left font-normal",
                      !expiryDate && "text-neutral-500"
                    )}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiryDate ? (
                      expiryDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={expiryDate}
                    onSelect={setExpiryDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as InventoryStatus)}>
                <SelectTrigger id="edit-status" className="form-control !w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-batch">Batch Number</Label>
              <Input
                id="edit-batch"
                placeholder="Batch Number"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-supplier">Supplier</Label>
              <Input
                id="edit-supplier"
                placeholder="Supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="form-control"
                required
              />
            </div>
          </div>
        </form>

        <div className="px-4 sm:px-6 py-4 border-t border-neutral-100">
          <Button
            type="submit"
            form="edit-inventory-form"
            className="btn btn-primary w-full">
            Update Inventory Item
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
