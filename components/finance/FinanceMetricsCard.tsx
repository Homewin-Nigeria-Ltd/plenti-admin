export function FinanceMetricsCard() {
  return (
    <div className="rounded-[12px] bg-[#0B1E66] text-white p-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap">
        <div className="space-y-2 pr-2">
          <p className="text-white text-[14px]">Total Revenue</p>
          <div className="flex items-center justify-between">
            <p className="text-[48px] font-semibold">15.1B</p>
            <div className="flex items-end flex-col gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs">
                ↑ 5%
              </span>
              <span className="text-white/70 text-[10px]">vs last month</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 md:border-l md:border-white/20 md:pl-3 pr-2">
          <p className="text-white text-[14px]">Today&apos;s Revenue</p>
          <div className="flex items-center justify-between">
            <p className="text-[48px] font-semibold">100M</p>
            <div className="flex items-end flex-col gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs">
                ↑ 5%
              </span>
              <span className="text-white/70 text-[10px]">vs last month</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 md:border-l  md:border-white/20 md:pl-3">
          <p className="text-white/80">Pending Refunds</p>
          <p className="text-[48px] font-semibold">47,800</p>
          <div className="flex items-end flex-col gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs">
              ↑ 5%
            </span>
            <span className="text-white/70 text-[10px]">vs last month</span>
          </div>
        </div>

        <div className="space-y-2 md:border-l md:border-white/20 md:pl-3">
          <p className="text-white/80">Total Transactions</p>
          <p className="text-[48px] font-semibold">10,234</p>
          <div className="flex items-end flex-col gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-xs">
              ↓ 5%
            </span>
            <span className="text-white/70 text-[10px]">vs last month</span>
          </div>
        </div>

        <div className="space-y-2 md:border-l md:border-white/20 md:pl-3">
          <p className="text-white/80">Average Order Value</p>
          <p className="text-[48px] font-semibold">₦23,500</p>
          <div className="flex items-end flex-col gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs">
              ↑ 5%
            </span>
            <span className="text-white/70 text-[10px]">vs last month</span>
          </div>
        </div>
      </div>
    </div>
  );
}
