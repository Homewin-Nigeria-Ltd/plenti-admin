"use client";

import * as React from "react";

type TabKey = "overview" | "transaction" | "refund";

type FinanceTabsProps = {
  value?: TabKey;
  onValueChange?: (value: TabKey) => void;
};

export function FinanceTabs({ value, onValueChange }: FinanceTabsProps) {
  const [internal, setInternal] = React.useState<TabKey>(value ?? "overview");
  const active = value ?? internal;

  const setActive = (v: TabKey) => {
    setInternal(v);
    onValueChange?.(v);
  };

  return (
    <div className={`flex items-center gap-8`}>
      <button
        onClick={() => setActive("overview")}
        className={
          active === "overview"
            ? "text-[#0B1E66] font-medium rounded-[3px] bg-[#E8EEFF] px-3 py-1"
            : "text-[#808080]"
        }
      >
        Overview
      </button>
      <button
        onClick={() => setActive("transaction")}
        className={
          active === "transaction"
            ? "text-[#0B1E66] font-medium rounded-[3px] bg-[#E8EEFF] px-3 py-1"
            : "text-[#808080]"
        }
      >
        Transaction
      </button>
      <button
        onClick={() => setActive("refund")}
        className={
          active === "refund"
            ? "text-[#0B1E66] font-medium rounded-[3px] bg-[#E8EEFF] px-3 py-1"
            : "text-[#808080]"
        }
      >
        Refund Request
      </button>
    </div>
  );
}
