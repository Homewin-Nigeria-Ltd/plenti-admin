"use client";

import { useNotificationsStore } from "@/store/useNotificationsStore";
import ChannelDeliveryRate from "./ChannelDeliveryRate";
import ChannelOpenedRate from "./ChannelOpenedRate";
import NotificationOverviewMetricCard from "./NotificationOverviewMetricCard";
import { useEffect } from "react";

const NotificationOverview = () => {
  const { getNotificationStats, notificationStats } = useNotificationsStore();

  useEffect(() => {
    if (!notificationStats) {
      getNotificationStats();
    }
  }, [getNotificationStats, notificationStats]);

  return (
    <div>
      <NotificationOverviewMetricCard metrics={notificationStats} />
      <div className="grid grid-cols-2 gap-5 ">
        <ChannelDeliveryRate
          channel_breakdown={notificationStats?.channel_breakdown ?? []}
          total={notificationStats?.total_notifications}
        />
        <ChannelOpenedRate
          channel_breakdown={notificationStats?.channel_breakdown ?? []}
          total={notificationStats?.total_notifications}
        />
      </div>
    </div>
  );
};

export default NotificationOverview;
