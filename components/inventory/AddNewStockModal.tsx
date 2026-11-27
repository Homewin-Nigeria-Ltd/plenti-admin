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
import { ChevronRight, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";
import { useProductStore } from "@/store/useProductStore";
import { useInventoryStore } from "@/store/useInventoryStore";
import { useAccountStore } from "@/store/useAccountStore";
import api from "@/lib/api";
import { INVENTORY_API } from "@/data/inventory";
import { cn } from "@/lib/utils";
import { MOCK_SUPPLIERS, naira } from "./inventoryView";

function getApiErrorMessage(err: unknown): string | null {
  if (typeof err !== "object" || err === null) return null;
  const response = (err as { response?: unknown }).response;
  if (typeof response !== "object" || response === null) return null;
  const data = (response as { data?: unknown }).data;
  if (typeof data !== "object" || data === null) return null;
  const message = (data as { message?: unknown }).message;
  return typeof message === "string" ? message : null;
}

type AddNewStockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  warehouseId?: string | number;
};

type DeliveryProduct = {
  productId: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  variant: string;
  specs: string;
  quantity: string;
  unitCost: string;
  damaged: string;
  existing: boolean;
};

const emptyProduct = (): DeliveryProduct => ({
  productId: "",
  name: "",
  sku: "",
  category: "",
  brand: "",
  variant: "",
  specs: "",
  quantity: "",
  unitCost: "",
  damaged: "0",
  existing: false,
});

