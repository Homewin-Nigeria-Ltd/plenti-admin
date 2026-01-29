"use client";

import * as React from "react";
import Image from "next/image";
import type { RecentStock } from "@/types/InventoryTypes";

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
      <h3 className="text-primary-700 font-semibold text-lg sm:text-xl mb-4 sm:mb-6">Recently Stock</h3>
      <div className="space-y-0">
        {recentStocks.map((stock, index) => (
          <div
            key={stock.id}
            className={`flex items-center gap-3 sm:gap-4 py-3 sm:py-4 ${
              index < recentStocks.length - 1 ? "border-b border-neutral-200" : ""
            }`}>
            <div 
              className="bg-[#0B1E66] text-white flex items-center justify-center font-semibold shrink-0"
              style={{ 
                width: '20.4061279296875px', 
                height: '18.773761749267578px', 
                opacity: 1, 
                transform: 'rotate(0deg)',
                borderRadius: '97.17px',
                padding: '3.89px',
                gap: '9.72px',
                fontSize: '9px'
              }}>
              {index + 1}
            </div>
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shrink-0">
              <Image
                src={stock.productImage}
                alt={stock.productName}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className="font-bold text-primary-700 text-sm sm:text-base leading-tight">{stock.productName}</p>
              <p className="text-xs sm:text-sm text-neutral-500 leading-tight mt-0.5">
                Purchased by {stock.purchasedBy}
              </p>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 shrink-0">
              <div className="min-w-[60px] sm:min-w-[80px]">
                <p className="text-xs text-neutral-500 mb-1 leading-tight text-center">Quantity</p>
                <p className="font-bold text-primary-700 text-sm sm:text-base leading-tight text-center">{stock.quantity}</p>
              </div>
              <div className="min-w-[80px] sm:min-w-[100px]">
                <p className="text-xs text-neutral-500 mb-1 leading-tight text-center">Category</p>
                <p className="font-bold text-primary-700 text-sm sm:text-base leading-tight text-center">{stock.category}</p>
              </div>
              <div className="min-w-[80px] sm:min-w-[100px]">
                <p className="text-xs text-neutral-500 mb-1 leading-tight text-center">Price</p>
                <p className="font-bold text-primary-700 text-sm sm:text-base leading-tight text-center">{formatCurrency(stock.price)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
