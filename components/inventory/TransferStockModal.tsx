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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { X, Loader2, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useInventoryStore } from "@/store/useInventoryStore";
import api from "@/lib/api";
import { INVENTORY_API } from "@/data/inventory";
import type { InventoryListResponse } from "@/types/InventoryTypes";

function getApiErrorMessage(err: unknown): string | null {
  if (typeof err !== "object" || err === null) return null;
  const response = (err as { response?: unknown }).response;
  if (typeof response !== "object" || response === null) return null;
  const data = (response as { data?: unknown }).data;
  if (typeof data !== "object" || data === null) return null;
  const message = (data as { message?: unknown }).message;
  return typeof message === "string" ? message : null;
}

const transferFormSchema = z
  .object({
    product: z.object({ value: z.string(), label: z.string() }).nullable(),
    to_warehouse_id: z.string().min(1, "Please select a destination warehouse"),
    quantity: z
      .number()
      .int("Quantity must be a whole number")
      .min(1, "Quantity must be at least 1"),
    notes: z.string().optional(),
  })
  .refine((data) => data.product != null && data.product.value.length > 0, {
    message: "Please select a product",
    path: ["product"],
  });

type TransferFormValues = z.infer<typeof transferFormSchema>;

type TransferStockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  fromWarehouseId: number;
  onSuccess?: () => void;
};

export function TransferStockModal({
  isOpen,
  onClose,
  fromWarehouseId,
  onSuccess,
}: TransferStockModalProps) {
  const { warehouses, loadingWarehouses, fetchWarehouses } = useInventoryStore();
  const [warehouseProducts, setWarehouseProducts] = React.useState<
    { id: number; name: string }[]
  >([]);
  const [loadingWarehouseProducts, setLoadingWarehouseProducts] =
    React.useState(false);

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      product: null,
      to_warehouse_id: "",
      quantity: 1,
      notes: "",
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      fetchWarehouses();
      setLoadingWarehouseProducts(true);
      api
        .get<InventoryListResponse>(INVENTORY_API.getInventory, {
          params: {
            page: 1,
            per_page: 200,
            search: "",
            warehouse_id: fromWarehouseId,
          },
        })
        .then((res) => {
          const list = res.data?.data?.data ?? [];
          setWarehouseProducts(
            list.map((item) => ({ id: item.id, name: item.name }))
          );
        })
        .catch(() => setWarehouseProducts([]))
        .finally(() => setLoadingWarehouseProducts(false));
    } else {
      form.reset({
        product: null,
        to_warehouse_id: "",
        quantity: 1,
        notes: "",
      });
      setWarehouseProducts([]);
    }
  }, [isOpen, fromWarehouseId, fetchWarehouses, form]);

  const onSubmit = async (values: TransferFormValues) => {
    const productId = values.product?.value;
    if (!productId) return;

    try {
      const { data } = await api.post<{ status?: string; message?: string }>(
        INVENTORY_API.transfer,
        {
          product_id: Number.parseInt(productId, 10),
          from_warehouse_id: fromWarehouseId,
          to_warehouse_id: Number.parseInt(values.to_warehouse_id, 10),
          quantity: values.quantity,
          notes: values.notes?.trim() || undefined,
        }
      );

      if (data?.status === "success") {
        toast.success("Stock transferred successfully");
        onSuccess?.();
        form.reset({ product: null, to_warehouse_id: "", quantity: 1, notes: "" });
        onClose();
      } else {
        const message =
          typeof data?.message === "string" ? data.message : "Failed to transfer stock";
        toast.error(message);
      }
    } catch (error) {
      const message = getApiErrorMessage(error) ?? "Failed to transfer stock";
      console.error("Error transferring stock =>", error);
      toast.error(message);
    }
  };

  const isSubmitting = form.formState.isSubmitting;
  const [productOpen, setProductOpen] = React.useState(false);

  const toWarehouseOptions = warehouses.filter((wh) => Number(wh.id) !== fromWarehouseId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] flex flex-col p-0 w-[95vw] max-w-lg sm:max-w-lg"
        showCloseButton={false}
      >
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-neutral-100 relative">
          <DialogTitle className="text-xl sm:text-2xl font-semibold">
            Transfer Stock
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-neutral-500">
            Move stock from this warehouse to another
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

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 sm:space-y-6"
          >
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Popover open={productOpen} onOpenChange={setProductOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={productOpen}
                          disabled={loadingWarehouseProducts}
                          className={cn(
                            "form-control w-full justify-between font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? warehouseProducts.find(
                                (p) => String(p.id) === field.value?.value
                              )?.name
                            : loadingWarehouseProducts
                              ? "Loading products..."
                              : "Select product..."}
                          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-(--radix-popover-trigger-width)" align="start">
                      <Command>
                        <CommandInput placeholder="Search product..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>
                            {loadingWarehouseProducts
                              ? "Loading products..."
                              : "No product found in this warehouse."}
                          </CommandEmpty>
                          <CommandGroup>
                            {warehouseProducts.map((p) => (
                              <CommandItem
                                key={p.id}
                                value={p.name}
                                onSelect={() => {
                                  const id = String(p.id);
                                  field.onChange(
                                    field.value?.value === id ? null : { value: id, label: p.name }
                                  );
                                  setProductOpen(false);
                                }}
                              >
                                {p.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    field.value?.value === String(p.id) ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="to_warehouse_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To warehouse</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loadingWarehouses}
                  >
                    <FormControl>
                      <SelectTrigger className="form-control w-full">
                        <SelectValue placeholder="Select destination warehouse" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {toWarehouseOptions.map((wh) => (
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
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="25"
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

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Restocking warehouse 2"
                      className="form-control"
                      {...field}
                      value={field.value ?? ""}
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
                disabled={
                  isSubmitting ||
                  loadingWarehouseProducts ||
                  loadingWarehouses
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Transferring...
                  </>
                ) : (
                  "Transfer Stock"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
