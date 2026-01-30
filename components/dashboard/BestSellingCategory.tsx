"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BestSellingCategoryProps = {
  topCategory?: string | null;
};

export default function BestSellingCategory({ topCategory }: BestSellingCategoryProps) {
  const [period, setPeriod] = React.useState("monthly");

  return (
    <div className="bg-white rounded-xl border border-[#EEF1F6] p-6 shadow-xs">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-[#071D32] text-[20px] font-bold mb-1">
            Best Selling Category
          </h3>
          <p className="text-[#909090] text-sm">
            Top weekly category
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

      <div className="flex items-center justify-center py-8">
        <p className="text-[#0B1E66] text-2xl font-semibold">
          {topCategory || "—"}
        </p>
      </div>
    </div>
  );
}
