"use client";

import * as React from "react";
import type { Warehouse } from "@/data/inventory";
import { cn } from "@/lib/utils";

type WarehouseCardProps = {
  warehouse: Warehouse;
};

export default function WarehouseCard({ warehouse }: WarehouseCardProps) {
  const getFillBadgeClass = (percentage: number) => {
    if (percentage >= 70) {
      return "bg-primary text-white";
    } else if (percentage >= 40) {
      return "bg-orange-100 text-orange-700";
    } else {
      return "bg-red-100 text-red-700";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#EAECF0] p-4 sm:p-5 shadow-xs">
      <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
        <h3 className="text-primary-700 font-semibold text-xs sm:text-sm truncate flex-1">{warehouse.name}</h3>
        <span
          className={cn(
            "px-2 sm:px-3 py-1 rounded-full text-xs font-medium shrink-0",
            getFillBadgeClass(warehouse.fillPercentage)
          )}>
          {warehouse.fillPercentage}% Full
        </span>
      </div>
      <div className="mb-2 sm:mb-3">
        <p className="text-[#0B1E66] text-xl sm:text-2xl font-semibold tracking-tight">
          {new Intl.NumberFormat("en-US").format(warehouse.units)}
          <span className="text-sm sm:text-base font-normal text-neutral-600 ml-1">Units</span>
        </p>
      </div>
      <div>
        <p className="text-neutral-500 text-xs truncate">
          Manager: <span className="text-neutral-700">{warehouse.manager}</span>
        </p>
      </div>
    </div>
  );
}
