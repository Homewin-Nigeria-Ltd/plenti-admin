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
import { Textarea } from "@/components/ui/textarea";
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
import { X, Loader2, Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
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
    from_warehouse_id: z.string().min(1, "Please select source warehouse"),
    to_warehouse_id: z.string().min(1, "Please select destination warehouse"),
    note: z.string().optional(),
    items: z
      .array(
        z.object({
          product_id: z.string().min(1, "Please select a product"),
          quantity: z
            .number()
            .int("Quantity must be a whole number")
            .min(1, "Quantity must be at least 1"),
        })
      )
      .min(1, "Add at least one item"),
  })
  .refine(
    (data) => data.from_warehouse_id !== data.to_warehouse_id,
    { message: "Source and destination must be different", path: ["to_warehouse_id"] }
  )
  .superRefine((data, ctx) => {
    const ids = data.items.map((i) => i.product_id).filter(Boolean);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Duplicate products are not allowed",
        path: ["items"],
      });
    }
  });

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
  const [openProductRow, setOpenProductRow] = React.useState<number | null>(null);
  const prevFromWarehouseRef = React.useRef<string>("");

  const form = useForm<NewTransferFormValues>({
    resolver: zodResolver(newTransferFormSchema),
    defaultValues: {
      from_warehouse_id: "",
      to_warehouse_id: "",
      note: "",
      items: [{ product_id: "", quantity: 1 }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const fromWarehouseId = useWatch({
    control: form.control,
    name: "from_warehouse_id",
  });

  React.useEffect(() => {
    if (isOpen) fetchWarehouses();
  }, [isOpen, fetchWarehouses]);

  React.useEffect(() => {
    if (!isOpen) return;

    if (!fromWarehouseId) {
      setSourceProducts([]);
      setLoadingProducts(false);
      form.setValue("items", [{ product_id: "", quantity: 1 }]);
      prevFromWarehouseRef.current = "";
      return;
    }

    if (prevFromWarehouseRef.current !== fromWarehouseId) {
      prevFromWarehouseRef.current = fromWarehouseId;
      form.setValue("items", [{ product_id: "", quantity: 1 }]);
      setOpenProductRow(null);
    }

    let cancelled = false;
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
        if (cancelled) return;
        const list = res.data?.data?.data ?? [];
        setSourceProducts(list.map((item) => ({ id: item.id, name: item.name })));
      })
      .catch(() => {
        if (!cancelled) setSourceProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingProducts(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, fromWarehouseId, form]);

  React.useEffect(() => {
    if (!isOpen) {
      form.reset({
        from_warehouse_id: "",
        to_warehouse_id: "",
        note: "",
        items: [{ product_id: "", quantity: 1 }],
      });
      setSourceProducts([]);
      setOpenProductRow(null);
      prevFromWarehouseRef.current = "";
    }
  }, [isOpen, form]);

  const onSubmit = async (values: NewTransferFormValues) => {
    try {
      const sanitizedItems = values.items
        .filter(
          (item) =>
            typeof item.product_id === "string" &&
            item.product_id.trim() !== "" &&
            Number.isFinite(item.quantity) &&
            item.quantity > 0
        )
        .map((item) => {
          const productId = Number.parseInt(item.product_id, 10);
          const quantity = item.quantity;
          return {
            // Send both key styles for temporary backend compatibility.
            productId,
            qty: quantity,
            product_id: productId,
            quantity,
          };
        });

      if (sanitizedItems.length === 0) {
        toast.error("Please add at least one valid item");
        return;
      }

      const { data } = await api.post<{ status?: string; message?: string }>(
        INVENTORY_API.transfer,
        {
          source_warehouse_id: Number.parseInt(values.from_warehouse_id, 10),
          destination_warehouse_id: Number.parseInt(values.to_warehouse_id, 10),
          note: values.note?.trim() || undefined,
          items: sanitizedItems,
        }
      );

      if (data?.status !== "success") {
        const msg =
          typeof data?.message === "string"
            ? data.message
            : "Failed to initiate transfer";
        toast.error(msg);
        return;
      }

      toast.success("Stock transfer initiated successfully");
      onSuccess?.();
      form.reset({
        from_warehouse_id: "",
        to_warehouse_id: "",
        note: "",
        items: [{ product_id: "", quantity: 1 }],
      });
      onClose();
    } catch (error) {
      const message =
        getApiErrorMessage(error) ?? "Failed to initiate transfer";
      console.error("Error initiating transfer =>", error);
      toast.error(message);
    }
  };

  const isSubmitting = form.formState.isSubmitting;
  const rootItemsError = form.formState.errors.items?.message;
  const toWarehouseOptions = warehouses.filter(
    (wh) => String(wh.id) !== fromWarehouseId
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="from_warehouse_id"
                render={({ field }) => (
                  <FormItem className="min-w-0 w-full">
                    <FormLabel>Source Warehouse</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loadingWarehouses}
                    >
                      <FormControl>
                        <SelectTrigger className="form-control w-full min-w-0 overflow-hidden **:data-[slot=select-value]:truncate">
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
                  <FormItem className="min-w-0 w-full">
                    <FormLabel>Destination Warehouse</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loadingWarehouses}
                    >
                      <FormControl>
                        <SelectTrigger className="form-control w-full min-w-0 overflow-hidden **:data-[slot=select-value]:truncate">
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

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel>Select Product</FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-primary"
                  onClick={() => append({ product_id: "", quantity: 1 })}
                  disabled={!fromWarehouseId || loadingProducts || isSubmitting}
                >
                  <Plus className="size-4 mr-1" />
                  Add item
                </Button>
              </div>

              <div className="space-y-2">
                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 sm:grid-cols-[1fr_130px_40px] gap-2 items-start"
                  >
                    <FormField
                      control={form.control}
                      name={`items.${index}.product_id`}
                      render={({ field }) => (
                        <FormItem>
                          <Popover
                            open={openProductRow === index}
                            onOpenChange={(open) =>
                              setOpenProductRow(open ? index : null)
                            }
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  type="button"
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={openProductRow === index}
                                  disabled={!fromWarehouseId || loadingProducts}
                                  className={cn(
                                    "form-control w-full justify-between font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? sourceProducts.find(
                                        (p) => String(p.id) === field.value
                                      )?.name
                                    : !fromWarehouseId
                                      ? "Select source warehouse first"
                                      : loadingProducts
                                        ? "Loading products..."
                                        : "Select product"}
                                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-(--radix-popover-trigger-width) p-0"
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
                                    {sourceProducts.map((product) => (
                                      <CommandItem
                                        key={product.id}
                                        value={product.name}
                                        onSelect={() => {
                                          field.onChange(String(product.id));
                                          setOpenProductRow(null);
                                        }}
                                      >
                                        {product.name}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            field.value === String(product.id)
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
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="QTY"
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

                    <Button
                      type="button"
                      variant="ghost"
                      className="h-[53px] px-0 text-neutral-500 hover:text-red-600"
                      onClick={() => {
                        if (fields.length <= 1) return;
                        remove(index);
                        setOpenProductRow((current) => {
                          if (current == null) return null;
                          if (current === index) return null;
                          if (current > index) return current - 1;
                          return current;
                        });
                      }}
                      disabled={fields.length <= 1 || isSubmitting}
                    >
                      <Trash2 className="size-5" />
                    </Button>
                  </div>
                ))}
              </div>

              {typeof rootItemsError === "string" ? (
                <p className="text-sm text-red-600">{rootItemsError}</p>
              ) : null}
            </div>

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Note <span className="text-neutral-400">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add a note for this transfer"
                      rows={3}
                      className="form-control min-h-[96px] resize-y"
                      disabled={isSubmitting}
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
