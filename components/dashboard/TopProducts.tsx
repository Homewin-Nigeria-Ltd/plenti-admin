"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

type Product = {
  rank: number;
  name: string;
  category: string;
  unitsSold: string;
  totalIncome: string;
  imageUrl?: string;
};

const topProducts: Product[] = [
  {
    rank: 1,
    name: "Mr. Chef Salt",
    category: "Cooking Items",
    unitsSold: "250K",
    totalIncome: "₦400,000",
  },
  {
    rank: 2,
    name: "Dano Milk",
    category: "Cooking Items",
    unitsSold: "230K",
    totalIncome: "₦350,000",
  },
  {
    rank: 3,
    name: "Sunflower Groundnut Oil",
    category: "Cooking Items",
    unitsSold: "210K",
    totalIncome: "₦320,000",
  },
  {
    rank: 4,
    name: "Mama Gold Rice",
    category: "Cooking Items",
    unitsSold: "190K",
    totalIncome: "₦310,000",
  },
  {
    rank: 5,
    name: "Sonic Iron",
    category: "Cooking Items",
    unitsSold: "180K",
    totalIncome: "₦300,000",
  },
];

export default function TopProducts() {
  const [period, setPeriod] = React.useState("monthly");

  return (
    <div className="bg-white rounded-xl border border-[#EEF1F6] p-6 shadow-xs">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-[#071D32] text-[20px] font-bold mb-1">
            Top Products
          </h3>
          <p className="text-[#909090] text-sm">
            Based on number order frequency (units sold)
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[120px] h-9 border-[#EEF1F6]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {topProducts.map((product) => (
          <div
            key={product.rank}
            className="flex items-center gap-4 py-3  rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="shrink-0 w-8 h-8 rounded-full bg-[#0B1E66] text-white flex items-center justify-center text-sm font-semibold">
                {product.rank}
              </div>
              <div className="shrink-0 w-12 h-12 rounded-lg bg-[#E8EEFF] flex items-center justify-center">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#D0D5DD] rounded-lg" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#101928] font-medium text-sm truncate">
                  {product.name}
                </p>
                <p className="text-[#667085] text-xs">{product.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 shrink-0">
              <div className="text-right">
                <p className="text-[#98A2B3] text-xs">Number Sold</p>

                <p className="text-[#0A2B4B] font-bold text-[16px]">
                  {product.unitsSold}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[#98A2B3] text-xs">Total Income</p>
                <p className="text-[#0A2B4B] font-bold text-[16px]">
                  {product.totalIncome}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
