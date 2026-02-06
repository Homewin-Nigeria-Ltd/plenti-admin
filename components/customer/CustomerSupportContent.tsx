"use client";

import * as React from "react";
import TicketStatCard from "./TicketStatCard";
// import TicketNotificationBanner from "./TicketNotificationBanner"; // commented out for now
import TicketResolutionResponseRate from "./TicketResolutionResponseRate";
import TicketByCategory from "./TicketByCategory";
import MostRecentTickets from "./MostRecentTickets";
import { CreateTicketModal } from "./CreateTicketModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSupportStore } from "@/store/useSupportStore";

export default function CustomerSupportContent() {
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] =
    React.useState(false);

  const {
    statistics,
    loadingStatistics,
    statisticsError,
    fetchSupportStatistics,
  } = useSupportStore();

  React.useEffect(() => {
    fetchSupportStatistics();
  }, [fetchSupportStatistics]);

  const stats = React.useMemo(() => {
    if (!statistics) return null;
    const avgHours = statistics.avg_resolution_time_hours;
    const formatHours =
      avgHours < 0 || !Number.isFinite(avgHours)
        ? "—"
        : `${Math.max(0, avgHours).toFixed(1)} hrs`;
    return [
      {
        title: "Total Open Tickets",
        value: statistics.open_tickets,
        changePercent: 0,
        increased: true,
        isHighlighted: false,
      },
      {
        title: "In Progress",
        value: statistics.in_progress_tickets,
        changePercent: 0,
        increased: true,
        isHighlighted: false,
      },
      {
        title: "Total Resolved",
        value: statistics.resolved_tickets + statistics.closed_tickets,
        changePercent: 0,
        increased: true,
        isHighlighted: false,
      },
      {
        title: "Avg Resolution Time",
        value: formatHours,
        changePercent: 0,
        increased: avgHours >= 0 && avgHours <= 24,
        isHighlighted: false,
      },
      {
        title: "CSAT Score",
        value: Number.isFinite(statistics.avg_satisfaction_rating)
          ? `${statistics.avg_satisfaction_rating.toFixed(1)}/5.0`
          : "—",
        changePercent: 0,
        increased: true,
        isHighlighted: false,
      },
    ];
  }, [statistics]);

  return (
    <div className="space-y-6">
      {/* Notification Banner and Create Ticket Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-end gap-4">
        {/* Ticket notification banner commented out for now
        <div className="flex-1 w-full">
          <TicketNotificationBanner
            ticketNumber="FAB-23012024-00091"
            timeRemaining="expires in an hour"
            onView={() => {
              console.log("View ticket");
            }}
          />
        </div>
        */}
        <Button
          onClick={() => setIsCreateTicketModalOpen(true)}
          className="bg-[#1F3A78] hover:bg-[#1F3A78]/90 text-white h-[48px] px-6"
        >
          <Plus className="w-5 h-5" />
          Create Ticket
        </Button>
      </div>

      {/* Stats Cards */}
      {loadingStatistics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-[#D9D9D9] p-5 h-[140px] animate-pulse"
            >
              <div className="h-4 bg-[#EEF1F6] rounded w-2/3 mb-3" />
              <div className="h-8 bg-[#EEF1F6] rounded w-1/2 mb-4" />
              <div className="h-6 bg-[#EEF1F6] rounded-full w-24" />
            </div>
          ))}
        </div>
      ) : statisticsError ? (
        <p className="text-[#D42620] text-sm py-2">{statisticsError}</p>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <TicketStatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              changePercent={stat.changePercent}
              increased={stat.increased}
              isHighlighted={stat.isHighlighted}
              showChange={false}
            />
          ))}
        </div>
      ) : null}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TicketResolutionResponseRate />
        <TicketByCategory />
      </div>

      {/* Most Recent Tickets Table */}
      <MostRecentTickets />

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateTicketModalOpen}
        onClose={() => setIsCreateTicketModalOpen(false)}
      />
    </div>
  );
}
