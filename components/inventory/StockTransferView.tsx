"use client";

import * as React from "react";
import { ArrowRightLeft } from "lucide-react";

const MOCK_TRANSFERS = [
  {
    id: "1",
    product: "Premium Rice 50kg",
    from: "Lagos Central",
    to: "Abuja North",
    quantity: 50,
    date: "2024-11-17",
    status: "in_transit",
  },
  {
    id: "2",
    product: "Cooking Oil 5L",
    from: "Kano Main",
    to: "Port Harcourt",
    quantity: 30,
    date: "2024-11-17",
    status: "in_transit",
  },
  {
    id: "3",
    product: "Sugar 1kg",
    from: "Kano Main",
    to: "Port Harcourt",
    quantity: 30,
    date: "2024-11-17",
    status: "complete",
  },
];

export function StockTransferView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_TRANSFERS.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl border border-[#EAECF0] p-4 sm:p-5 flex flex-col gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center size-10 rounded-lg bg-[#0B1E66] shrink-0">
                <ArrowRightLeft className="size-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-primary text-sm">
                  {t.product}
                </p>
                <p className="text-[#667085] text-xs mt-0.5">
                  {t.from} → {t.to} • {t.quantity} units
                </p>
                <p className="text-[#667085] text-xs mt-1">{t.date}</p>
              </div>
              <span
                className={
                  t.status === "complete"
                    ? "px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                    : "px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700"
                }
              >
                {t.status === "complete" ? "Complete" : "In Transit"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
