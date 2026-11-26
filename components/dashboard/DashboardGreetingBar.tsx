"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Download, Plus, Warehouse } from "lucide-react";
import { getDisplayDate, getFirstName, getGreeting } from "@/lib/mappers/dashboard";
import { cn } from "@/lib/utils";
import type { WarehouseApi } from "@/types/InventoryTypes";

type DashboardGreetingBarProps = {
  name?: string | null;
  warehouses?: WarehouseApi[];
  warehouseId?: string;
  onWarehouseChange?: (id: string) => void;
};

export default function DashboardGreetingBar({
  name,
  warehouses = [],
  warehouseId = "all",
  onWarehouseChange,
}: DashboardGreetingBarProps) {
  const router = useRouter();
  const greeting = getGreeting();
  const firstName = getFirstName(name);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-[24px] leading-8 font-semibold text-[#101828] tracking-tight">
          {greeting}
          {firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="text-sm text-[#667085] mt-1">
          {getDisplayDate()} · here&apos;s how Plenti is doing
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Warehouse className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#667085]" />
          <select
            value={warehouseId}
            onChange={(event) => onWarehouseChange?.(event.target.value)}
            className="h-9 appearance-none rounded-lg border border-[#E4E6EB] bg-white pl-9 pr-8 text-[13px] text-[#344054] outline-none"
          >
            <option value="all">All warehouses</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={String(warehouse.id)}>
                {warehouse.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#98A2B3]" />
        </div>
        <button
          type="button"
          className={cn(
            "h-9 px-3.5 rounded-lg border border-[#E4E6EB] bg-white text-[13px] font-medium text-[#344054]",
            "inline-flex items-center gap-1.5 hover:bg-[#F9FAFB]",
          )}
          onClick={() => router.push("/finance")}
        >
          <Download className="size-3.5" />
          Export
        </button>
        <button
          type="button"
          className="h-9 px-3.5 rounded-lg bg-[#2F5BDB] text-white text-[13px] font-medium inline-flex items-center gap-1.5 hover:bg-[#2F5BDB]/90"
          onClick={() => router.push("/inventory")}
        >
          <Plus className="size-3.5" />
          Add new stock
        </button>
      </div>
    </div>
  );
}
