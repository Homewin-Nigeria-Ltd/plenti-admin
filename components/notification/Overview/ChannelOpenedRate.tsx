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

interface ChannelStat {
  channel: "Email" | "In-App" | "SMS";
  sent_count: number;
  delivery_rate: number;
  open_rate: number;
}

interface ChannelOpenRateProps {
  channel_breakdown?: ChannelStat[];
  total?: number;
}

const ChannelOpenedRate: React.FC<ChannelOpenRateProps> = ({
  channel_breakdown = [],
  total = 0,
}) => {
  const colors = ["#28A745", "#FF7A00", "#0B1E66"];

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
            {total > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channel_breakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={85}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="sent_count"
                    //   label={renderCustomLabel}
                    labelLine={false}
                    stroke="none"
                  >
                    {channel_breakdown.map((channel, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No data</p>
              </div>
            )}

            {total > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[37px] font-bold text-blue-900">
                  {total}
                </span>
                <span className="text-gray-400 text-sm mt-1">
                  Messages were sent
                </span>
              </div>
            )}
          </div>

          {/* Progress Bars */}
          <div className="w-full lg:w-1/2 space-y-6">
            {channel_breakdown.map((channel, index) => (
              <div key={index} className="space-y-2">
                {/* Channel Header */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-medium text-lg">
                    {channel.channel}
                  </span>
                  <span className="text-gray-900 font-semibold text-lg">
                    {channel.open_rate}% Opened
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${channel.sent_count}%`,
                      backgroundColor: colors[index],
                    }}
                  />
                </div>

                {/* Sent Count */}
                <p className="text-gray-400 text-sm italic">
                  Over {channel.sent_count} were sent
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
