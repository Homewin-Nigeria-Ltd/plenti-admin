import SalesByCategoryChart from "@/components/sales/SalesByCategoryChart";
import { categoryData } from "@/data/sales";

function SalesTargetsPanel() {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <div className="rounded-xl bg-[#E8EEFF] h-fit p-4">
        <p className="text-xs text-[#98A2B3]">Monthly Target Progress</p>
        <p className="mt-1 text-[30px] font-semibold text-[#0B1E66]">2.18M</p>
        <div className="mt-2 flex items-center justify-between text-xs text-[#667085]">
          <span>87.2%</span>
          <span>2.50M</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-white/80">
          <div className="h-full w-[87%] rounded-full bg-[#0B1E66]" />
        </div>
      </div>

      <div className="rounded-xl bg-[#E8EEFF] h-fit p-4">
        <p className="text-xs text-[#98A2B3]">Quarterly Target</p>
        <p className="mt-1 text-[30px] font-semibold text-[#0B1E66]">5.85M</p>
        <div className="mt-2 flex items-center justify-between text-xs text-[#667085]">
          <span>83.6%</span>
          <span>7.00M</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-white/80">
          <div className="h-full w-[84%] rounded-full bg-[#0B1E66]" />
        </div>
      </div>

      <div className="rounded-xl bg-[#E8EEFF] h-fit p-4 lg:col-span-1">
        <p className="text-xs text-[#98A2B3]">Bonus Opportunity</p>
        <p className="mt-1 text-[30px] font-semibold text-[#0B1E66]">50k</p>
        <p className="mt-2 text-xs text-[#98A2B3]">
          Achieve ₦2.50M to earn ₦50k bonus!
        </p>
      </div>

      <div className="rounded-xl bg-[#E8EEFF] h-fit p-4 lg:col-span-1">
        <p className="text-xs text-[#98A2B3]">Achievements & Badges</p>
        <p className="mt-1 text-[30px] font-semibold text-[#0B1E66]">
          Quick Starter
        </p>
        <p className="mt-2 text-xs text-[#98A2B3]">Earned on 12th Jan 2025</p>
      </div>
    </div>
  );
}

export default function SalesCategoryHighlights() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <SalesByCategoryChart data={categoryData} />
      <SalesTargetsPanel />
    </div>
  );
}
