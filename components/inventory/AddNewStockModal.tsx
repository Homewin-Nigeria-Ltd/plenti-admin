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
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type AddNewStockModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AddNewStockModal({ isOpen, onClose }: AddNewStockModalProps) {
  const [productName, setProductName] = React.useState("");
  const [supplierName, setSupplierName] = React.useState("");
  const [warehouse, setWarehouse] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [expiryDate, setExpiryDate] = React.useState<Date | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      productName,
      supplierName,
      warehouse,
      quantity,
      expiryDate: expiryDate ? expiryDate.toISOString().split("T")[0] : "",
    });
    toast.success("Product added successfully");
    onClose();
    setProductName("");
    setSupplierName("");
    setWarehouse("");
    setQuantity("");
    setExpiryDate(undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] flex flex-col p-0 w-[95vw] !max-w-[557px] sm:!w-[557px] sm:!max-w-[557px]"
        showCloseButton={false}>
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-neutral-100 relative">
          <DialogTitle className="text-xl sm:text-2xl font-semibold">
            Add New Product
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-neutral-500">
            Add new product to your inventory
          </DialogDescription>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center justify-center size-[30px] bg-[#E8EEFF] rounded-full">
            <X color="#0B1E66" size={20} cursor="pointer" />
          </button>
        </DialogHeader>

        <form
          id="add-product-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              placeholder="Mr. Chef Salt"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplierName">Supplier Name</Label>
            <Input
              id="supplierName"
              placeholder="Nigerian Rice Mills Ltd"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="warehouse">Warehouse</Label>
            <Select value={warehouse} onValueChange={setWarehouse}>
              <SelectTrigger id="warehouse" className="form-control !w-full">
                <SelectValue placeholder="Abuja North" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wh001">North Warehouse</SelectItem>
                <SelectItem value="wh002">South Warehouse</SelectItem>
                <SelectItem value="wh003">East Warehouse</SelectItem>
                <SelectItem value="wh004">West Warehouse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="100"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Data</Label>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="expiryDate"
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
                    onSelect={(date) => {
                      setExpiryDate(date);
                      setIsDatePickerOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" className="btn btn-primary w-full">
              Add Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
