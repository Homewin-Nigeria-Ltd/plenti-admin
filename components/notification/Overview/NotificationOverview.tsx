import ChannelDeliveryRate from "./ChannelDeliveryRate";
import ChannelOpenedRate from "./ChannelOpenedRate";
import NotificationOverviewMetricCard from "./NotificationOverviewMetricCard";

const NotificationOverview = () => {
  return (
    <div>
      <NotificationOverviewMetricCard />
      <div className="grid grid-cols-2 gap-5 ">
        <ChannelDeliveryRate />
        <ChannelOpenedRate />
      </div>
    </div>
  );
};

export default NotificationOverview;