export function AddNewStockModal({
  isOpen,
  onClose,
  warehouseId: warehouseIdProp,
}: AddNewStockModalProps) {
  const { products, fetchProducts, loadingProducts } = useProductStore();
  const { warehouses, fetchWarehouses, fetchInventory } = useInventoryStore();
  const account = useAccountStore((s) => s.account);

  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [saving, setSaving] = React.useState(false);
  const [warehouseId, setWarehouseId] = React.useState(
    warehouseIdProp ? String(warehouseIdProp) : "",
  );
  const [supplierId, setSupplierId] = React.useState("");
  const [supplierQuery, setSupplierQuery] = React.useState("");
  const [truckNumber, setTruckNumber] = React.useState("");
  const [driverName, setDriverName] = React.useState("");
  const [receivedOn, setReceivedOn] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [lines, setLines] = React.useState<DeliveryProduct[]>([emptyProduct()]);
  const [invoiceNumber, setInvoiceNumber] = React.useState("");
  const [invoiceDate, setInvoiceDate] = React.useState("");
  const [invoiceAmount, setInvoiceAmount] = React.useState("");
  const [payment, setPayment] = React.useState<"full" | "part" | "unpaid">(
    "full",
  );
  const [amountPaid, setAmountPaid] = React.useState("");
  const [balanceDue, setBalanceDue] = React.useState("");
  const [showErrors, setShowErrors] = React.useState(false);

  const selectedSupplier = MOCK_SUPPLIERS.find((s) => s.id === supplierId);
  const filteredSuppliers = MOCK_SUPPLIERS.filter((s) =>
    s.name.toLowerCase().includes(supplierQuery.toLowerCase()),
  );
  const warehouseName =
    warehouses.find((w) => String(w.id) === warehouseId)?.name || "warehouse";
  const recorder = account?.name || "Adaeze Okafor";

  React.useEffect(() => {
    if (!isOpen) return;
    fetchProducts({ page: 1, categoryId: null, search: "" });
    fetchWarehouses({ per_page: 100 });
  }, [isOpen, fetchProducts, fetchWarehouses]);

  React.useEffect(() => {
    if (isOpen && warehouseIdProp) setWarehouseId(String(warehouseIdProp));
  }, [isOpen, warehouseIdProp]);

  React.useEffect(() => {
    if (isOpen) return;
    setStep(1);
    setWarehouseId(warehouseIdProp ? String(warehouseIdProp) : "");
    setSupplierId("");
    setSupplierQuery("");
    setTruckNumber("");
    setDriverName("");
    setReceivedOn("");
    setDescription("");
    setLines([emptyProduct()]);
    setInvoiceNumber("");
    setInvoiceDate("");
    setInvoiceAmount("");
    setPayment("full");
    setAmountPaid("");
    setBalanceDue("");
    setShowErrors(false);
  }, [isOpen, warehouseIdProp]);

  const lineTotals = lines.map((line) => {
    const qty = Number(line.quantity) || 0;
    const cost = Number(line.unitCost) || 0;
    return qty * cost;
  });
  const productsTotal = lineTotals.reduce((sum, n) => sum + n, 0);
  const unitsTotal = lines.reduce(
    (sum, line) => sum + (Number(line.quantity) || 0),
    0,
  );

  const lineErrors = (line: DeliveryProduct) => {
    const errors: string[] = [];
    if (!line.productId) errors.push("product");
    if (!line.brand.trim()) errors.push("brand");
    if (!line.quantity || Number(line.quantity) <= 0) errors.push("quantity");
    return errors;
  };

  const goStep2 = () => {
    if (!warehouseId) {
      toast.error("Please select a warehouse");
      return;
    }
    if (!supplierId) {
      toast.error("Please select a supplier");
      return;
    }
    if (!truckNumber.trim()) {
      toast.error("Please enter a truck number");
      return;
    }
    if (!receivedOn) {
      toast.error("Please pick when the delivery was received");
      return;
    }
    setStep(2);
  };

  const goStep3 = () => {
    const invalid = lines.some((line) => lineErrors(line).length > 0);
    if (invalid) {
      setShowErrors(true);
      toast.error("Fix the highlighted product fields before you continue");
      return;
    }
    setShowErrors(false);
    if (!invoiceAmount) setInvoiceAmount(String(productsTotal));
    setStep(3);
  };

  const saveStock = async () => {
    setSaving(true);
    try {
      for (const line of lines) {
        const { data } = await api.patch<{
          status?: string;
          message?: string;
        }>(`${INVENTORY_API.adjustStock}/${line.productId}/adjust-stock`, {
          product_id: Number(line.productId),
          warehouse_id: Number(warehouseId),
          quantity: Number(line.quantity),
        });
        if (data?.status !== "success") {
          toast.error(data?.message || `Failed to add stock for ${line.name}`);
          setSaving(false);
          return;
        }
      }
      toast.success(
        `Added ${unitsTotal} units to ${warehouseName} and wrote 2 entries to the audit log`,
      );
      fetchInventory({ page: 1, search: "" });
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error) ?? "Failed to add stock");
    } finally {
      setSaving(false);
    }
  };

  const applyProduct = (index: number, productId: string) => {
    const product = products.find((p) => String(p.id) === productId);
    if (!product) return;
    setLines((prev) =>
      prev.map((line, i) =>
        i === index
          ? {
              ...line,
              productId,
              name: product.name,
              sku: product.sku || `SKU-${product.id}`,
              category: String(product.category || ""),
              brand: line.brand || product.name.split(" ")[0] || "",
              variant: line.variant,
              specs: line.specs || product.description || "",
              existing: true,
              unitCost: line.unitCost || String(product.price || ""),
            }
          : line,
      ),
    );
  };

  const errorCount = lines.reduce(
    (sum, line) => sum + lineErrors(line).length,
    0,
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="flex max-h-[92vh] w-[95vw] max-w-[760px]! flex-col gap-0 p-0 sm:max-w-[760px]!"
        showCloseButton={false}
      >
        <DialogHeader className="relative border-b border-[#EAECF0] px-5 py-4 sm:px-6">
          <DialogTitle className="text-lg font-semibold text-[#101828]">
            Add New Stock
          </DialogTitle>
          <DialogDescription className="text-sm text-[#667085]">
            {step === 1
              ? "Record a delivery from a supplier. Everything here goes into the audit log."
              : step === 2
                ? "Add every product on this delivery."
                : "Attach the supplier's invoice so Finance can reconcile payment."}
          </DialogDescription>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full bg-[#F2F4F7]"
          >
            <X size={16} color="#344054" />
          </button>
          <ol className="mt-4 flex gap-4 text-[12px] font-medium">
            {(
              [
                [1, "Delivery"],
                [2, "Products"],
                [3, "Invoice & confirm"],
              ] as const
            ).map(([n, label]) => (
              <li
                key={n}
                className={cn(
                  "flex items-center gap-2",
                  step === n
                    ? "text-[#0B1E66]"
                    : step > n
                      ? "text-[#027A48]"
                      : "text-[#98A2B3]",
                )}
              >
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full text-[11px]",
                    step === n
                      ? "bg-[#0B1E66] text-white"
                      : step > n
                        ? "bg-[#ECFDF3] text-[#027A48]"
                        : "bg-[#F2F4F7] text-[#667085]",
                  )}
                >
                  {n}
                </span>
                {label}
              </li>
            ))}
          </ol>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {step === 1 ? (
            <div className="space-y-4">
              <Field label="Warehouse receiving the stock" required>
                <Select value={warehouseId} onValueChange={setWarehouseId}>
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
                <p className="text-xs text-[#98A2B3]">
                  Pick this first. Products in the next step are matched to this
                  warehouse&apos;s stock.
                </p>
              </Field>

              <Field label="Supplier" required>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 flex-1 items-center gap-2 rounded-lg border border-[#EAECF0] px-3">
                    <Search className="size-4 text-[#98A2B3]" />
                    <Input
                      className="h-9 border-0 p-0 shadow-none focus-visible:ring-0"
                      placeholder="Search suppliers"
                      value={selectedSupplier?.name ?? supplierQuery}
                      onChange={(e) => {
                        setSupplierId("");
                        setSupplierQuery(e.target.value);
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="shrink-0 text-sm font-medium text-[#0B1E66]"
                    onClick={() => toast.info("New supplier is coming soon")}
                  >
                    + New supplier
                  </button>
                </div>
                {!selectedSupplier && supplierQuery ? (
                  <div className="rounded-lg border border-[#EAECF0] bg-white">
                    {filteredSuppliers.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className="block w-full px-3 py-2 text-left text-sm hover:bg-[#F9FAFB]"
                        onClick={() => {
                          setSupplierId(s.id);
                          setSupplierQuery("");
                        }}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                ) : null}
                {selectedSupplier ? (
                  <div className="grid grid-cols-1 gap-2 rounded-lg border border-[#EAECF0] bg-[#F8FAFC] p-3 text-xs text-[#344054] sm:grid-cols-3">
                    <div>
                      <p className="text-[#98A2B3]">Contact</p>
                      <p className="font-medium">{selectedSupplier.contact}</p>
                    </div>
                    <div>
                      <p className="text-[#98A2B3]">Phone</p>
                      <p className="font-medium">{selectedSupplier.phone}</p>
                    </div>
                    <div>
                      <p className="text-[#98A2B3]">Address</p>
                      <p className="font-medium">{selectedSupplier.address}</p>
                    </div>
                    <p className="sm:col-span-3 text-[#667085]">
                      Past deliveries {selectedSupplier.pastDeliveries} · last on{" "}
                      {selectedSupplier.lastOn}
                    </p>
                  </div>
                ) : null}
              </Field>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Field label="Truck number" required>
                  <Input
                    placeholder="e.g. KJA 482 XY"
                    value={truckNumber}
                    onChange={(e) => setTruckNumber(e.target.value)}
                    className="h-10 rounded-lg border-[#EAECF0]"
                  />
                </Field>
                <Field label="Driver name (optional)">
                  <Input
                    placeholder="Driver's name"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="h-10 rounded-lg border-[#EAECF0]"
                  />
                </Field>
                <Field label="Received on" required>
                  <Input
                    type="datetime-local"
                    value={receivedOn}
                    onChange={(e) => setReceivedOn(e.target.value)}
                    className="h-10 rounded-lg border-[#EAECF0]"
                  />
                </Field>
              </div>

              <Field label="Delivery description">
                <textarea
                  placeholder="What arrived, how it was packed, anything damaged"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-20 w-full resize-none rounded-lg border border-[#EAECF0] px-3 py-2 text-sm outline-none"
                />
              </Field>

              <div className="rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-3 py-2 text-sm text-[#667085]">
                Recorded by {recorder} (you). Added to the record automatically.
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <p className="text-sm text-[#667085]">
                Into{" "}
                <span className="font-medium text-[#101828]">
                  {warehouseName} warehouse
                </span>{" "}
                · from {selectedSupplier?.name} · truck {truckNumber}{" "}
                <button
                  type="button"
                  className="font-medium text-[#0B1E66]"
                  onClick={() => setStep(1)}
                >
                  Change
                </button>
              </p>
              {showErrors && errorCount > 0 ? (
                <div className="rounded-lg border border-[#FECDCA] bg-[#FEF3F2] px-3 py-2 text-sm text-[#B42318]">
                  {errorCount} fields need fixing before you can continue
                </div>
              ) : null}

              {lines.map((line, index) => {
                const errors = showErrors ? lineErrors(line) : [];
                const total = lineTotals[index] || 0;
                return (
                  <div
                    key={index}
                    className={cn(
                      "space-y-3 rounded-xl border p-4",
                      errors.length > 0
                        ? "border-[#FDA29B]"
                        : "border-[#EAECF0]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-[#101828]">
                        {index + 1}{" "}
                        {line.name || "Select a product"}
                      </p>
                      {line.existing ? (
                        <span className="rounded-full bg-[#ECFDF3] px-2 py-0.5 text-[11px] font-medium text-[#027A48]">
                          EXISTING
                        </span>
                      ) : null}
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <Field label="Product">
                        <Select
                          value={line.productId}
                          onValueChange={(value) => applyProduct(index, value)}
                          disabled={loadingProducts}
                        >
                          <SelectTrigger className="h-10 w-full! rounded-lg border-[#EAECF0]">
                            <SelectValue placeholder="Choose product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((p) => (
                              <SelectItem key={p.id} value={String(p.id)}>
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field
                        label="Brand"
                        error={errors.includes("brand") ? "Add the brand" : undefined}
                      >
                        <Input
                          placeholder="e.g. Oraimo"
                          value={line.brand}
                          onChange={(e) =>
                            setLines((prev) =>
                              prev.map((row, i) =>
                                i === index
                                  ? { ...row, brand: e.target.value }
                                  : row,
                              ),
                            )
                          }
                          className={cn(
                            "h-10 rounded-lg",
                            errors.includes("brand")
                              ? "border-[#F04438]"
                              : "border-[#EAECF0]",
                          )}
                        />
                      </Field>
                      <Field label="Size / variant">
                        <Input
                          placeholder="e.g. 128GB · Black"
                          value={line.variant}
                          onChange={(e) =>
                            setLines((prev) =>
                              prev.map((row, i) =>
                                i === index
                                  ? { ...row, variant: e.target.value }
                                  : row,
                              ),
                            )
                          }
                          className="h-10 rounded-lg border-[#EAECF0]"
                        />
                      </Field>
                    </div>
                    <Field label="Specifications">
                      <Input
                        placeholder="Short spec line"
                        value={line.specs}
                        onChange={(e) =>
                          setLines((prev) =>
                            prev.map((row, i) =>
                              i === index
                                ? { ...row, specs: e.target.value }
                                : row,
                            ),
                          )
                        }
                        className="h-10 rounded-lg border-[#EAECF0]"
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <Field
                        label="Quantity received"
                        required
                        error={
                          errors.includes("quantity")
                            ? "Enter how many arrived"
                            : undefined
                        }
                      >
                        <Input
                          type="number"
                          min={0}
                          value={line.quantity}
                          onChange={(e) =>
                            setLines((prev) =>
                              prev.map((row, i) =>
                                i === index
                                  ? { ...row, quantity: e.target.value }
                                  : row,
                              ),
                            )
                          }
                          className={cn(
                            "h-10 rounded-lg",
                            errors.includes("quantity")
                              ? "border-[#F04438]"
                              : "border-[#EAECF0]",
                          )}
                        />
                      </Field>
                      <Field label="Unit cost (₦)">
                        <Input
                          type="number"
                          min={0}
                          value={line.unitCost}
                          onChange={(e) =>
                            setLines((prev) =>
                              prev.map((row, i) =>
                                i === index
                                  ? { ...row, unitCost: e.target.value }
                                  : row,
                              ),
                            )
                          }
                          className="h-10 rounded-lg border-[#EAECF0]"
                        />
                      </Field>
                      <Field label="Damaged on arrival">
                        <Input
                          type="number"
                          min={0}
                          value={line.damaged}
                          onChange={(e) =>
                            setLines((prev) =>
                              prev.map((row, i) =>
                                i === index
                                  ? { ...row, damaged: e.target.value }
                                  : row,
                              ),
                            )
                          }
                          className="h-10 rounded-lg border-[#EAECF0]"
                        />
                      </Field>
                      <Field label="Line total">
                        <p className="flex h-10 items-center text-sm font-semibold text-[#101828]">
                          {naira(total)}
                        </p>
                      </Field>
                    </div>
                  </div>
                );
              })}
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm font-medium text-[#0B1E66]"
                onClick={() => setLines((prev) => [...prev, emptyProduct()])}
              >
                <Plus className="size-4" />
                Add another product
              </button>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Field label="Invoice number" required>
                  <Input
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="h-10 rounded-lg border-[#EAECF0]"
                  />
                </Field>
                <Field label="Invoice date">
                  <Input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="h-10 rounded-lg border-[#EAECF0]"
                  />
                </Field>
                <Field label="Amount on invoice (₦)" required>
                  <Input
                    type="number"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    className="h-10 rounded-lg border-[#EAECF0]"
                  />
                </Field>
              </div>
              {Number(invoiceAmount) === productsTotal && productsTotal > 0 ? (
                <p className="text-xs text-[#027A48]">
                  Matches the products you entered ({naira(productsTotal)})
                </p>
              ) : null}

              <div>
                <p className="mb-2 text-[13px] font-medium text-[#344054]">
                  Payment to supplier
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  {(
                    [
                      ["full", "Paid in full"],
                      ["part", "Part paid"],
                      ["unpaid", "Not paid yet"],
                    ] as const
                  ).map(([id, label]) => (
                    <label key={id} className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="payment"
                        checked={payment === id}
                        onChange={() => setPayment(id)}
                        className="accent-[#0B1E66]"
                      />
                      {label}
                    </label>
                  ))}
                </div>
                {payment === "part" ? (
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Field label="Amount paid (₦)">
                      <Input
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                        className="h-10 rounded-lg border-[#EAECF0]"
                      />
                    </Field>
                    <Field label="Balance">
                      <Input
                        value={
                          amountPaid
                            ? naira(
                                Math.max(
                                  0,
                                  (Number(invoiceAmount) || 0) -
                                    (Number(amountPaid) || 0),
                                ),
                              )
                            : ""
                        }
                        readOnly
                        className="h-10 rounded-lg border-[#FEDF89] bg-[#FFFAEB]"
                      />
                    </Field>
                    <Field label="Balance due">
                      <Input
                        type="date"
                        value={balanceDue}
                        onChange={(e) => setBalanceDue(e.target.value)}
                        className="h-10 rounded-lg border-[#EAECF0]"
                      />
                    </Field>
                  </div>
                ) : null}
              </div>

              <div className="rounded-xl border border-[#EAECF0] p-3">
                <p className="mb-2 text-[12px] font-semibold tracking-wide text-[#667085]">
                  CHECK BEFORE SAVING
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                  <div>
                    <p className="text-[#98A2B3]">Warehouse</p>
                    <p className="font-medium text-[#101828]">{warehouseName}</p>
                  </div>
                  <div>
                    <p className="text-[#98A2B3]">Supplier</p>
                    <p className="font-medium text-[#101828]">
                      {selectedSupplier?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#98A2B3]">Products</p>
                    <p className="font-medium text-[#101828]">
                      {lines.length} · {unitsTotal} units
                    </p>
                  </div>
                  <div>
                    <p className="text-[#98A2B3]">Total cost</p>
                    <p className="font-medium text-[#101828]">
                      {naira(productsTotal)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[#EAECF0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="text-sm text-[#667085]">
            {step === 2
              ? `${lines.length} products · ${unitsTotal} units · ${naira(productsTotal)}`
              : step === 3
                ? `Adds ${unitsTotal} units to ${warehouseName} and 2 entries to the audit log`
                : null}
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            {step === 1 ? (
              <Button
                type="button"
                variant="ghost"
                className="h-10 rounded-lg"
                onClick={onClose}
              >
                Cancel
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                className="h-10 rounded-lg"
                onClick={() => setStep((s) => (s === 3 ? 2 : 1))}
              >
                Back
              </Button>
            )}
            {step === 1 ? (
              <Button
                type="button"
                className="h-10 rounded-lg bg-[#0B1E66] text-white hover:bg-[#0B1E66]/90"
                onClick={goStep2}
              >
                Next: products
                <ChevronRight className="size-4" />
              </Button>
            ) : null}
            {step === 2 ? (
              <Button
                type="button"
                className="h-10 rounded-lg bg-[#0B1E66] text-white hover:bg-[#0B1E66]/90"
                onClick={goStep3}
              >
                Next: invoice
                <ChevronRight className="size-4" />
              </Button>
            ) : null}
            {step === 3 ? (
              <Button
                type="button"
                className="h-10 rounded-lg bg-[#0B1E66] text-white hover:bg-[#0B1E66]/90"
                disabled={saving}
                onClick={saveStock}
              >
                {saving ? "Saving..." : "Save stock"}
              </Button>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[13px] font-medium text-[#344054]">
        {label}
        {required ? <span className="text-[#D92D20]"> *</span> : null}
      </Label>
      {children}
      {error ? <p className="text-xs text-[#D92D20]">{error}</p> : null}
    </div>
  );
}
