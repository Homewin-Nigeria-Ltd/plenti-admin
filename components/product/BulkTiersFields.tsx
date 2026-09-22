"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProductBulkTier } from "@/data/products";
import { Plus, Trash2 } from "lucide-react";

export type BulkTierRow = {
  min_qty: string;
  price: string;
};

export function emptyBulkTierRow(): BulkTierRow {
  return { min_qty: "", price: "" };
}

export function parseBulkTierRows(
  rows: BulkTierRow[]
): { ok: true; tiers: ProductBulkTier[] } | { ok: false; message: string } {
  const tiers: ProductBulkTier[] = [];
  const seen = new Set<number>();

  for (const row of rows) {
    const qtyRaw = row.min_qty.trim();
    const priceRaw = row.price.trim();
    if (qtyRaw === "" && priceRaw === "") continue;

    const min_qty = Number(qtyRaw);
    const price = Number(priceRaw);

    if (!Number.isFinite(min_qty) || min_qty <= 0) {
      return {
        ok: false,
        message: "Please enter a valid min quantity for each bulk tier",
      };
    }
    if (!Number.isFinite(price) || price <= 0) {
      return {
        ok: false,
        message: "Please enter a valid price for each bulk tier",
      };
    }
    if (seen.has(min_qty)) {
      return {
        ok: false,
        message: "Bulk tiers must have unique min quantities",
      };
    }
    seen.add(min_qty);
    tiers.push({ min_qty, price });
  }

  tiers.sort((a, b) => a.min_qty - b.min_qty);
  return { ok: true, tiers };
}

export function bulkTiersEqual(
  a: ProductBulkTier[],
  b: ProductBulkTier[]
): boolean {
  if (a.length !== b.length) return false;
  return a.every(
    (tier, i) => tier.min_qty === b[i].min_qty && tier.price === b[i].price
  );
}

export function productToBulkTierRows(product: {
  bulkTiers?: ProductBulkTier[] | null;
  minBulkQuantity?: number | null;
  bulkPriceRaw?: number | null;
}): BulkTierRow[] {
  if (product.bulkTiers && product.bulkTiers.length > 0) {
    return product.bulkTiers.map((tier) => ({
      min_qty: String(tier.min_qty),
      price: String(tier.price),
    }));
  }

  if (
    typeof product.minBulkQuantity === "number" ||
    typeof product.bulkPriceRaw === "number"
  ) {
    return [
      {
        min_qty:
          typeof product.minBulkQuantity === "number"
            ? String(product.minBulkQuantity)
            : "",
        price:
          typeof product.bulkPriceRaw === "number"
            ? String(product.bulkPriceRaw)
            : "",
      },
    ];
  }

  return [emptyBulkTierRow()];
}

type BulkTiersFieldsProps = {
  idPrefix: string;
  value: BulkTierRow[];
  onChange: (next: BulkTierRow[]) => void;
};

export function BulkTiersFields({
  idPrefix,
  value,
  onChange,
}: BulkTiersFieldsProps) {
  const updateRow = (
    index: number,
    field: keyof BulkTierRow,
    fieldValue: string
  ) => {
    onChange(
      value.map((row, i) =>
        i === index ? { ...row, [field]: fieldValue } : row
      )
    );
  };

  const addRow = () => onChange([...value, emptyBulkTierRow()]);

  const removeRow = (index: number) => {
    if (value.length <= 1) {
      onChange([emptyBulkTierRow()]);
      return;
    }
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label>Bulk Tiers</Label>
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <Plus className="size-4 mr-1" />
          Add tier
        </Button>
      </div>

      {value.map((row, index) => (
        <div
          key={`${idPrefix}-${index}`}
          className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end"
        >
          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-minQty-${index}`}>Min Quantity</Label>
            <Input
              id={`${idPrefix}-minQty-${index}`}
              type="number"
              min={1}
              placeholder="e.g. 100"
              value={row.min_qty}
              onChange={(e) => updateRow(index, "min_qty", e.target.value)}
              className="form-control"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-price-${index}`}>Price</Label>
            <Input
              id={`${idPrefix}-price-${index}`}
              type="number"
              min={0}
              placeholder="e.g. 9090"
              value={row.price}
              onChange={(e) => updateRow(index, "price", e.target.value)}
              className="form-control"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeRow(index)}
            aria-label="Remove bulk tier"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
