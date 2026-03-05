"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import TargetTable from "./TargetTable";
import OverviewTab from "./OverviewTab";
import LeaderboardTab from "./LeaderboardTab";
import MyCommissionsTab from "./MyCommissionsTab";
import { RequestWithdrawalModal } from "./RequestWithdrawalModal";
import { Skeleton } from "@/components/ui/skeleton";
import { PAGE_SIZE } from "@/lib/constant";
import { getSalesPermissions } from "@/lib/modulePermissions";
import { useAccountStore } from "@/store/useAccountStore";
import { useTargetsStore } from "@/store/useTargetsStore";

type TabType = "targets" | "commission";

const tabs: { id: TabType; label: string }[] = [
  { id: "targets", label: "Targets" },
  { id: "commission", label: "Commission" },
];

export default function SalesRepContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const account = useAccountStore((state) => state.account);
  const initialTab = (searchParams.get("tab") as TabType) || "targets";
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [targetsPage, setTargetsPage] = useState(1);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const { targets, loading, error, pagination, fetchTargets } =
    useTargetsStore();
  const { canViewTargets, canViewCommissions, canRequestWithdrawal } =
    getSalesPermissions(account);

  const allowedTabs = tabs.filter((tab) => {
    if (tab.id === "targets") return canViewTargets;
    if (tab.id === "commission") return canViewCommissions;
    return false;
  });

  useEffect(() => {
    const nextTab = allowedTabs.some((tab) => tab.id === initialTab)
      ? initialTab
      : allowedTabs[0]?.id;

    if (nextTab) {
      setActiveTab(nextTab);
    }
  }, [searchParams, initialTab, allowedTabs]);

  useEffect(() => {
    if (activeTab === "targets") {
      void fetchTargets({ page: targetsPage, perPage: 15 });
    }
  }, [activeTab, targetsPage, fetchTargets]);

  return (
    <div className="space-y-6">
      {allowedTabs.length === 0 ? (
        <div className="rounded-xl border border-[#EAECF0] bg-[#F9FAFB] p-12 text-center">
          <p className="text-sm text-[#667085]">
            You do not have permission to view this section.
          </p>
        </div>
      ) : (
        <>
          {/* Tabs Navigation */}
          <div className="flex items-center justify-between rounded-lg p-2">
            <div className="flex items-center gap-2">
              {allowedTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    router.replace(`?tab=${tab.id}`);
                  }}
                  className={`px-4 py-2 text-base font-medium rounded-[3px] transition-colors ${
                    activeTab === tab.id
                      ? "text-[#0B1E66] bg-[#E8EEFF]"
                      : "text-[#808080] hover:text-[#0B1E66]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "commission" && canRequestWithdrawal && (
              <button
                onClick={() => setIsWithdrawalModalOpen(true)}
                className="flex items-center gap-2 bg-[#0B1E66] text-white px-4 py-2.5 rounded-md hover:bg-[#0B1E66]/90 transition-colors"
              >
                <span className="text-lg">+</span>
                <span className="text-md font-medium">Request Withdrawal</span>
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "targets" &&
              (loading && targets.length === 0 ? (
                <div className="space-y-3 rounded-xl border border-[#EAECF0] bg-[#F9FAFB] p-6">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : error ? (
                <div className="rounded-xl border border-[#EAECF0] bg-[#F9FAFB] p-12 text-center">
                  <p className="text-sm text-[#D42620]">{error}</p>
                </div>
              ) : targets.length === 0 ? (
                <div className="rounded-xl border border-[#EAECF0] bg-[#F9FAFB] p-12 text-center">
                  <p className="text-sm text-[#667085]">
                    No targets assigned yet
                  </p>
                </div>
              ) : (
                <TargetTable
                  targets={targets}
                  page={pagination?.current_page ?? targetsPage}
                  pageSize={PAGE_SIZE}
                  total={pagination?.total ?? targets.length}
                  pageCount={pagination?.last_page ?? 1}
                  onPageChange={setTargetsPage}
                />
              ))}
            {activeTab === "commission" && <MyCommissionsTab />}
          </div>

          <RequestWithdrawalModal
            isOpen={isWithdrawalModalOpen}
            onClose={() => setIsWithdrawalModalOpen(false)}
            availableBalance={120000}
          />
        </>
      )}
    </div>
  );
}
