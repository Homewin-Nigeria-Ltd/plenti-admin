"use client";

import * as React from "react";
import api from "@/lib/api";
import { INVENTORY_API } from "@/data/inventory";
import type { LowStockAlertsResponse } from "@/types/InventoryTypes";
import { toast } from "sonner";

export function StockAlertsView() {
  const [products, setProducts] = React.useState<
    NonNullable<LowStockAlertsResponse["data"]>["products"]
  >([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get<LowStockAlertsResponse>(INVENTORY_API.lowStockAlerts)
      .then(({ data }) => {
        if (cancelled) return;
        if (data?.status === "success" && data?.data?.products) {
          setProducts(data.data.products);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Low stock alerts fetch error:", err);
        toast.error("Failed to load stock alerts");
        setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#FEFCE8] rounded-xl border border-amber-200/80 p-4 sm:p-5 animate-pulse flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="h-4 bg-amber-100 rounded w-40" />
              <div className="h-3 bg-amber-50 rounded w-28" />
            </div>
            <div className="space-y-2 sm:text-right">
              <div className="h-4 bg-amber-100 rounded w-24" />
              <div className="h-3 bg-amber-50 rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#EAECF0] p-8 text-center text-[#667085] text-sm">
        No low stock alerts at the moment.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-[#FEFCE8] rounded-xl border border-amber-200/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <p className="font-semibold text-[#101928]">{product.name}</p>
            <p className="text-[#667085] text-sm mt-1">
              {product.sku ? product.sku : "—"}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="font-semibold text-[#101928]">
              {product.stock} units left
            </p>
            <p className="text-[#667085] text-sm">
              Reorder at: {product.low_stock_threshold}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
