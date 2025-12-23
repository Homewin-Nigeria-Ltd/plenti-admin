export const metadata = {
  title: "Finance Management | Plenti Admin",
};

import { FinanceTabs } from "@/components/finance/FinanceTabs";
import { FinanceMetricsCard } from "@/components/finance/FinanceMetricsCard";
import { RevenueOverviewChart } from "@/components/finance/RevenueOverviewChart";
import { PaymentMethodDistribution } from "@/components/finance/PaymentMethodDistribution";
import { NewRefundRequestButton } from "@/components/finance/NewRefundRequestButton";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <FinanceTabs />
        <NewRefundRequestButton />
      </div>

      <FinanceMetricsCard />
      <RevenueOverviewChart />

      <PaymentMethodDistribution />

      <div className="border border-[#F0F2F5] rounded-[8px] h-[38px] flex items-center gap-1 p-1 px-4 shadow-sm">
        <Image src={"/icons/search.png"} alt="Search" width={20} height={20} />
        <Input
          className="w-full placeholder:text-[#253B4B] border-0 outline-none focus-visible:ring-0 shadow-none"
          placeholder="Search"
        />
      </div>
    </div>
  );
}
