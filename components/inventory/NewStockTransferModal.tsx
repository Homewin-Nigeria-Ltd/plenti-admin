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

const newTransferFormSchema = z
  .object({
    product: z.object({ value: z.string(), label: z.string() }).nullable(),
    from_warehouse_id: z.string().min(1, "Please select source warehouse"),
    to_warehouse_id: z.string().min(1, "Please select destination warehouse"),
    quantity: z
      .number()
      .int("Quantity must be a whole number")
      .min(1, "Quantity must be at least 1"),
  })
  .refine((data) => data.product != null && data.product.value.length > 0, {
    message: "Please select a product",
    path: ["product"],
  })
  .refine(
    (data) => data.from_warehouse_id !== data.to_warehouse_id,
    { message: "Source and destination must be different", path: ["to_warehouse_id"] }
  );

type NewTransferFormValues = z.infer<typeof newTransferFormSchema>;

type NewStockTransferModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function NewStockTransferModal({
  isOpen,
  onClose,
  onSuccess,
}: NewStockTransferModalProps) {
  const { warehouses, loadingWarehouses, fetchWarehouses } = useInventoryStore();
  const [sourceProducts, setSourceProducts] = React.useState<
    { id: number; name: string }[]
  >([]);
  const [loadingProducts, setLoadingProducts] = React.useState(false);
  const [productOpen, setProductOpen] = React.useState(false);

  const form = useForm<NewTransferFormValues>({
    resolver: zodResolver(newTransferFormSchema),
    defaultValues: {
      product: null,
      from_warehouse_id: "",
      to_warehouse_id: "",
      quantity: 1,
    },
  });

  const fromWarehouseId = form.watch("from_warehouse_id");

  React.useEffect(() => {
    if (isOpen) fetchWarehouses();
  }, [isOpen, fetchWarehouses]);

  React.useEffect(() => {
    if (!isOpen || !fromWarehouseId) {
      setSourceProducts([]);
      form.setValue("product", null);
      return;
    }
    setLoadingProducts(true);
    api
      .get<InventoryListResponse>(INVENTORY_API.getInventory, {
        params: {
          page: 1,
          per_page: 200,
          search: "",
          warehouse_id: Number(fromWarehouseId),
        },
      })
      .then((res) => {
        const list = res.data?.data?.data ?? [];
        setSourceProducts(list.map((item) => ({ id: item.id, name: item.name })));
      })
      .catch(() => setSourceProducts([]))
      .finally(() => {
        setLoadingProducts(false);
        form.setValue("product", null);
      });
  }, [isOpen, fromWarehouseId, form]);

  React.useEffect(() => {
    if (!isOpen) {
      form.reset({
        product: null,
        from_warehouse_id: "",
        to_warehouse_id: "",
        quantity: 1,
      });
      setSourceProducts([]);
    }
  }, [isOpen, form]);

  const onSubmit = async (values: NewTransferFormValues) => {
    const productId = values.product?.value;
    if (!productId) return;

    try {
      const { data } = await api.post<{ status?: string; message?: string }>(
        INVENTORY_API.transfer,
        {
          product_id: Number.parseInt(productId, 10),
          from_warehouse_id: Number.parseInt(values.from_warehouse_id, 10),
          to_warehouse_id: Number.parseInt(values.to_warehouse_id, 10),
          quantity: values.quantity,
        }
      );

      if (data?.status === "success") {
        toast.success("Stock transfer initiated successfully");
        onSuccess?.();
        form.reset({
          product: null,
          from_warehouse_id: "",
          to_warehouse_id: "",
          quantity: 1,
        });
        onClose();
      } else {
        const msg =
          typeof data?.message === "string"
            ? data.message
            : "Failed to initiate transfer";
        toast.error(msg);
      }
    } catch (error) {
      const message =
        getApiErrorMessage(error) ?? "Failed to initiate transfer";
      console.error("Error initiating transfer =>", error);
      toast.error(message);
    }
  };

  const isSubmitting = form.formState.isSubmitting;
  const toWarehouseOptions = warehouses.filter(
    (wh) => String(wh.id) !== form.watch("from_warehouse_id")
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] flex flex-col p-0 w-[95vw] max-w-lg sm:max-w-lg"
        showCloseButton={false}
      >
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-neutral-100 relative">
          <DialogTitle className="text-xl sm:text-2xl font-semibold">
            New Stock Transfer
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-neutral-500">
            Move stock between warehouses. Ensure sufficient stock is available
            at the source.
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
                  <FormLabel>Select Product</FormLabel>
                  <Popover open={productOpen} onOpenChange={setProductOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={productOpen}
                          disabled={!fromWarehouseId || loadingProducts}
                          className={cn(
                            "form-control w-full justify-between font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? sourceProducts.find(
                                (p) => String(p.id) === field.value?.value
                              )?.name
                            : !fromWarehouseId
                              ? "Select source warehouse first"
                              : loadingProducts
                                ? "Loading products..."
                                : "Choose a Product"}
                          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-(--radix-popover-trigger-width)"
                      align="start"
                    >
                      <Command>
                        <CommandInput
                          placeholder="Search product..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>
                            {loadingProducts
                              ? "Loading..."
                              : "No product found in this warehouse."}
                          </CommandEmpty>
                          <CommandGroup>
                            {sourceProducts.map((p) => (
                              <CommandItem
                                key={p.id}
                                value={p.name}
                                onSelect={() => {
                                  const id = String(p.id);
                                  field.onChange(
                                    field.value?.value === id
                                      ? null
                                      : { value: id, label: p.name }
                                  );
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="from_warehouse_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source Warehouse</FormLabel>
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
                control={form.control}
                name="to_warehouse_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination Warehouse</FormLabel>
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
            </div>

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity to Transfer</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Amount"
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
                className="btn btn-primary w-full bg-[#0B1E66] hover:bg-[#0B1E66]"
                disabled={
                  isSubmitting || loadingWarehouses || loadingProducts
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initiating...
                  </>
                ) : (
                  "Initiate Transfer"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
