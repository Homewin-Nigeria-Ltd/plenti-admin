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
import { Switch } from "@/components/ui/switch";
import api from "@/lib/api";
import {
  flashSaleItemName,
  toApiDate,
  toDateInput,
} from "@/lib/flashSale";
import { useFlashSaleStore } from "@/store/useFlashSaleStore";
import type { FlashSale } from "@/types/FlashSaleTypes";
import type { AdminProductsResponse } from "@/types/ProductTypes";
import { Plus, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

type DraftItem = {
  product_id: number;
  product_name: string;
  discount_percent: string;
};

type ProductOption = {
  id: number;
  name: string;
};

type CreateFlashSaleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sale: FlashSale | null;
};

async function searchProducts(search: string): Promise<ProductOption[]> {
  const { data } = await api.get<AdminProductsResponse>("/api/admin/products", {
    params: {
      page: 1,
      per_page: 30,
      ...(search.trim() ? { search: search.trim() } : {}),
    },
  });
  const rows = data?.data?.data ?? [];
  return rows.map((product) => ({
    id: product.id,
    name: product.name,
  }));
}

export function CreateFlashSaleModal({
  isOpen,
  onClose,
  sale,
}: CreateFlashSaleModalProps) {
  const { createFlashSale, updateFlashSale, savingFlashSale } =
    useFlashSaleStore();
  const isEdit = Boolean(sale);
  const [name, setName] = React.useState("");
  const [startsAt, setStartsAt] = React.useState("");
  const [endsAt, setEndsAt] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);
  const [items, setItems] = React.useState<DraftItem[]>([]);
  const [productSearch, setProductSearch] = React.useState("");
  const [debouncedSearch] = useDebounce(productSearch, 300);
  const [productOptions, setProductOptions] = React.useState<ProductOption[]>(
    [],
  );
  const [loadingProducts, setLoadingProducts] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) return;
    setName(sale?.name ?? "");
    setStartsAt(toDateInput(sale?.starts_at));
    setEndsAt(toDateInput(sale?.ends_at));
    setIsActive(sale?.is_active ?? true);
    setItems(
      (sale?.items ?? []).map((item) => ({
        product_id: item.product_id,
        product_name: flashSaleItemName(item),
        discount_percent: String(item.discount_percent ?? ""),
      })),
    );
    setProductSearch("");
  }, [isOpen, sale]);

  React.useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setLoadingProducts(true);
    void searchProducts(debouncedSearch)
      .then((options) => {
        if (!cancelled) setProductOptions(options);
      })
      .catch(() => {
        if (!cancelled) setProductOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingProducts(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, debouncedSearch]);

  const resetForm = () => {
    setName("");
    setStartsAt("");
    setEndsAt("");
    setIsActive(true);
    setItems([]);
    setProductSearch("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const addProduct = (product: ProductOption) => {
    setItems((current) => {
      if (current.some((item) => item.product_id === product.id)) return current;
      return [
        ...current,
        { product_id: product.id, product_name: product.name, discount_percent: "" },
      ];
    });
    setProductSearch("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameTrim = name.trim();
    if (!nameTrim) {
      toast.error("Please enter a sale name");
      return;
    }
    if (!startsAt || !endsAt) {
      toast.error("Please set a start and end date");
      return;
    }
    if (endsAt < startsAt) {
      toast.error("End date must be on or after the start date");
      return;
    }
    if (items.length === 0) {
      toast.error("Add at least one product");
      return;
    }

    const mappedItems: Array<{ product_id: number; discount_percent: number }> =
      [];
    for (const item of items) {
      const discount = Number(item.discount_percent);
      if (!Number.isFinite(discount) || discount <= 0 || discount > 100) {
        toast.error(`Enter a discount between 1 and 100 for ${item.product_name}`);
        return;
      }
      mappedItems.push({
        product_id: item.product_id,
        discount_percent: discount,
      });
    }

    const payload = {
      name: nameTrim,
      starts_at: toApiDate(startsAt),
      ends_at: toApiDate(endsAt),
      is_active: isActive,
      items: mappedItems,
    };

    const ok =
      isEdit && sale
        ? await updateFlashSale(sale.id, payload)
        : await createFlashSale(payload);

    if (!ok) {
      toast.error(
        useFlashSaleStore.getState().saveError ??
          (isEdit ? "Failed to update flash sale" : "Failed to create flash sale"),
      );
      return;
    }

    toast.success(isEdit ? "Flash sale updated" : "Flash sale created");
    resetForm();
    onClose();
  };

  const selectedIds = new Set(items.map((item) => item.product_id));
  const availableOptions = productOptions.filter(
    (product) => !selectedIds.has(product.id),
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        className="w-[calc(100%-2rem)] sm:max-w-[640px] max-h-[90dvh] overflow-hidden flex flex-col"
        showCloseButton={false}
      >
        <DialogHeader className="relative pb-4 shrink-0">
          <DialogTitle className="text-lg sm:text-xl font-bold text-[#101928] mb-2 pr-10">
            {isEdit ? "Edit Flash Sale" : "Create Flash Sale"}
          </DialogTitle>
          <DialogDescription className="text-[#667085] text-sm font-normal pr-10">
            Timed sale with a discount on each product. When it ends, prices
            return to normal.
          </DialogDescription>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="absolute top-0 right-0 flex items-center justify-center size-8 bg-[#E8EEFF] rounded-full hover:bg-[#E8EEFF]/80 transition-colors"
          >
            <X color="#0B1E66" size={18} />
          </button>
        </DialogHeader>

        <form
          id="flash-sale-form"
          onSubmit={handleSubmit}
          className="space-y-5 flex-1 min-h-0 overflow-y-auto pr-1"
        >
          <div className="space-y-2">
            <Label htmlFor="flash-sale-name" className="text-[#101928] font-medium">
              Name
            </Label>
            <Input
              id="flash-sale-name"
              placeholder='e.g. Friday Flash Sale'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="focus-visible:ring-0 h-12"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="flash-sale-start" className="text-[#101928] font-medium">
                Starts at
              </Label>
              <Input
                id="flash-sale-start"
                type="date"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="focus-visible:ring-0 h-12"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flash-sale-end" className="text-[#101928] font-medium">
                Ends at
              </Label>
              <Input
                id="flash-sale-end"
                type="date"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="focus-visible:ring-0 h-12"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-input p-4">
            <Label htmlFor="flash-sale-active" className="text-[#101928] font-medium">
              Active
            </Label>
            <Switch
              id="flash-sale-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-[#101928] font-medium">Products</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98A2B3]" />
              <Input
                placeholder="Search products to add"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="focus-visible:ring-0 h-12 pl-9"
              />
            </div>
            {productSearch.trim() ? (
              <div className="max-h-40 overflow-y-auto rounded-lg border border-[#EAECF0] bg-white">
                {loadingProducts ? (
                  <p className="px-3 py-2 text-sm text-[#667085]">Searching…</p>
                ) : availableOptions.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-[#667085]">
                    No matching products
                  </p>
                ) : (
                  availableOptions.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => addProduct(product)}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-[#F9FAFB]"
                    >
                      <span className="truncate">{product.name}</span>
                      <Plus className="size-4 text-[#0B1E66] shrink-0" />
                    </button>
                  ))
                )}
              </div>
            ) : null}

            {items.length === 0 ? (
              <p className="text-sm text-[#667085]">No products added yet.</p>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-lg border border-[#EAECF0] p-3"
                  >
                    <p className="flex-1 min-w-0 text-sm font-medium text-[#101928] truncate">
                      {item.product_name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        step="0.01"
                        placeholder="Discount %"
                        value={item.discount_percent}
                        onChange={(e) =>
                          setItems((current) =>
                            current.map((row) =>
                              row.product_id === item.product_id
                                ? { ...row, discount_percent: e.target.value }
                                : row,
                            ),
                          )
                        }
                        className="focus-visible:ring-0 h-10 w-28"
                      />
                      <button
                        type="button"
                        aria-label={`Remove ${item.product_name}`}
                        onClick={() =>
                          setItems((current) =>
                            current.filter(
                              (row) => row.product_id !== item.product_id,
                            ),
                          )
                        }
                        className="size-10 rounded-md border border-[#EAECF0] text-[#D42620] hover:bg-[#FEF3F2] flex items-center justify-center"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        <div className="pt-4 shrink-0">
          <Button
            type="submit"
            form="flash-sale-form"
            className="bg-[#1F3A78] hover:bg-[#1F3A78]/90 text-white w-full h-[52px] text-base font-medium"
            disabled={savingFlashSale}
          >
            {savingFlashSale
              ? isEdit
                ? "Updating…"
                : "Creating…"
              : isEdit
                ? "Update Flash Sale"
                : "Create Flash Sale"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
