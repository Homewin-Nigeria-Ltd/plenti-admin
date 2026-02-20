"use client";

import { useState } from "react";
import Image from "next/image";
import TargetTable from "./TargetTable";
import OverviewTab from "./OverviewTab";
import { targetData } from "@/data/sales";
import { AssignTargetModal } from "./AssignTargetModal";

type TabType = "target" | "withdrawal" | "team" | "leaderboard" | "overview";

const tabs: { id: TabType; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "target", label: "Target" },
  { id: "withdrawal", label: "Withdrawal Requests" },
  { id: "team", label: "Team Members" },
  { id: "leaderboard", label: "Leader Board" },
];

export default function SalesContent() {
  const [activeTab, setActiveTab] = useState<TabType>("target");
  const [isAssignTargetModalOpen, setIsAssignTargetModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="flex items-center justify-between rounded-lg p-2">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
        {activeTab === "target" && <TargetTable targets={targetData} />}
        {activeTab === "withdrawal" && (
          <div className="bg-white rounded-xl p-8 text-center text-[#808080]">
            Withdrawal Requests content coming soon
          </div>
        )}
        {activeTab === "team" && (
          <div className="bg-white rounded-xl p-8 text-center text-[#808080]">
            Team Members content coming soon
          </div>
        )}
        {activeTab === "leaderboard" && (
          <div className="bg-white rounded-xl p-8 text-center text-[#808080]">
            Leader Board content coming soon
          </div>
        )}
        {activeTab === "overview" && <OverviewTab />}
      </div>

      <AssignTargetModal
        isOpen={isAssignTargetModalOpen}
        onClose={() => setIsAssignTargetModalOpen(false)}
      />
    </div>
  );
}
