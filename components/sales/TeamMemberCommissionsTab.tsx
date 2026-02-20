import DataTable from "@/components/common/DataTable";

const commissionsSummary = [
  {
    label: "Total Earned",
    amount: "₦245,500",
    trend: "+5%",
    trendType: "up" as const,
  },
  {
    label: "Available Balance",
    amount: "₦120,000",
    trend: "+5%",
    trendType: "up" as const,
  },
  {
    label: "Paid Out",
    amount: "₦125,500",
    trend: "-5%",
    trendType: "down" as const,
  },
];

const commissionRows = [
  {
    date: "Apr 12, 2023 | 09:32AM",
    action: "Sales Target Incentives",
    amount: "NGN 300",
    balance: "NGN 1,200.00",
    transactionStatus: "Successful",
    type: "Credit",
  },
  {
    date: "Apr 12, 2023 | 09:32AM",
    action: "Commercial Withdrawal",
    amount: "NGN 900",
    balance: "NGN 900.00",
    transactionStatus: "Cancelled",
    type: "Debit",
  },
  {
    date: "Apr 12, 2023 | 09:32AM",
    action: "Commercial Incentives",
    amount: "NGN 300",
    balance: "NGN 900",
    transactionStatus: "Successful",
    type: "Debit",
  },
  {
    date: "Apr 12, 2023 | 09:32AM",
    action: "Commercial Withdrawal",
    amount: "NGN 300",
    balance: "NGN 600",
    transactionStatus: "Successful",
    type: "Debit",
  },
  {
    date: "Apr 12, 2023 | 09:32AM",
    action: "Commercial Incentives",
    amount: "NGN 300",
    balance: "NGN 33,900.00",
    transactionStatus: "Successful",
    type: "Credit",
  },
  {
    date: "Apr 12, 2023 | 09:32AM",
    action: "Commercial Withdrawal",
    amount: "NGN 300",
    balance: "NGN 33,300.00",
    transactionStatus: "Inactive",
    type: "Debit",
  },
];

function CommissionPill({
  value,
  variant,
}: {
  value: string;
  variant: "success" | "error" | "muted";
}) {
  const styles =
    variant === "success"
      ? "bg-[#E7F6EC] text-[#027A48]"
      : variant === "error"
      ? "bg-[#FEECEF] text-[#F04438]"
      : "bg-[#F2F4F7] text-[#98A2B3]";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${styles}`}
    >
      {value}
    </span>
  );
}

export default function TeamMemberCommissionsTab() {
  const columns = [
    { key: "date", label: "Date", className: "min-w-[220px]" },
    { key: "actions", label: "Actions", className: "min-w-[260px]" },
    { key: "amount", label: "Amount", className: "min-w-[140px]" },
    { key: "balance", label: "Balance", className: "min-w-[160px]" },
    { key: "status", label: "Status", className: "min-w-[130px]" },
    { key: "type", label: "Status", className: "min-w-[120px]" },
  ];

  const rows = commissionRows.map((row) => ({
    date: (
      <span className="text-[14px] font-medium text-[#475467]">{row.date}</span>
    ),
    actions: (
      <span className="text-[14px] font-semibold text-[#344054]">
        {row.action}
      </span>
    ),
    amount: (
      <span className="text-[14px] font-semibold text-[#344054]">
        {row.amount}
      </span>
    ),
    balance: (
      <span className="text-[14px] font-semibold text-[#344054]">
        {row.balance}
      </span>
    ),
    status: (
      <CommissionPill
        value={row.transactionStatus}
        variant={
          row.transactionStatus === "Successful"
            ? "success"
            : row.transactionStatus === "Cancelled"
            ? "error"
            : "muted"
        }
      />
    ),
    type: (
      <CommissionPill
        value={row.type}
        variant={row.type === "Credit" ? "success" : "error"}
      />
    ),
  }));

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-xl bg-[#0B1E66] p-8">
        <div className="pointer-events-none absolute -right-10 -top-14 size-56 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute right-12 -top-8 size-40 rounded-full bg-white/10" />

        <div className="grid gap-8 md:grid-cols-3">
          {commissionsSummary.map((item, index) => (
            <div
              key={item.label}
              className={`${
                index < commissionsSummary.length - 1
                  ? "border-b border-white/20 pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-8"
                  : ""
              }`}
            >
              <p className="text-2xl text-white/90">{item.label}</p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <p className="text-5xl font-semibold leading-none text-white">
                  {item.amount}
                </p>
                <div className="flex flex-col items-end gap-1 pb-1">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold ${
                      item.trendType === "up"
                        ? "bg-[#D9F2E4] text-[#027A48]"
                        : "bg-[#FEECEF] text-[#F04438]"
                    }`}
                  >
                    {item.trend}
                  </span>
                  <span className="text-xs text-white/75">vs last month</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DataTable columns={columns} rows={rows} />
    </div>
  );
}
