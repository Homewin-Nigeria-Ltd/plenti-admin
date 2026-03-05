"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { FinanceMetricsCard } from "@/components/finance/FinanceMetricsCard";
import { FinanceTabs, type TabKey } from "@/components/finance/FinanceTabs";
import { FinanceTransactionTable } from "@/components/finance/PaymentMethodTicketsTable";
import { RefundRequestTable } from "@/components/finance/RefundRequestTable";
import { getFinancePermissions } from "@/lib/modulePermissions";
import { useAccountStore } from "@/store/useAccountStore";

const RevenueOverviewChart = dynamic(
  () =>
    import("@/components/finance/RevenueOverviewChart").then(
      (mod) => mod.RevenueOverviewChart,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-75 bg-[#EEF1F6] rounded-xl animate-pulse" />
    ),
  },
);

const PaymentMethodDistribution = dynamic(
  () =>
    import("@/components/finance/PaymentMethodDistribution").then(
      (mod) => mod.PaymentMethodDistribution,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-90 bg-[#EEF1F6] rounded-xl animate-pulse" />
    ),
  },
);

export function FinanceContent() {
  const account = useAccountStore((state) => state.account);
  const {
    canViewFinanceModule,
    canViewFinanceOverview,
    canViewFinanceTransactions,
    canViewFinanceRefunds,
  } = React.useMemo(() => getFinancePermissions(account), [account]);

  const availableTabs = React.useMemo<TabKey[]>(() => {
    const tabs: TabKey[] = [];
    if (canViewFinanceOverview) tabs.push("overview");
    if (canViewFinanceTransactions) tabs.push("transaction");
    if (canViewFinanceRefunds) tabs.push("refund");
    return tabs;
  }, [
    canViewFinanceOverview,
    canViewFinanceTransactions,
    canViewFinanceRefunds,
  ]);

  const [activeTab, setActiveTab] = React.useState<TabKey>("overview");

  React.useEffect(() => {
    if (!availableTabs.length) return;
    if (!availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0]);
    }
  }, [availableTabs, activeTab]);

  return (
    <div className="space-y-6">
      {!canViewFinanceModule || availableTabs.length === 0 ? (
        <div className="rounded-xl border border-[#EAECF0] bg-[#F9FAFB] p-12 text-center">
          <p className="text-sm text-[#667085]">
            You do not have permission to view finance management.
          </p>
        </div>
      ) : (
        <>
          <FinanceTabs
            value={activeTab}
            onValueChange={setActiveTab}
            tabs={availableTabs}
          />

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
        </>
      )}
    </div>
  );
}
