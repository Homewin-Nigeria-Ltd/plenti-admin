"use client";

import * as React from "react";
import { FinanceMetricsCard } from "@/components/finance/FinanceMetricsCard";
import { FinanceTabs } from "@/components/finance/FinanceTabs";
import { PaymentMethodDistribution } from "@/components/finance/PaymentMethodDistribution";
import { FinanceTransactionTable } from "@/components/finance/PaymentMethodTicketsTable";
import { RefundRequestTable } from "@/components/finance/RefundRequestTable";
import { RevenueOverviewChart } from "@/components/finance/RevenueOverviewChart";

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
