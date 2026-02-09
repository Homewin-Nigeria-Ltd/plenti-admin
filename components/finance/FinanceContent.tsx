"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { FinanceMetricsCard } from "@/components/finance/FinanceMetricsCard";
import { FinanceTabs } from "@/components/finance/FinanceTabs";
import { FinanceTransactionTable } from "@/components/finance/PaymentMethodTicketsTable";
import { RefundRequestTable } from "@/components/finance/RefundRequestTable";

const RevenueOverviewChart = dynamic(
  () =>
    import("@/components/finance/RevenueOverviewChart").then(
      (mod) => mod.RevenueOverviewChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-75 bg-[#EEF1F6] rounded-xl animate-pulse" />
    ),
  }
);

const PaymentMethodDistribution = dynamic(
  () =>
    import("@/components/finance/PaymentMethodDistribution").then(
      (mod) => mod.PaymentMethodDistribution
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-90 bg-[#EEF1F6] rounded-xl animate-pulse" />
    ),
  }
);

export function FinanceContent() {
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "transaction" | "refund"
  >("overview");

  return (
    <div className="space-y-6">
      <FinanceTabs value={activeTab} onValueChange={setActiveTab} />

      {activeTab === "overview" && (
        <div className="space-y-6">
          <FinanceMetricsCard />
          <RevenueOverviewChart />
          <PaymentMethodDistribution />
          <FinanceTransactionTable />
        </div>
      )}

      {activeTab === "transaction" && <FinanceTransactionTable />}

      {activeTab === "refund" && <RefundRequestTable />}
    </div>
  );
}
