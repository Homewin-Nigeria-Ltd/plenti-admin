"use client";

import * as React from "react";
import type { StockLevel } from "@/types/InventoryTypes";
import StockLevelChart from "./StockLevelChart";

type StockLevelCardProps = {
  stockLevel: StockLevel;
};

export default function StockLevelCard({ stockLevel }: StockLevelCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#EAECF0] p-4 sm:p-6 shadow-xs">
      <h3 className="text-primary-700 font-semibold text-sm sm:text-base mb-4 sm:mb-6">Stock Level</h3>
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        <div className="flex items-center justify-center shrink-0 w-full lg:w-auto">
          <StockLevelChart
            activeInStock={stockLevel.activeInStock}
            highStock={stockLevel.highStock}
            mediumStock={stockLevel.mediumStock}
            lowStock={stockLevel.lowStock}
          />
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-xs sm:text-sm font-medium text-neutral-700">HIGH STOCK PRODUCT</p>
            <div className="w-full bg-neutral-100 rounded-full h-2">
              <div
                className="bg-[#E8EEFF] h-2 rounded-full"
                style={{ width: `${stockLevel.highStock}%` }}
              />
            </div>
            <span className="text-xs sm:text-sm font-medium text-neutral-700">
              {new Intl.NumberFormat("en-US").format(stockLevel.highStockItems)} Items
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs sm:text-sm font-medium text-neutral-700">MEDIUM STOCK PRODUCT</p>
            <div className="w-full bg-neutral-100 rounded-full h-2">
              <div
                className="bg-[#2E5CDB] h-2 rounded-full"
                style={{ width: `${stockLevel.mediumStock}%` }}
              />
            </div>
            <span className="text-xs sm:text-sm font-medium text-neutral-700">
              {new Intl.NumberFormat("en-US").format(stockLevel.mediumStockItems)} Items
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs sm:text-sm font-medium text-neutral-700">LOW STOCK PRODUCT</p>
            <div className="w-full bg-neutral-100 rounded-full h-2">
              <div
                className="bg-[#0B1E66] h-2 rounded-full"
                style={{ width: `${stockLevel.lowStock}%` }}
              />
            </div>
            <span className="text-xs sm:text-sm font-medium text-neutral-700">
              {new Intl.NumberFormat("en-US").format(stockLevel.lowStockItems)} Items
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
