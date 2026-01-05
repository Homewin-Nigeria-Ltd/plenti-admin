"use client";

import * as React from "react";
import Image from "next/image";
import type { RecentStock } from "@/data/inventory";

type RecentlyStockCardProps = {
  recentStocks: RecentStock[];
};

export default function RecentlyStockCard({ recentStocks }: RecentlyStockCardProps) {
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(n);

  return (
    <div className="bg-white rounded-xl border border-[#EAECF0] p-4 sm:p-6 shadow-xs">
      <h3 className="text-primary-700 font-semibold text-sm sm:text-base mb-3 sm:mb-4">Recently Stock</h3>
      <div className="space-y-3 sm:space-y-4">
        {recentStocks.map((stock, index) => (
          <div
            key={stock.id}
            className={index < recentStocks.length - 1 ? "pb-3 sm:pb-4 border-b border-neutral-100" : ""}>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold shrink-0">
                {index + 1}
              </div>
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={stock.productImage}
                  alt={stock.productName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-primary-700 text-xs sm:text-sm mb-1 truncate">{stock.productName}</p>
                <p className="text-xs text-neutral-500 mb-1 sm:mb-2 truncate">
                  Purchased by {stock.purchasedBy}
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-neutral-600">
                  <span>Qty: {stock.quantity}</span>
                  <span>{stock.category}</span>
                  <span className="font-medium text-primary-700">{formatCurrency(stock.price)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
