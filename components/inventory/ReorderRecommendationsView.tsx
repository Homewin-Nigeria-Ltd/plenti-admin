"use client";

import * as React from "react";
import api from "@/lib/api";
import { INVENTORY_API } from "@/data/inventory";
import type {
  RestockRecommendationItem,
  RestockRecommendationsResponse,
} from "@/types/InventoryTypes";
import { toast } from "sonner";

export function ReorderRecommendationsView() {
  const [recommendations, setRecommendations] = React.useState<
    RestockRecommendationItem[]
  >([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    api
      .get<RestockRecommendationsResponse>(INVENTORY_API.restockRecommendations)
      .then(({ data }) => {
        if (
          data?.status === "success" &&
          data?.data?.recommendations != null &&
          Array.isArray(data.data.recommendations)
        ) {
          setRecommendations(data.data.recommendations);
        } else {
          setRecommendations([]);
        }
      })
      .catch((err) => {
        console.error("Restock recommendations fetch error:", err);
        toast.error("Failed to load restock recommendations");
        setRecommendations([]);
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

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#EAECF0] p-8 text-center text-[#667085] text-sm">
        No restock recommendations at this time.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recommendations.map((r) => (
        <div
          key={`${r.product_id}-${r.predicted_stockout_date}`}
          className="bg-white rounded-xl border border-[#EAECF0] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="min-w-0">
            <p className="font-semibold text-[#0B1E66]">{r.product_name}</p>
            <p className="text-[#667085] text-sm mt-1">
              Current: {r.current_stock} units · Supplier: {r.supplier ?? "Not specified"}
            </p>
          </div>
          <div className="sm:text-right shrink-0">
            <p className="font-semibold text-[#0B1E66]">
              Order {r.recommended_restock_quantity} units
            </p>
            <p className="text-[#667085] text-sm mt-1">
              Based on 30-day avg. sales
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
