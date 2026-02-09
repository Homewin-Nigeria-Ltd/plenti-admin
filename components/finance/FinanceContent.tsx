"use client";

import { FinanceMetricsCard } from "@/components/finance/FinanceMetricsCard";
import { PaymentMethodDistribution } from "@/components/finance/PaymentMethodDistribution";
// import { PaymentMethodTicketsTable } from "@/components/finance/PaymentMethodTicketsTable";
import { RevenueOverviewChart } from "@/components/finance/RevenueOverviewChart";

export function FinanceContent() {
  return (
    <div className="space-y-6">
      <FinanceMetricsCard />
      <RevenueOverviewChart />
      <PaymentMethodDistribution />
      {/* <PaymentMethodTicketsTable /> */}
    </div>
  );
}
