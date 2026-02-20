"use client";

import { useState } from "react";
import { MapPin, CalendarDays, Clock3 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import StatCard from "./StatCard";
import SalesByCategoryChart from "./SalesByCategoryChart";
import SalesTrendChart from "./SalesTrendChart";
import OrdersTable from "./OrdersTable";
import {
  salesStats,
  categoryData,
  salesTrendData,
  ordersData,
} from "@/data/sales";
import type { TeamMemberRow } from "@/types/sales";

type DetailsTab = "overview" | "target" | "commissions";

type TeamMemberDetailsViewProps = {
  member: TeamMemberRow;
};

export default function TeamMemberDetailsView({
  member,
}: TeamMemberDetailsViewProps) {
  const [activeTab, setActiveTab] = useState<DetailsTab>("overview");

  return (
    <div className="space-y-4">
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
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[240px_1fr]">
          <div className="rounded-xl border border-[#EAECF0] bg-white p-4">
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
                <p className="text-xs font-medium text-[#98A2B3]">
                  Date Joined
                </p>
                <div className="mt-1 flex items-start gap-2 text-xs text-[#667085]">
                  <CalendarDays className="mt-0.5 size-3.5 shrink-0" />
                  <span>{member.dateJoined ?? "-"}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-[#98A2B3]">
                  Last Active
                </p>
                <div className="mt-1 flex items-start gap-2 text-xs text-[#667085]">
                  <Clock3 className="mt-0.5 size-3.5 shrink-0" />
                  <span>{member.lastActive ?? "-"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {salesStats.map((stat, idx) => (
                <StatCard key={idx} stat={stat} />
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <SalesByCategoryChart data={categoryData} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[#EAECF0] bg-[#EEF2FF] p-4">
                  <p className="text-xs text-[#98A2B3]">
                    Monthly Target Progress
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-[#0B1E66]">
                    2.18M
                  </p>
                </div>
                <div className="rounded-xl border border-[#EAECF0] bg-[#EEF2FF] p-4">
                  <p className="text-xs text-[#98A2B3]">Quarterly Target</p>
                  <p className="mt-2 text-3xl font-semibold text-[#0B1E66]">
                    5.85M
                  </p>
                </div>
                <div className="rounded-xl border border-[#EAECF0] bg-[#EEF2FF] p-4">
                  <p className="text-xs text-[#98A2B3]">Bonus Opportunity</p>
                  <p className="mt-2 text-3xl font-semibold text-[#0B1E66]">
                    50k
                  </p>
                </div>
                <div className="rounded-xl border border-[#EAECF0] bg-[#EEF2FF] p-4">
                  <p className="text-xs text-[#98A2B3]">
                    Achievements & Badges
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-[#0B1E66]">
                    Quick Starter
                  </p>
                </div>
              </div>
            </div>

            <SalesTrendChart data={salesTrendData} />
            <OrdersTable orders={ordersData} />
          </div>
        </div>
      )}

      {activeTab !== "overview" && (
        <div className="rounded-xl bg-white p-8 text-center text-[#98A2B3]">
          {activeTab === "target" ? "Target" : "Commissions"} content coming
          soon
        </div>
      )}
    </div>
  );
}
