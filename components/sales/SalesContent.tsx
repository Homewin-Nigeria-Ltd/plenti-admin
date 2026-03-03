"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import TargetTable from "./TargetTable";
import OverviewTab from "./OverviewTab";
import LeaderboardTab from "./LeaderboardTab";
import { AssignTargetModal } from "./AssignTargetModal";
import WithdrawalRequestsTable from "./WithdrawalRequestsTable";
import TeamMembersTable from "./TeamMembersTable";
import { useTargetsStore } from "@/store/useTargetsStore";
import { Skeleton } from "@/components/ui/skeleton";

type TabType = "target" | "withdrawal" | "team" | "leaderboard" | "overview";

const tabs: { id: TabType; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "target", label: "Target" },
  { id: "withdrawal", label: "Withdrawal Requests" },
  { id: "team", label: "Team Members" },
  { id: "leaderboard", label: "Leader Board" },
];

export default function SalesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as TabType) || "overview";
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [isAssignTargetModalOpen, setIsAssignTargetModalOpen] = useState(false);
  const [targetsPage, setTargetsPage] = useState(1);
  const { targets, loading, error, pagination, fetchTargets } =
    useTargetsStore();

  useEffect(() => {
    setActiveTab(initialTab);
  }, [searchParams]);

  useEffect(() => {
    if (activeTab === "target") {
      void fetchTargets({ page: targetsPage, perPage: 15 });
    }
  }, [activeTab, targetsPage, fetchTargets]);

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="flex items-center justify-between rounded-lg p-2">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
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

        {activeTab === "target" && (
          <button
            onClick={() => setIsAssignTargetModalOpen(true)}
            className="flex items-center gap-2 bg-[#0B1E66] text-white px-4 py-2.5 rounded-md hover:bg-[#0B1E66]/90 transition-colors"
          >
            <Image
              src="/icons/sales/plus-icon.svg"
              alt="add"
              width={16}
              height={16}
              className="brightness-0 invert"
            />
            <span className="text-md font-medium">Assign Target</span>
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "target" &&
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
              <p className="text-sm text-[#667085]">No targets available</p>
            </div>
          ) : (
            <TargetTable
              targets={targets}
              page={pagination?.current_page ?? targetsPage}
              pageSize={pagination?.per_page ?? 15}
              total={pagination?.total ?? targets.length}
              pageCount={pagination?.last_page ?? 1}
              onPageChange={setTargetsPage}
            />
          ))}
        {activeTab === "withdrawal" && <WithdrawalRequestsTable />}
        {activeTab === "team" && <TeamMembersTable />}
        {activeTab === "leaderboard" && <LeaderboardTab />}
        {activeTab === "overview" && <OverviewTab />}
      </div>

      <AssignTargetModal
        isOpen={isAssignTargetModalOpen}
        onClose={() => setIsAssignTargetModalOpen(false)}
      />
    </div>
  );
}
