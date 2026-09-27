"use client";

import * as React from "react";

export type TabKey = "overview" | "transaction" | "refund";

type FinanceTabsProps = {
  value?: TabKey;
  onValueChange?: (value: TabKey) => void;
  tabs?: TabKey[];
};

const TAB_LABELS: Record<TabKey, string> = {
  overview: "Overview",
  transaction: "Transaction",
  refund: "Refund Request",
};

export function FinanceTabs({
  value,
  onValueChange,
  tabs = ["overview", "transaction", "refund"],
}: FinanceTabsProps) {
  const [internal, setInternal] = React.useState<TabKey>(value ?? "overview");
  const active = value ?? internal;

  const setActive = (v: TabKey) => {
    setInternal(v);
    onValueChange?.(v);
  };

  return (
    <div className="flex items-center gap-4 sm:gap-8 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={
            active === tab
              ? "text-[#0B1E66] font-medium rounded-[3px] bg-[#E8EEFF] px-3 py-1 whitespace-nowrap"
              : "text-[#808080] whitespace-nowrap"
          }
        >
          {TAB_LABELS[tab]}
        </button>
      ))}
    </div>
  );
}
