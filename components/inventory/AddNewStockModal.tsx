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
import { X, Loader2, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useProductStore } from "@/store/useProductStore";
import { useInventoryStore } from "@/store/useInventoryStore";
import api from "@/lib/api";
import { INVENTORY_API } from "@/data/inventory";

function getApiErrorMessage(err: unknown): string | null {
  if (typeof err !== "object" || err === null) return null;
  const response = (err as { response?: unknown }).response;
  if (typeof response !== "object" || response === null) return null;
  const data = (response as { data?: unknown }).data;
  if (typeof data !== "object" || data === null) return null;
  const message = (data as { message?: unknown }).message;
  return typeof message === "string" ? message : null;
}

const addStockFormSchema = z
  .object({
    product: z.object({ value: z.string(), label: z.string() }).nullable(),
    warehouse: z.object({ value: z.string(), label: z.string() }).nullable(),
    quantity: z
      .number()
      .int("Quantity must be a whole number")
      .min(1, "Quantity must be at least 1"),
  })
  .refine((data) => data.product != null && data.product.value.length > 0, {
    message: "Please select a product",
    path: ["product"],
  })
  .refine((data) => data.warehouse != null && data.warehouse.value.length > 0, {
    message: "Please select a warehouse",
    path: ["warehouse"],
  });

type AddStockFormValues = z.infer<typeof addStockFormSchema>;

type AddNewStockModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AddNewStockModal({ isOpen, onClose }: AddNewStockModalProps) {
  const { products, loadingProducts, fetchProducts } = useProductStore();
  const { warehouses, loadingWarehouses, fetchWarehouses, fetchInventory } =
    useInventoryStore();

  const form = useForm<AddStockFormValues>({
    resolver: zodResolver(addStockFormSchema),
    defaultValues: {
      product: null,
      warehouse: null,
      quantity: 1,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      fetchProducts({ page: 1, categoryId: null, search: "" });
      fetchWarehouses();
    } else {
      form.reset({
        product: null,
        warehouse: null,
        quantity: 1,
      });
    }
  }, [isOpen, fetchProducts, fetchWarehouses, form]);

  const onSubmit = async (values: AddStockFormValues) => {
    const product = values.product;
    const warehouse = values.warehouse;
    if (!product?.value || !warehouse?.value) return;

    try {
      const { data } = await api.patch<{
        status?: string;
        message?: string;
      }>(`${INVENTORY_API.adjustStock}/${product.value}/adjust-stock`, {
        warehouse_id: Number.parseInt(warehouse.value, 10),
        quantity: values.quantity,
      });

      if (data?.status === "success") {
        toast.success("Stock adjusted successfully");
        fetchInventory({ page: 1, search: "" });
        form.reset({ product: null, warehouse: null, quantity: 1 });
        onClose();
      } else {
        const message =
          typeof data?.message === "string" ? data.message : "Failed to adjust stock";
        toast.error(message);
      }
    } catch (error) {
      const message = getApiErrorMessage(error) ?? "Failed to adjust stock";
      console.error("Error adjusting stock =>", error);
      toast.error(message);
    }
  };

  const isSubmitting = form.formState.isSubmitting;
  const [productOpen, setProductOpen] = React.useState(false);
  const [warehouseOpen, setWarehouseOpen] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] flex flex-col p-0 w-[95vw] max-w-139.25! sm:w-139.25! sm:max-w-139.25!"
        showCloseButton={false}
      >
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-neutral-100 relative">
          <DialogTitle className="text-xl sm:text-2xl font-semibold">
            Add New Stock
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-neutral-500">
            Add new product to your inventory
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
            id="add-product-form"
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
                            disabled={loadingProducts}
                            className={cn(
                              "form-control w-full justify-between font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? products.find(
                                  (p) => String(p.id) === field.value?.value
                                )?.name
                              : loadingProducts
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
                              {loadingProducts
                                ? "Loading products..."
                                : "No product found."}
                            </CommandEmpty>
                            <CommandGroup>
                              {products.map((p) => (
                                <CommandItem
                                  key={p.id}
                                  value={p.name}
                                  onSelect={() => {
                                    const id = String(p.id);
                                    const next =
                                      field.value?.value === id
                                        ? null
                                        : { value: id, label: p.name };
                                    field.onChange(next);
                                    setProductOpen(false);
                                  }}
                                >
                                  {p.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      field.value?.value === String(p.id)
                                        ? "opacity-100"
                                        : "opacity-0"
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
              name="warehouse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warehouse</FormLabel>
                  <Popover open={warehouseOpen} onOpenChange={setWarehouseOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={warehouseOpen}
                            disabled={loadingWarehouses}
                            className={cn(
                              "form-control w-full justify-between font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? warehouses.find(
                                  (wh) => String(wh.id) === field.value?.value
                                )?.name
                              : loadingWarehouses
                                ? "Loading warehouses..."
                                : "Select warehouse..."}
                            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-(--radix-popover-trigger-width)" align="start">
                        <Command>
                          <CommandInput placeholder="Search warehouse..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>
                              {loadingWarehouses
                                ? "Loading warehouses..."
                                : "No warehouse found."}
                            </CommandEmpty>
                            <CommandGroup>
                              {warehouses.map((wh) => (
                                <CommandItem
                                  key={wh.id}
                                  value={wh.name}
                                  onSelect={() => {
                                    const id = String(wh.id);
                                    const next =
                                      field.value?.value === id
                                        ? null
                                        : { value: id, label: wh.name };
                                    field.onChange(next);
                                    setWarehouseOpen(false);
                                  }}
                                >
                                  {wh.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      field.value?.value === String(wh.id)
                                        ? "opacity-100"
                                        : "opacity-0"
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
                disabled={
                  isSubmitting || loadingProducts || loadingWarehouses
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adjusting Stock...
                  </>
                ) : (
                  "Adjust Stock"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
