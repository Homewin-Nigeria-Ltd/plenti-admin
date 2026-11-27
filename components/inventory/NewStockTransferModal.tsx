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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeftRight, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useInventoryStore } from "@/store/useInventoryStore";
import api from "@/lib/api";
import { INVENTORY_API } from "@/data/inventory";
import type { InventoryItemApi, InventoryListResponse } from "@/types/InventoryTypes";
import { TRANSFER_REASONS, qtyAtWarehouse } from "./inventoryView";
import { cn } from "@/lib/utils";

function getApiErrorMessage(err: unknown): string | null {
  if (typeof err !== "object" || err === null) return null;
  const response = (err as { response?: unknown }).response;
  if (typeof response !== "object" || response === null) return null;
  const data = (response as { data?: unknown }).data;
  if (typeof data !== "object" || data === null) return null;
  const message = (data as { message?: unknown }).message;
  return typeof message === "string" ? message : null;
}

type Line = { product_id: string; quantity: number };

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
  const { warehouses, fetchWarehouses } = useInventoryStore();
  const [fromId, setFromId] = React.useState("");
  const [toId, setToId] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [truck, setTruck] = React.useState("");
  const [note, setNote] = React.useState("");
  const [lines, setLines] = React.useState<Line[]>([{ product_id: "", quantity: 1 }]);
  const [sourceProducts, setSourceProducts] = React.useState<InventoryItemApi[]>([]);
  const [loadingProducts, setLoadingProducts] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) fetchWarehouses({ per_page: 100 });
  }, [isOpen, fetchWarehouses]);

  React.useEffect(() => {
    if (!isOpen || !fromId) {
      setSourceProducts([]);
      return;
    }
    let cancelled = false;
    setLoadingProducts(true);
    api
      .get<InventoryListResponse>(INVENTORY_API.getInventory, {
        params: {
          page: 1,
          per_page: 200,
          search: "",
          warehouse_id: Number(fromId),
        },
      })
      .then((res) => {
        if (!cancelled) setSourceProducts(res.data?.data?.data ?? []);
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
  }, [isOpen, fromId]);

  React.useEffect(() => {
    if (isOpen) return;
    setFromId("");
    setToId("");
    setReason("");
    setTruck("");
    setNote("");
    setLines([{ product_id: "", quantity: 1 }]);
    setSourceProducts([]);
  }, [isOpen]);

  const swapWarehouses = () => {
    const nextFrom = toId;
    const nextTo = fromId;
    setFromId(nextFrom);
    setToId(nextTo);
    setLines([{ product_id: "", quantity: 1 }]);
  };

  const units = lines.reduce((sum, line) => sum + (Number(line.quantity) || 0), 0);
  const productCount = lines.filter((l) => l.product_id).length;

  const submit = async () => {
    if (!fromId || !toId) {
      toast.error("Choose both warehouses");
      return;
    }
    if (fromId === toId) {
      toast.error("Source and destination must be different");
      return;
    }
    if (!reason) {
      toast.error("Please choose a reason");
      return;
    }
    const sanitized = lines
      .filter((item) => item.product_id && item.quantity > 0)
      .map((item) => ({
        productId: Number(item.product_id),
        qty: item.quantity,
        product_id: Number(item.product_id),
        quantity: item.quantity,
      }));
    if (sanitized.length === 0) {
      toast.error("Please add at least one product");
      return;
    }
    setSaving(true);
    try {
      const composedNote = [reason, truck && `Truck ${truck}`, note.trim()]
        .filter(Boolean)
        .join(" · ");
      const { data } = await api.post<{ status?: string; message?: string }>(
        INVENTORY_API.transfer,
        {
          source_warehouse_id: Number(fromId),
          destination_warehouse_id: Number(toId),
          note: composedNote || undefined,
          items: sanitized,
        },
      );
      if (data?.status !== "success") {
        toast.error(data?.message || "Failed to initiate transfer");
        return;
      }
      toast.success("Stock transfer requested");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error) ?? "Failed to initiate transfer");
    } finally {
      setSaving(false);
    }
  };

  const fromName = warehouses.find((w) => String(w.id) === fromId)?.name || "source";
  const toName = warehouses.find((w) => String(w.id) === toId)?.name || "destination";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="flex max-h-[92vh] w-[95vw] max-w-[720px]! flex-col gap-0 p-0 sm:max-w-[720px]!"
        showCloseButton={false}
      >
        <DialogHeader className="relative border-b border-[#EAECF0] px-5 py-4 sm:px-6">
          <DialogTitle className="text-lg font-semibold text-[#101828]">
            Transfer stock
          </DialogTitle>
          <DialogDescription className="text-sm text-[#667085]">
            Move stock between warehouses. A manager at the sending warehouse
            approves it first.
          </DialogDescription>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full bg-[#F2F4F7]"
            aria-label="Close dialog"
          >
            <X size={16} color="#344054" />
          </button>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
            <label className="space-y-1.5">
              <span className="text-[13px] font-medium text-[#344054]">
                From <span className="text-[#D92D20]">*</span>
              </span>
              <Select value={fromId} onValueChange={setFromId}>
                <SelectTrigger className="h-10 w-full! rounded-lg border-[#EAECF0]">
                  <SelectValue placeholder="Choose a warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((w) => (
                    <SelectItem key={w.id} value={String(w.id)}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <button
              type="button"
              onClick={swapWarehouses}
              className="mb-1 flex size-10 items-center justify-center rounded-lg border border-[#EAECF0] text-[#667085]"
              aria-label="Swap warehouses"
            >
              <ArrowLeftRight className="size-4" />
            </button>
            <label className="space-y-1.5">
              <span className="text-[13px] font-medium text-[#344054]">
                To <span className="text-[#D92D20]">*</span>
              </span>
              <Select value={toId} onValueChange={setToId}>
                <SelectTrigger className="h-10 w-full! rounded-lg border-[#EAECF0]">
                  <SelectValue placeholder="Choose a warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses
                    .filter((w) => String(w.id) !== fromId)
                    .map((w) => (
                      <SelectItem key={w.id} value={String(w.id)}>
                        {w.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </label>
          </div>

          <div>
            <p className="mb-2 text-[13px] font-medium text-[#344054]">
              Products <span className="text-[#D92D20]">*</span>
            </p>
            <div className="overflow-hidden rounded-xl border border-[#EAECF0]">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#EAECF0] bg-[#F9FAFB] text-[12px] text-[#667085]">
                    <th className="px-3 py-2">Product</th>
                    <th className="px-3 py-2">At {fromName}</th>
                    <th className="px-3 py-2">At {toName}</th>
                    <th className="px-3 py-2">Send</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, index) => {
                    const product = sourceProducts.find(
                      (p) => String(p.id) === line.product_id,
                    );
                    const atFrom = product
                      ? Number(product.stock) || 0
                      : "-";
                    const atTo = product
                      ? qtyAtWarehouse(product, Number(toId) || 0)
                      : "-";
                    return (
                      <tr key={index} className="border-b border-[#EAECF0] last:border-0">
                        <td className="px-3 py-2">
                          <Select
                            value={line.product_id}
                            onValueChange={(value) =>
                              setLines((prev) =>
                                prev.map((row, i) =>
                                  i === index
                                    ? { ...row, product_id: value }
                                    : row,
                                ),
                              )
                            }
                            disabled={!fromId || loadingProducts}
                          >
                            <SelectTrigger className="h-9 w-full! rounded-lg border-[#EAECF0]">
                              <SelectValue
                                placeholder={
                                  loadingProducts
                                    ? "Loading..."
                                    : "Choose product"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {sourceProducts.map((p) => (
                                <SelectItem key={p.id} value={String(p.id)}>
                                  {p.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {product?.sku ? (
                            <p className="mt-0.5 text-[11px] text-[#98A2B3]">
                              {product.sku}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-3 py-2 font-medium text-[#101828]">
                          {atFrom}
                          {typeof atFrom === "number" && atFrom > 0 ? (
                            <p className="text-[11px] font-normal text-[#98A2B3]">
                              3 held for orders
                            </p>
                          ) : null}
                        </td>
                        <td
                          className={cn(
                            "px-3 py-2 font-medium",
                            typeof atTo === "number" && atTo <= 0
                              ? "text-[#B42318]"
                              : "text-[#B54708]",
                          )}
                        >
                          {atTo}
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            min={1}
                            value={line.quantity}
                            onChange={(e) =>
                              setLines((prev) =>
                                prev.map((row, i) =>
                                  i === index
                                    ? {
                                        ...row,
                                        quantity: Number(e.target.value) || 0,
                                      }
                                    : row,
                                ),
                              )
                            }
                            className="h-9 w-20 rounded-lg border-[#EAECF0]"
                          />
                        </td>
                        <td className="px-1">
                          <button
                            type="button"
                            className="text-[#98A2B3]"
                            onClick={() =>
                              setLines((prev) =>
                                prev.length === 1
                                  ? [{ product_id: "", quantity: 1 }]
                                  : prev.filter((_, i) => i !== index),
                              )
                            }
                          >
                            <X className="size-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[#0B1E66]"
              onClick={() =>
                setLines((prev) => [...prev, { product_id: "", quantity: 1 }])
              }
              disabled={!fromId}
            >
              <Plus className="size-4" />
              Add product
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-[13px] font-medium text-[#344054]">
                Reason <span className="text-[#D92D20]">*</span>
              </span>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="h-10 w-full! rounded-lg border-[#EAECF0]">
                  <SelectValue placeholder="Choose reason" />
                </SelectTrigger>
                <SelectContent>
                  {TRANSFER_REASONS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="space-y-1.5">
              <span className="text-[13px] font-medium text-[#344054]">
                Truck or bike (optional)
              </span>
              <Input
                placeholder="Enter truck or bike"
                value={truck}
                onChange={(e) => setTruck(e.target.value)}
                className="h-10 rounded-lg border-[#EAECF0]"
              />
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-[13px] font-medium text-[#344054]">
              Note for the receiving team (optional)
            </span>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write note for the receiving team"
              className="min-h-20 rounded-lg border-[#EAECF0]"
            />
          </label>
        </div>

        <div className="flex flex-col gap-2 border-t border-[#EAECF0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-[#667085]">
            {units} units · {productCount} products · about 3 hours by road
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              className="h-10 rounded-lg"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="h-10 rounded-lg bg-[#0B1E66] text-white hover:bg-[#0B1E66]/90"
              disabled={saving}
              onClick={submit}
            >
              {saving ? "Requesting..." : "Request transfer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
