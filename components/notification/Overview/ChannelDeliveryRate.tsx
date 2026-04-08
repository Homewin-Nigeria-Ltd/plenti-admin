import { NotificationData } from "@/types/NotificationTypes";
import React from "react";

interface ChannelStat {
  channel: "Email" | "In-App" | "SMS";
  sent_count: number;
  delivery_rate: number;
  open_rate: number;
}

interface ChannelDeliveryRateProps {
  channel_breakdown?: ChannelStat[];
  total?: number;
}

const ChannelDeliveryRate: React.FC<ChannelDeliveryRateProps> = ({
  channel_breakdown = [],
  total = 0,
}) => {
  const colors = ["#28A745", "#FF7A00", "#0B1E66"];
  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Channel Delivery Rate
          </h2>
          <p className="text-gray-500 text-sm">
            {total} notifications sent across all channels
          </p>
        </div>

        {/* Channels List */}
        <div className="space-y-8">
          {channel_breakdown.map((channel, index) => (
            <div key={index} className="space-y-2">
              {/* Channel Header */}
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-medium text-base">
                  {channel.channel}
                </span>
                <span className="text-green-700 font-semibold text-sm">
                  {channel.delivery_rate}% Delivered
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full bg-[${colors[index]}] rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${channel.delivery_rate}%` }}
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
  );
};

export default ChannelDeliveryRate;
