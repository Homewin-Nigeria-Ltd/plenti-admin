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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInventoryStore } from "@/store/useInventoryStore";
import api from "@/lib/api";
import { INVENTORY_API } from "@/data/inventory";
import type { InventoryItemApi } from "@/types/InventoryTypes";

function getApiErrorMessage(err: unknown): string | null {
  if (typeof err !== "object" || err === null) return null;
  const response = (err as { response?: unknown }).response;
  if (typeof response !== "object" || response === null) return null;
  const data = (response as { data?: unknown }).data;
  if (typeof data !== "object" || data === null) return null;
  const message = (data as { message?: unknown }).message;
  return typeof message === "string" ? message : null;
}

const restockFormSchemaWithWarehouse = z.object({
  warehouse_id: z.string().min(1, "Please select a warehouse"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
});

const restockFormSchemaQuantityOnly = z.object({
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
});

type RestockFormValuesWithWarehouse = z.infer<typeof restockFormSchemaWithWarehouse>;
type RestockFormValuesQuantityOnly = z.infer<typeof restockFormSchemaQuantityOnly>;

type RestockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItemApi | null;
  onSuccess: () => void;
  warehouseId?: string | number;
};

export function RestockModal({
  isOpen,
  onClose,
  item,
  onSuccess,
  warehouseId: warehouseIdProp,
}: RestockModalProps) {
  const { warehouses, loadingWarehouses, fetchWarehouses, fetchInventory } =
    useInventoryStore();

  const isWarehouseDetail = warehouseIdProp != null && String(warehouseIdProp).trim() !== "";

  const formWithWarehouse = useForm<RestockFormValuesWithWarehouse>({
    resolver: zodResolver(restockFormSchemaWithWarehouse),
    defaultValues: { warehouse_id: "", quantity: 1 },
  });

  const formQuantityOnly = useForm<RestockFormValuesQuantityOnly>({
    resolver: zodResolver(restockFormSchemaQuantityOnly),
    defaultValues: { quantity: 1 },
  });

  React.useEffect(() => {
    if (isOpen) {
      if (!isWarehouseDetail) fetchWarehouses();
      formWithWarehouse.reset({ warehouse_id: "", quantity: 1 });
      formQuantityOnly.reset({ quantity: 1 });
    }
  }, [isOpen, isWarehouseDetail, fetchWarehouses, formWithWarehouse, formQuantityOnly]);

  const onSubmit = async (
    values: RestockFormValuesWithWarehouse | RestockFormValuesQuantityOnly
  ) => {
    if (!item) return;
    const quantity = values.quantity;
    const warehouse_id = isWarehouseDetail
      ? Number(warehouseIdProp)
      : Number.parseInt((values as RestockFormValuesWithWarehouse).warehouse_id, 10);
    try {
      const { data } = await api.patch<{
        status?: string;
        message?: string;
      }>(`${INVENTORY_API.adjustStock}/${item.id}/adjust-stock`, {
        product_id: item.id,
        warehouse_id,
        quantity,
      });

      if (data?.status === "success") {
        toast.success("Stock adjusted successfully");
        fetchInventory({ page: 1, search: "" });
        onSuccess();
        formWithWarehouse.reset({ warehouse_id: "", quantity: 1 });
        formQuantityOnly.reset({ quantity: 1 });
        onClose();
      } else {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "Failed to adjust stock";
        toast.error(message);
      }
    } catch (error) {
      const message =
        getApiErrorMessage(error) ?? "Failed to adjust stock";
      console.error("Error adjusting stock =>", error);
      toast.error(message);
    }
  };

  const isSubmitting =
    formWithWarehouse.formState.isSubmitting ||
    formQuantityOnly.formState.isSubmitting;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] flex flex-col p-0 w-[95vw] max-w-139.25! sm:w-139.25! sm:max-w-139.25!"
        showCloseButton={false}
      >
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-neutral-100 relative">
          <DialogTitle className="text-xl sm:text-2xl font-semibold">
            Restock
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-neutral-500">
            {item
              ? `Add stock for ${item.name}`
              : "Select a product from the table to restock."}
          </DialogDescription>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            disabled={isSubmitting}
            className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center justify-center size-7.5 bg-[#E8EEFF] rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X color="#0B1E66" size={20} cursor="pointer" />
          </button>
        </DialogHeader>

        {item ? (
          isWarehouseDetail ? (
            <Form {...formQuantityOnly}>
              <form
                id="restock-form"
                onSubmit={formQuantityOnly.handleSubmit((values) =>
                  onSubmit(values)
                )}
                className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 sm:space-y-6"
              >
                <FormField
                  control={formQuantityOnly.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="50"
                          min={1}
                          className="form-control"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const v = e.target.valueAsNumber;
                            field.onChange(Number.isFinite(v) ? v : 0);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Restocking...
                      </>
                    ) : (
                      "Restock"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...formWithWarehouse}>
              <form
                id="restock-form"
                onSubmit={formWithWarehouse.handleSubmit((values) =>
                  onSubmit(values)
                )}
                className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 sm:space-y-6"
              >
                <FormField
                  control={formWithWarehouse.control}
                  name="warehouse_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warehouse</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={loadingWarehouses}
                      >
                        <FormControl>
                          <SelectTrigger className="form-control w-full">
                            <SelectValue placeholder="Select warehouse" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {warehouses.map((wh) => (
                            <SelectItem key={wh.id} value={String(wh.id)}>
                              {wh.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formWithWarehouse.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="50"
                          min={1}
                          className="form-control"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const v = e.target.valueAsNumber;
                            field.onChange(Number.isFinite(v) ? v : 0);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={isSubmitting || loadingWarehouses}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Restocking...
                      </>
                    ) : (
                      "Restock"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )
        ) : (
          <div className="px-4 sm:px-6 py-4 text-neutral-500 text-sm">
            No product selected.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
