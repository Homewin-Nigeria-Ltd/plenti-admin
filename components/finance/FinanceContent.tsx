"use client";

import * as React from "react";
import { FinanceTabs } from "@/components/finance/FinanceTabs";
import { FinanceMetricsCard } from "@/components/finance/FinanceMetricsCard";
import { RevenueOverviewChart } from "@/components/finance/RevenueOverviewChart";
import { PaymentMethodDistribution } from "@/components/finance/PaymentMethodDistribution";
import { NewRefundRequestButton } from "@/components/finance/NewRefundRequestButton";
import { RefundRequestTable } from "@/components/finance/RefundRequestTable";

type TabKey = "overview" | "transaction" | "refund";

export function FinanceContent() {
  const [activeTab, setActiveTab] = React.useState<TabKey>("overview");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <FinanceTabs value={activeTab} onValueChange={setActiveTab} />
        {activeTab === "refund" && <NewRefundRequestButton />}
      </div>

      {activeTab === "overview" && (
        <>
          <FinanceMetricsCard />
          <RevenueOverviewChart />
          <PaymentMethodDistribution />
        </>
      )}

      {activeTab === "refund" && <RefundRequestTable />}

      {activeTab === "transaction" && (
        <div className="bg-white rounded-[12px] border border-[#EEF1F6] p-6">
          <p className="text-[#667085] text-sm">Transaction content coming soon</p>
        </div>
      )}
    </div>
  );
}

