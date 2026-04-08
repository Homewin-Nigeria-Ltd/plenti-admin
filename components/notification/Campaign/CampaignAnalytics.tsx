// components/CampaignAnalytics.tsx
"use client";

import { useNotificationsStore } from "@/store/useNotificationsStore";
import React, { useEffect } from "react";

const CampaignAnalytics: React.FC = () => {
  const { campaigns, getCampaigns } = useNotificationsStore();
  //   {
  //     id: "1",
  //     name: "March Ramadan Deals",
  //     status: "Sent",
  //     channel: "Email",
  //     audience: "All Users",
  //     date: "2026-03-01 09:00",
  //     template: "Weekly Promo Blast",
  //     stats: {
  //       recipients: 12500,
  //       delivered: { count: 11890, percentage: 95 },
  //       opened: { count: 4230, percentage: 36 },
  //       clicked: { count: 1102, percentage: 26 },
  //       failed: 610,
  //     },
  //   },
  //   {
  //     id: "2",
  //     name: "Premium Buyer Appreciation",
  //     status: "Sent",
  //     channel: "Email",
  //     audience: "Premium Users",
  //     date: "2026-03-01 09:00",
  //     template: "Weekly Promo Blast",
  //     stats: {
  //       recipients: 12500,
  //       delivered: { count: 11890, percentage: 95 },
  //       opened: { count: 4230, percentage: 36 },
  //       clicked: { count: 1102, percentage: 26 },
  //       failed: 610,
  //     },
  //   },
  //   {
  //     id: "3",
  //     name: "Inactive User Re-engagement",
  //     status: "Scheduled",
  //     channel: "Email",
  //     audience: "Premium Users",
  //     date: "2026-03-20 08:00",
  //     template: "Weekly Promo Blast",
  //     stats: {
  //       recipients: 12500,
  //       delivered: { count: 11890, percentage: 95 },
  //       opened: { count: 4230, percentage: 36 },
  //       clicked: { count: 1102, percentage: 26 },
  //       failed: 610,
  //     },
  //   },
  //   {
  //     id: "4",
  //     name: "Inactive User Re-engagement",
  //     status: "Scheduled",
  //     channel: "Email",
  //     audience: "Premium Users",
  //     date: "2026-03-20 08:00",
  //     template: "Weekly Promo Blast",
  //     stats: {
  //       recipients: 12500,
  //       delivered: { count: 11890, percentage: 95 },
  //       opened: { count: 4230, percentage: 36 },
  //       clicked: { count: 1102, percentage: 26 },
  //       failed: 610,
  //     },
  //   },
  // ];

  useEffect(() => {
    if (campaigns === null) {
      getCampaigns();
    }
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Sent":
        return "bg-[#ECFDF3] text-[#027A48]";
      case "Scheduled":
        return "bg-yellow-100 text-yellow-700";
      case "Draft":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-full p-6 space-y-6 overflow-y-auto">
      {campaigns &&
        campaigns.length > 0 &&
        campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-blue-950">
                    {campaign?.name || ""}
                  </h3>
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-medium ${getStatusStyle(
                      campaign.status,
                    )}`}
                  >
                    {campaign?.status || ""}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                  <span className="capitalize px-2 py-0.5 bg-[#FEFEEB] text-[#ADA605] rounded-[16px] text-xs font-medium">
                    {campaign.channel}
                  </span>
                  <div className="flex items-center gap-1.5 capitalize">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {campaign.target_audience}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {campaign.scheduled_at}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    {(campaign.template && campaign.template.name) || ""}
                  </div>
                </div>
              </div>

              <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-5 gap-4">
              {/* Recipients */}
              <div className="bg-[#F9FAFB] rounded-lg p-4 text-center">
                <span className="text-xl font-bold text-black">
                  {/* {formatNumber(campaign.stats.recipients)} */}0
                </span>
                <p className="text-sm text-[#98A2B3] mt-1">Recipients</p>
              </div>

              {/* Delivered */}
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <span className="text-xl font-bold text-[#0F973D]">
                  {formatNumber(campaign.delivered_count)}
                </span>
                <p className="text-sm text-[#98A2B3] mt-1">
                  Delivered ({campaign.delivery_rate}%)
                </p>
              </div>

              {/* Opened */}
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <span className="text-xl font-bold text-[#F3A218]">
                  {formatNumber(campaign.opened_count)}
                </span>
                <p className="text-sm text-[#98A2B3] mt-1">
                  Opened ({campaign.open_rate}%)
                </p>
              </div>

              {/* Clicked */}
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <span className="text-xl font-bold text-[#0B1E66]">
                  {formatNumber(campaign.clicked_count)}
                </span>
                <p className="text-sm text-[#98A2B3] mt-1">
                  Clicked ({campaign.click_rate}%)
                </p>
              </div>

              {/* Failed */}
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <span className="text-xl font-bold text-[#D42620]">
                  {formatNumber(campaign.failed_count)}
                </span>
                <p className="text-sm text-[#98A2B3] mt-1">Failed</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default CampaignAnalytics;
