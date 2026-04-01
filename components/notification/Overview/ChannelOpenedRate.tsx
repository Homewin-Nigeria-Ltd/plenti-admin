"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface Channel {
  name: string;
  percentage: number;
  opened: number;
  sent: string;
  color: string;
  bgColor: string;
}

const ChannelOpenedRate: React.FC = () => {
  const channels: Channel[] = [
    {
      name: "Email",
      percentage: 28,
      opened: 28,
      sent: "84,900",
      color: "#16a34a", // green-600
      bgColor: "#16a34a",
    },
    {
      name: "In-App",
      percentage: 48,
      opened: 48,
      sent: "12,900",
      color: "#f97316", // orange-500
      bgColor: "#f97316",
    },
    {
      name: "SMS",
      percentage: 26,
      opened: 26,
      sent: "120,900",
      color: "#1e3a8a", // blue-900
      bgColor: "#1e3a8a",
    },
  ];

  const totalMessages = "200k";

  // Custom label renderer for pie chart
  const renderCustomLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, value, index } = props;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <g>
        <circle
          cx={x}
          cy={y}
          r={22}
          fill="white"
          stroke="#e5e7eb"
          strokeWidth={1}
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          className="text-sm font-semibold fill-gray-900"
        >
          {value}%
        </text>
      </g>
    );
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Channel Opened Rate
          </h2>
          <p className="text-gray-400 text-sm">Based on user interaction</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Donut Chart */}
          <div className="relative w-full lg:w-1/2 h-70">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channels}
                  cx="50%"
                  cy="50%"
                  innerRadius={85}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="percentage"
                  //   label={renderCustomLabel}
                  labelLine={false}
                  stroke="none"
                >
                  {channels.map((channel, index) => (
                    <Cell key={`cell-${index}`} fill={channel.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[37px] font-bold text-blue-900">200k</span>
              <span className="text-gray-400 text-sm mt-1">
                Messages were sent
              </span>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="w-full lg:w-1/2 space-y-6">
            {channels.map((channel, index) => (
              <div key={index} className="space-y-2">
                {/* Channel Header */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-medium text-lg">
                    {channel.name}
                  </span>
                  <span className="text-gray-900 font-semibold text-lg">
                    {channel.opened}% Opened
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${channel.percentage}%`,
                      backgroundColor: channel.color,
                    }}
                  />
                </div>

                {/* Sent Count */}
                <p className="text-gray-400 text-sm italic">
                  Over {channel.sent} were sent
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelOpenedRate;
