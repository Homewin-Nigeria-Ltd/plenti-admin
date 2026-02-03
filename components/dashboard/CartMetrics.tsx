"use client";

import * as React from "react";
import { Info } from "lucide-react";

type CartMetricsProps = {
  percentage?: number;
  abandonedCart?: number;
  abandonedRevenue?: string;
};

const formatRevenue = (value: string | number | undefined) => {
  if (value == null) return "—";
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(value);
  }
  const n = parseFloat(value);
  if (Number.isNaN(n)) return value;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(n);
};

export default function CartMetrics({
  percentage = 38,
  abandonedCart = 720,
  abandonedRevenue = "₦500,900",
}: CartMetricsProps) {
  const displayRevenue = formatRevenue(abandonedRevenue);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-xl border border-[#EEF1F6] p-6 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[#0B1E66] text-lg font-semibold">Cart</h3>
        <button
          className="w-6 h-6 rounded-full bg-[#E8EEFF] flex items-center justify-center hover:bg-[#E8EEFF]/80 transition-colors"
          title="Cart abandonment metrics"
        >
          <Info className="w-4 h-4 text-[#0B1E66]" />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center mb-6">
        <div className="relative w-35 h-35">
          <svg
            className="transform -rotate-90"
            width="140"
            height="140"
            viewBox="0 0 140 140"
          >
            {/* Background circle */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#EEF1F6"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#0B1E66"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
            {/* Dot at the end of progress */}
            {/* <g transform={`rotate(${(percentage / 100) * 360 - 90} 70 70)`}>
              <circle cx="70" cy="10" r="6" fill="#0B1E66" />
            </g> */}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#0B1E66] text-[32px] font-semibold">
              {percentage}%
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-10 flex-row-reverse justify-between">
          <p className="text-[#0B1E66] font-medium text-[17px]">
            {abandonedCart.toLocaleString()}
          </p>
          <p className="text-[#0B1E66] text-[17px]">Abandoned Cart</p>
        </div>
        <div className="flex gap-10 flex-row-reverse justify-between">
          <p className="text-[#98A2B3] font-medium text-[17px]">
            {displayRevenue}
          </p>
          <p className="text-[#98A2B3] text-[17px]">Abandoned Revenue</p>
        </div>
      </div>
    </div>
  );
}
