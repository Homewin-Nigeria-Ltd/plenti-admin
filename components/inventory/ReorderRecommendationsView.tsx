"use client";

import * as React from "react";
import api from "@/lib/api";
import { INVENTORY_API } from "@/data/inventory";
import type {
  ReorderRecommendationItem,
  ReorderRecommendationsResponse,
} from "@/types/InventoryTypes";
import { toast } from "sonner";

function getUrgencyStyles(urgency: string) {
  const u = urgency.toUpperCase();
  if (u === "HIGH")
    return "px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800";
  if (u === "MEDIUM")
    return "px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800";
  return "px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700";
}

export function ReorderRecommendationsView() {
  const [items, setItems] = React.useState<ReorderRecommendationItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    api
      .get<ReorderRecommendationsResponse>(INVENTORY_API.reorderRecommendations)
      .then(({ data }) => {
        if (data?.status === "success" && Array.isArray(data?.data)) {
          setItems(data.data);
        } else {
          setItems([]);
        }
      })
      .catch((err) => {
        console.error("Reorder recommendations fetch error:", err);
        toast.error("Failed to load reorder recommendations");
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-[#EAECF0] p-4 sm:p-5 animate-pulse"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-neutral-200 rounded w-48" />
                <div className="h-4 bg-neutral-100 rounded w-32" />
                <div className="h-4 bg-neutral-100 rounded w-40" />
              </div>
              <div className="h-6 w-16 rounded-full bg-neutral-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#EAECF0] p-8 text-center text-[#667085] text-sm">
        No reorder recommendations at this time.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((r) => (
        <div
          key={`${r.product_id}-${r.warehouse}`}
          className="bg-white rounded-xl border border-[#EAECF0] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-primary">{r.product_name}</p>
              <span
                className={getUrgencyStyles(r.urgency)}
              >
                {r.urgency}
              </span>
            </div>
            <p className="text-[#667085] text-sm mt-1">{r.sku} · {r.warehouse}</p>
            <p className="text-[#667085] text-sm mt-1">
              Current: {r.current_stock} units · Reorder point: {r.reorder_point}
            </p>
            <p className="text-[#667085] text-sm">
              Monthly sales: {r.monthly_sales} · ~{r.days_of_stock_remaining} days of stock left
            </p>
            <p className="text-[#667085] text-sm">Supplier: {r.supplier}</p>
          </div>
          <div className="sm:text-right shrink-0">
            <p className="font-semibold text-[#0B1E66]">
              Order {r.recommended_reorder_quantity} units
            </p>
            <p className="text-[#667085] text-xs mt-1">
              Recommended reorder quantity
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
