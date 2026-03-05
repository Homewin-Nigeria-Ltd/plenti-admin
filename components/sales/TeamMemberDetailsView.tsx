"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, CalendarDays, Clock3, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import StatCard from "./StatCard";
import SalesByCategoryChart from "./SalesByCategoryChart";
import SalesTrendChart from "./SalesTrendChart";
import OrdersTable from "./OrdersTable";
import TeamMemberCommissionsTab from "./TeamMemberCommissionsTab";
import TargetTable from "./TargetTable";
import { salesStats, categoryData, salesTrendData } from "@/data/sales";
import type { TeamMemberRow } from "@/types/sales";
import { useRouter } from "next/navigation";
import { useTeamMembersStore } from "@/store/useTeamMembersStore";
import { formatLargeAmount } from "@/lib/formatAmount";
import { useSalesTransactionsStore } from "@/store/useSalesTransactionsStore";
import { Skeleton } from "@/components/ui/skeleton";
import { useTargetsStore } from "@/store/useTargetsStore";

type DetailsTab = "overview" | "target" | "commissions";

type TeamMemberDetailsViewProps = {
  member: TeamMemberRow;
  memberDetail?: any;
};

export default function TeamMemberDetailsView({
  member,
  memberDetail,
}: TeamMemberDetailsViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DetailsTab>("overview");
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [targetsPage, setTargetsPage] = useState(1);
  const transactionsPerPage = 10;
  const { clearMemberDetail } = useTeamMembersStore();
  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
    pagination,
    fetchTransactions,
  } = useSalesTransactionsStore();
  const {
    targets,
    loading: targetsLoading,
    error: targetsError,
    pagination: targetsPagination,
    fetchTargets,
  } = useTargetsStore();

  const handleGoBack = () => {
    clearMemberDetail();
    router.back();
  };

  useEffect(() => {
    const userId = memberDetail?.user?.id;
    if (typeof userId === "number") {
      void fetchTransactions(transactionsPage, transactionsPerPage, "", userId);
    }
  }, [
    memberDetail?.user?.id,
    transactionsPage,
    transactionsPerPage,
    fetchTransactions,
  ]);

  useEffect(() => {
    const userId = memberDetail?.user?.id;
    if (activeTab === "target" && typeof userId === "number") {
      void fetchTargets({ page: targetsPage, perPage: 15, userId });
    }
  }, [activeTab, memberDetail?.user?.id, targetsPage, fetchTargets]);

  // Transform real API data
  const memberStats = memberDetail
    ? [
        {
          title: "Total Sales",
          value: `₦${formatLargeAmount(Number(memberDetail.user.amount_spent))}`,
          change: "+0%",
          isPositive: true,
          subtitle: `${memberDetail.user.total_orders} Orders`,
          changeColor: "green" as const,
        },
        {
          title: "Active Targets",
          value: memberDetail.summary.active_targets.toString(),
          change: "+0%",
          isPositive: true,
          subtitle: `${memberDetail.summary.total_achieved} Achieved`,
          changeColor: "green" as const,
        },
        {
          title: "Achievement %",
          value: `${memberDetail.summary.achievement_pct}%`,
          change: "+0%",
          isPositive: true,
          subtitle: "Overall",
          changeColor: "green" as const,
        },
        {
          title: "Withdrawals",
          value: memberDetail.summary.total_withdrawals.toString(),
          change: "+0%",
          isPositive: true,
          subtitle: `₦${formatLargeAmount(memberDetail.summary.approved_withdrawals_amount)} approved`,
          changeColor: "green" as const,
        },
      ]
    : salesStats;

  const categoryChartData = memberDetail
    ? memberDetail.sales_by_category.slice(0, 6).map((cat: any, i: number) => ({
        name: cat.category,
        value: cat.amount,
        percentage: cat.percent,
        color: [
          "#FFA500",
          "#0B1E66",
          "#28A745",
          "#D3E9FE",
          "#FF392B",
          "#FFA000",
        ][i % 6],
      }))
    : categoryData;

  const trendChartData = memberDetail
    ? memberDetail.sales_trend.data.map((item: any) => ({
        label: item.label,
        value: item.revenue,
      }))
    : salesTrendData;

  const orderRows = useMemo(
    () =>
      transactions.map((transaction) => ({
        date: new Date(transaction.created_at).toLocaleString(),
        orderId: transaction.order_number,
        customerName: transaction.user?.name ?? "-",
        customerEmail: transaction.user?.email ?? "",
        customerInitial: (transaction.user?.name ?? "-")
          .split(" ")
          .map((part) => part[0] ?? "")
          .join("")
          .toUpperCase()
          .slice(0, 2),
        salesValue: `₦${formatLargeAmount(Number(transaction.total ?? 0))}`,
        commission: "-",
        status:
          transaction.payment_status?.toLowerCase() === "paid"
            ? ("Paid" as const)
            : ("Processing" as const),
      })),
    [transactions],
  );

  console.log("Rendering TeamMemberDetailsView for member:", member);

  return (
    <div className="space-y-4">
      <ArrowLeft onClick={handleGoBack} className="cursor-pointer" />

      <div className="grid grid-cols-5 gap-4">
        <div className="rounded-xl bg-white p-4 col-span-1">
          <div className="flex flex-col items-center text-center">
            <Avatar className="size-20">
              <AvatarFallback className="bg-[#0B1E66] text-lg font-semibold text-white">
                {member.initial}
              </AvatarFallback>
            </Avatar>
            <p className="mt-3 text-sm font-semibold text-[#101928]">
              {member.name}
            </p>
            <p className="text-xs text-[#98A2B3]">{member.email}</p>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs font-medium text-[#98A2B3]">Location</p>
              <div className="mt-1 flex items-start gap-2 text-xs text-[#667085]">
                <MapPin className="mt-0.5 size-3.5 shrink-0" />
                <span>{member.location ?? "-"}</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-[#98A2B3]">Date Joined</p>
              <div className="mt-1 flex items-start gap-2 text-xs text-[#667085]">
                <CalendarDays className="mt-0.5 size-3.5 shrink-0" />
                <span>
                  {member.dateJoined
                    ? new Date(member.dateJoined).toLocaleDateString()
                    : "-"}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-[#98A2B3]">Last Active</p>
              <div className="mt-1 flex items-start gap-2 text-xs text-[#667085]">
                <Clock3 className="mt-0.5 size-3.5 shrink-0" />
                <span>
                  {member.lastActive
                    ? new Date(member.lastActive).toLocaleDateString()
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 col-span-4 gap-4">
          {memberStats.map((stat, idx) => (
            <StatCard key={idx} stat={stat} />
          ))}
        </div>
      </div>

      {/* Tabs  */}
      <div className="flex items-center gap-6 border-b border-[#EAECF0] pb-2">
        {(
          [
            { id: "overview", label: "Overview" },
            { id: "target", label: "Target" },
            { id: "commissions", label: "Commissions" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 text-sm font-medium ${
              activeTab === tab.id
                ? "border-b-2 border-[#0B1E66] text-[#0B1E66]"
                : "text-[#98A2B3]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <SalesByCategoryChart data={categoryChartData} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[#EAECF0] bg-[#EEF2FF] p-4">
                  <p className="text-xs text-[#98A2B3]">
                    Monthly Target Progress
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-[#0B1E66]">
                    {memberDetail
                      ? `${memberDetail.summary.total_achieved}/${memberDetail.summary.total_target}`
                      : "2.18M"}
                  </p>
                </div>
                <div className="rounded-xl border border-[#EAECF0] bg-[#EEF2FF] p-4">
                  <p className="text-xs text-[#98A2B3]">Active Targets</p>
                  <p className="mt-2 text-3xl font-semibold text-[#0B1E66]">
                    {memberDetail ? memberDetail.summary.active_targets : "0"}
                  </p>
                </div>
                <div className="rounded-xl border border-[#EAECF0] bg-[#EEF2FF] p-4">
                  <p className="text-xs text-[#98A2B3]">Total Withdrawals</p>
                  <p className="mt-2 text-3xl font-semibold text-[#0B1E66]">
                    {memberDetail
                      ? memberDetail.summary.total_withdrawals
                      : "0"}
                  </p>
                </div>
                <div className="rounded-xl border border-[#EAECF0] bg-[#EEF2FF] p-4">
                  <p className="text-xs text-[#98A2B3]">Pending Withdrawals</p>
                  <p className="mt-2 text-3xl font-semibold text-[#0B1E66]">
                    ₦
                    {memberDetail
                      ? formatLargeAmount(
                          memberDetail.summary.pending_withdrawals_amount,
                        )
                      : "0"}
                  </p>
                </div>
              </div>
            </div>

            <SalesTrendChart
              data={trendChartData}
              userId={memberDetail?.user?.id}
            />
            {transactionsLoading && orderRows.length === 0 ? (
              <div className="rounded-xl border border-[#EAECF0] bg-[#F9FAFB] p-6">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-44" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            ) : transactionsError ? (
              <div className="rounded-xl border border-[#EAECF0] bg-[#F9FAFB] p-6 text-center">
                <p className="text-sm text-[#D42620]">{transactionsError}</p>
              </div>
            ) : orderRows.length === 0 ? (
              <div className="rounded-xl border border-[#EAECF0] bg-[#F9FAFB] p-6 text-center">
                <p className="text-sm text-[#667085]">
                  No transactions found for this user.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <OrdersTable orders={orderRows} />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#667085]">
                    Page {pagination?.current_page ?? transactionsPage} of{" "}
                    {pagination?.last_page ?? 1}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setTransactionsPage((page) => Math.max(1, page - 1))
                      }
                      disabled={
                        (pagination?.current_page ?? transactionsPage) <= 1 ||
                        transactionsLoading
                      }
                      className="rounded-md border border-[#EAECF0] px-3 py-1 text-sm text-[#0B1E66] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setTransactionsPage((page) => {
                          const lastPage = pagination?.last_page ?? page;
                          return Math.min(lastPage, page + 1);
                        })
                      }
                      disabled={
                        (pagination?.current_page ?? transactionsPage) >=
                          (pagination?.last_page ?? transactionsPage) ||
                        transactionsLoading
                      }
                      className="rounded-md border border-[#EAECF0] px-3 py-1 text-sm text-[#0B1E66] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "target" && (
        <div>
          {targetsLoading && targets.length === 0 ? (
            <div className="space-y-3 rounded-xl border border-[#EAECF0] bg-[#F9FAFB] p-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : targetsError ? (
            <div className="rounded-xl border border-[#EAECF0] bg-[#F9FAFB] p-12 text-center">
              <p className="text-sm text-[#D42620]">{targetsError}</p>
            </div>
          ) : targets.length === 0 ? (
            <div className="rounded-xl border border-[#EAECF0] bg-[#F9FAFB] p-12 text-center">
              <p className="text-sm text-[#667085]">No targets available</p>
            </div>
          ) : (
            <TargetTable
              targets={targets}
              page={targetsPagination?.current_page ?? targetsPage}
              pageSize={targetsPagination?.per_page ?? 15}
              total={targetsPagination?.total ?? targets.length}
              pageCount={targetsPagination?.last_page ?? 1}
              onPageChange={setTargetsPage}
            />
          )}
        </div>
      )}

      {activeTab === "commissions" && (
        <TeamMemberCommissionsTab userId={memberDetail?.user?.id} />
      )}
    </div>
  );
}
