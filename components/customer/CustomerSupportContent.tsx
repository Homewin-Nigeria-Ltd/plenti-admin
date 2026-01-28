"use client";

import * as React from "react";
import TicketStatCard from "./TicketStatCard";
import TicketNotificationBanner from "./TicketNotificationBanner";
import TicketResolutionResponseRate from "./TicketResolutionResponseRate";
import TicketByCategory from "./TicketByCategory";
import MostRecentTickets from "./MostRecentTickets";
import { CreateTicketModal } from "./CreateTicketModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CustomerSupportContent() {
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] =
    React.useState(false);
  const stats = [
    {
      title: "Total Open Ticket",
      value: 45823,
      changePercent: 40,
      increased: true,
      isHighlighted: false,
    },
    {
      title: "Total New Ticket",
      value: 458,
      changePercent: 40,
      increased: true,
      isHighlighted: false,
    },
    {
      title: "Total Resolved Ticket",
      value: 4598,
      changePercent: 40,
      increased: true,
      isHighlighted: false,
    },
    {
      title: "Avg Response Time",
      value: "2.5 hours",
      changePercent: 40,
      increased: false, // Red badge for increase in response time (bad)
      isHighlighted: false,
    },
    {
      title: "CSAT Score",
      value: "5.0/5.0",
      changePercent: 40,
      increased: true,
      isHighlighted: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Notification Banner and Create Ticket Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 w-full">
          <TicketNotificationBanner
            ticketNumber="FAB-23012024-00091"
            timeRemaining="expires in an hour"
            onView={() => {
              // Handle view ticket
              console.log("View ticket");
            }}
          />
        </div>
        <Button
          onClick={() => setIsCreateTicketModalOpen(true)}
          className="bg-[#1F3A78] hover:bg-[#1F3A78]/90 text-white h-[48px] px-6"
        >
          <Plus className="w-5 h-5" />
          Create Ticket
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <TicketStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            changePercent={stat.changePercent}
            increased={stat.increased}
            isHighlighted={stat.isHighlighted}
          />
        ))}
      </div>

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
