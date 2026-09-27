import SalesTrendChart from "@/components/sales/SalesTrendChart";
import { salesTrendData } from "@/data/sales";
import SalesCategoryHighlights from "@/components/dashboard/sales/SalesCategoryHighlights";
import SalesOrdersTable from "@/components/dashboard/sales/SalesOrdersTable";
import SalesOverviewStats from "@/components/dashboard/sales/SalesOverviewStats";

const SalesDashboard = () => {
  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <SalesOverviewStats />
      <SalesCategoryHighlights />
      <SalesTrendChart data={salesTrendData} />
      <SalesOrdersTable />
    </div>
  );
};

export default SalesDashboard;
