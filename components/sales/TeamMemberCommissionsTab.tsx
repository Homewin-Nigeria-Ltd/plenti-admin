"use client";

import { useEffect, useMemo } from "react";
import DataTable from "@/components/common/DataTable";
import { useWithdrawalsStore } from "@/store/useWithdrawalsStore";
import { formatLargeAmount } from "@/lib/formatAmount";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function TeamMemberCommissionsTab({
  userId,
}: {
  userId?: number;
}) {
  const {
    withdrawals,
    loading,
    fetchWithdrawals,
    commissionStats,
    statsLoading,
    fetchCommissionStats,
  } = useWithdrawalsStore();

  useEffect(() => {
    if (typeof userId === "number") {
      void fetchCommissionStats(userId);
      void fetchWithdrawals(1, 10, userId);
    }
  }, [userId, fetchWithdrawals, fetchCommissionStats]);

  const commissionsSummaryData = useMemo(() => {
    if (!commissionStats) return commissionsSummary;

    const { stats } = commissionStats;
    return [
      {
        label: "Total Earned",
        amount: `₦${formatLargeAmount(stats.total_earned.amount)}`,
        trend: `${stats.total_earned.change_percent >= 0 ? "+" : ""}${stats.total_earned.change_percent}%`,
        trendType:
          stats.total_earned.change_percent >= 0
            ? ("up" as const)
            : ("down" as const),
      },
      {
        label: "Available Balance",
        amount: `₦${formatLargeAmount(stats.available_balance.amount)}`,
        trend: `${stats.available_balance.change_percent >= 0 ? "+" : ""}${stats.available_balance.change_percent}%`,
        trendType:
          stats.available_balance.change_percent >= 0
            ? ("up" as const)
            : ("down" as const),
      },
      {
        label: "Paid Out",
        amount: `₦${formatLargeAmount(stats.paid_out.amount)}`,
        trend: `${stats.paid_out.change_percent >= 0 ? "+" : ""}${stats.paid_out.change_percent}%`,
        trendType:
          stats.paid_out.change_percent >= 0
            ? ("up" as const)
            : ("down" as const),
      },
    ];
  }, [commissionStats]);

  const commissionRows = useMemo(
    () =>
      withdrawals.map((withdrawal) => {
        const dateStr = withdrawal.approved_at || withdrawal.rejected_at;
        const date = dateStr
          ? new Date(dateStr).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-";
        return {
          date,
          action: withdrawal.description,
          amount: `₦${formatLargeAmount(Number(withdrawal.amount))}`,
          balance: "-",
          status:
            withdrawal.status.charAt(0).toUpperCase() +
            withdrawal.status.slice(1),
          type:
            withdrawal.status === "approved" || withdrawal.status === "success"
              ? "Credit"
              : "Debit",
        };
      }),
    [withdrawals],
  );
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
        value={row.status}
        variant={
          row.status.toLowerCase() === "approved" ||
          row.status.toLowerCase() === "success"
            ? "success"
            : row.status.toLowerCase() === "rejected" ||
                row.status.toLowerCase() === "failed"
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

  const columns = [
    { key: "date", label: "Date", className: "min-w-[220px]" },
    { key: "actions", label: "Actions", className: "min-w-[260px]" },
    { key: "amount", label: "Amount", className: "min-w-[140px]" },
    { key: "balance", label: "Balance", className: "min-w-[160px]" },
    { key: "status", label: "Status", className: "min-w-[130px]" },
    { key: "type", label: "Status", className: "min-w-[120px]" },
  ];

  return (
    <div className="space-y-5">
      {statsLoading && !commissionStats ? (
        <div className="relative overflow-hidden rounded-xl bg-[#0B1E66] p-8">
          <div className="grid gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded bg-white/10" />
            ))}
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-xl bg-[#0B1E66] p-8">
          <div className="pointer-events-none absolute -right-10 -top-14 size-56 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute right-12 -top-8 size-40 rounded-full bg-white/10" />

          {commissionStats ? (
            <div className="grid gap-8 md:grid-cols-3">
              {commissionsSummaryData.map((item, index) => (
                <div
                  key={item.label}
                  className={`${
                    index < commissionsSummaryData.length - 1
                      ? "border-b border-white/20 pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-8"
                      : ""
                  }`}
                >
                  <p className="text-xl text-white/90">{item.label}</p>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <p className="text-3xl font-semibold leading-none text-white">
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
                      <span className="text-xs text-white/75">
                        vs last month
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-white/20 bg-white/5 p-6 text-center">
              <p className="text-sm text-white/75">
                Commission stats not available
              </p>
            </div>
          )}
        </div>
      )}

      {loading && withdrawals.length === 0 ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded" />
          ))}
        </div>
      ) : withdrawals.length === 0 ? (
        <div className="rounded-xl border border-[#EAECF0] bg-[#F9FAFB] p-12 text-center">
          <p className="text-sm text-[#667085]">No commission records found</p>
        </div>
      ) : (
        <DataTable columns={columns} rows={rows} />
      )}
    </div>
  );
}
