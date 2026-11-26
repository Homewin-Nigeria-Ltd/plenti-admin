"use client";

import { formatCompactNaira, parseNumeric } from "@/lib/mappers/dashboard";
import type { WarehouseApi } from "@/types/InventoryTypes";
import { Warehouse } from "lucide-react";
import { useRouter } from "next/navigation";

type DashboardWarehousesProps = {
  warehouses: WarehouseApi[];
};

const FALLBACK_FILL = [72, 64, 48];
const FALLBACK_DELIVERIES = [2, 1, 0];
const FALLBACK_LOW = [3, 2, 1];
const FALLBACK_OUT = [1, 2, 0];

const DUMMY_WAREHOUSES: WarehouseApi[] = [
  {
    id: -1,
    name: "Port Harcourt",
    manager: null,
    is_active: true,
    total_products: 1240,
    total_units: 1240,
    total_worth: 48200000,
    low_stock_products: 3,
    out_of_stock_products: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: -2,
    name: "Abuja North",
    manager: null,
    is_active: true,
    total_products: 980,
    total_units: 980,
    total_worth: 36100000,
    low_stock_products: 2,
    out_of_stock_products: 2,
    created_at: "",
    updated_at: "",
  },
  {
    id: -3,
    name: "Kano Main",
    manager: null,
    is_active: true,
    total_products: 640,
    total_units: 640,
    total_worth: 21800000,
    low_stock_products: 1,
    out_of_stock_products: 0,
    created_at: "",
    updated_at: "",
  },
];

function deliveryLabel(count: number) {
  if (count <= 0) return "No delivery today";
  if (count === 1) return "1 delivery today";
  return `${count} deliveries today`;
}

export default function DashboardWarehouses({
  warehouses,
}: DashboardWarehousesProps) {
  const router = useRouter();

  const cards = warehouses.length > 0 ? warehouses : DUMMY_WAREHOUSES;

  return (
    <section>
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-sm font-semibold text-[#101828]">Warehouses</h2>
        <button
          type="button"
          className="text-[12px] font-medium text-[#2F5BDB]"
          onClick={() => router.push("/inventory")}
        >
          Search stock across warehouses
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-1 snap-x snap-mandatory">
          {cards.map((warehouse, index) => {
            const slot = index % FALLBACK_FILL.length;
            const products = parseNumeric(warehouse.total_products);
            const value = parseNumeric(warehouse.total_worth);
            const fill = FALLBACK_FILL[slot];
            const deliveries = FALLBACK_DELIVERIES[slot];
            const low =
              warehouse.low_stock_products == null
                ? FALLBACK_LOW[slot]
                : parseNumeric(warehouse.low_stock_products);
            const out =
              warehouse.out_of_stock_products == null
                ? FALLBACK_OUT[slot]
                : parseNumeric(warehouse.out_of_stock_products);
            return (
              <article
                key={warehouse.id}
                className="min-w-[280px] w-[320px] shrink-0 snap-start rounded-2xl border border-[#E4E6EB] bg-white p-4 cursor-pointer hover:border-[#E4E6EB]"
                onClick={() => {
                  if (warehouse.id > 0) {
                    router.push(`/inventory/warehouse/${warehouse.id}`);
                  }
                }}
              >
                <div className="flex items-start gap-2.5">
                  <span className="size-9 rounded-xl bg-[#EEF2FF] text-[#2F5BDB] inline-flex items-center justify-center shrink-0">
                    <Warehouse className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#101828] truncate">
                      {warehouse.name}
                    </p>
                    <p className="text-[12px] text-[#667085]">
                      {products.toLocaleString()} products ·{" "}
                      {deliveryLabel(deliveries)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <p className="text-[12px] text-[#667085]">Stock value</p>
                  <p className="text-lg font-semibold text-[#101828]">
                    {formatCompactNaira(value)}
                  </p>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-[#F2F4F7] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#2F5BDB]"
                    style={{ width: `${fill}%` }}
                  />
                </div>
                <span className="mt-2 inline-flex rounded-full border border-[#E4E6EB] px-2.5 py-0.5 text-[12px] text-[#667085]">
                  {fill}% of space used
                </span>
                <div className="mt-2.5 flex items-center gap-3 text-[12px]">
                  <span className="inline-flex items-center gap-1.5 text-[#F79009]">
                    <span className="size-1.5 rounded-full bg-[#F79009]" />
                    {low} low
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[#F04438]">
                    <span className="size-1.5 rounded-full bg-[#F04438]" />
                    {out} out of stock
                  </span>
                </div>
              </article>
            );
          })}
        </div>
    </section>
  );
}
